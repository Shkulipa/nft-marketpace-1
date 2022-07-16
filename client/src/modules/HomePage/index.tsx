import NFTCard from "components/NFTCard";
import useNFTMarket from "state/nft-market";

const HomePage = () => {
  const { listNFTs } = useNFTMarket();
  
  return (
    <div className="flex w-full flex-col">
      {/* all NFTs*/}
      <div className="flex flex-wrap">
        {listNFTs?.map(nft => {
          return (
            <NFTCard nft={nft} className="mr-2 mb-2" key={nft.id} />
          )
        })}
      </div>
    </div>
  );
};

export default HomePage;
