import { BigNumber } from 'ethers';
import { useSigner } from 'state/signer';
import { ethers } from 'ethers';
import { CreationValues } from "modules/CreationPage/CreationForm";
import NFT_MARKET from "../../abis/NFTMarket.json";
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useOwnedNFTs from './useOwnedNFTs';
import useOwnedListedNFTs from './useOwnedListedNFTs';
import { NFT_MARKET_ADDRESS } from './config';
import useListedNFTs from './useListedNFTs';
import { NFT } from './interfaces';

const useNFTMarket = () => {
  const { signer } = useSigner();
  
  const nftMarket = new ethers.Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer);

  const ownedNFTs = useOwnedNFTs();
  const ownedListedNFTs = useOwnedListedNFTs();
  const listedNFTs = useListedNFTs()

  const createNFT = async (values: CreationValues) => {
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("description", values.description);
      data.append("image", values.image!);
      
      /** load image in nft storage(some service) 
       * (post on yourself (./api/nft-storage/) - 
       * here this handler) 
       * */
      const res = await fetch("/api/nft-storage", {
        method: "POST",
        body: data
      });

      // if image success loaded, fetch request to smartcontract with url on this nft
      if(res.status == 201) {
        const json = await res.json();
        const transaction: TransactionResponse = await nftMarket.createdNFT(json.uri);
        await transaction.wait();
      }
    } catch(err) {
      console.error(err);
    }
  }

  const listNFT = async (tokenID: string, price: BigNumber) => {
    const transaction: TransactionResponse = await nftMarket.listNFT(
      tokenID,
      price
    );
    await transaction.wait();
  };

  const cancelListing = async (tokenID: string) => {
    const transaction: TransactionResponse = await nftMarket.cancelListing(
      tokenID
    );
    await transaction.wait();
  };

  const buyNFT = async (nft: NFT) => {
    const transaction: TransactionResponse = await nftMarket.buyNFT(
      nft.id,
      {
        value: ethers.utils.parseEther(nft.price)
      }
    );
    await transaction.wait();
  };

  return { 
    createNFT, 
    listNFT, 
    cancelListing,
    buyNFT,
    ...ownedNFTs, 
    ...ownedListedNFTs,
    ...listedNFTs
  };
};

export default useNFTMarket;