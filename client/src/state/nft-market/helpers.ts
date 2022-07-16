import { ethers } from "ethers"
import { NFT } from "./interfaces"
import { GetOwnedListedNFTs_nfts } from "./__generated__/GetOwnedListedNFTs"

export const parseRawNFT = (raw: GetOwnedListedNFTs_nfts): NFT => {
  return {
    id: raw.id,
    owner: raw.price == "0" ? raw.to : raw.from,
    price: raw.price == "0" ? "0" : ethers.utils.formatEther(raw.price),
    tokenURI: raw.tokenURI
  }
}