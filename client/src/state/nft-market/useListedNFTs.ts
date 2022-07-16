import { 
  GetListedNFTs, 
  GetListedNFTsVariables,
} from './__generated__/GetListedNFTs';
import { gql, useQuery } from "@apollo/client";
import { useSigner } from 'state/signer';
import { parseRawNFT } from './helpers';
import { NFT_MARKET_ADDRESS } from './config';

const useListedNFTs = () => {
  const { address } = useSigner();

  const { data } = useQuery<GetListedNFTs, GetListedNFTsVariables>(
    GET_LISTED_NFTS,
    { 
      variables: { currentAddress:  address ?? ""},
      skip: !address
    }
  )

  const listNFTs = data?.nfts.map(parseRawNFT);

  return { listNFTs };
}

const GET_LISTED_NFTS = gql`
  query GetListedNFTs($currentAddress: String!) {
    nfts(where: { 
      to: "${NFT_MARKET_ADDRESS}", 
      from_not: $currentAddress 
    }) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;

export default useListedNFTs;