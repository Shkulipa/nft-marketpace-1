import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type TSignerCtx = {
  signer?: JsonRpcSigner;
  address?: string;
  loading: boolean;
  connectWallet: () => Promise<void>;
}

const SignerCtx = createContext<TSignerCtx>({} as any);
export const useSigner = () => useContext(SignerCtx);

export function SignerProvider({ children }: { children: ReactNode }) {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const web3model = new Web3Modal();
    if(web3model.cachedProvider) connectWallet();
    window.ethereum.on("accountsChanged", connectWallet);
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const web3model = new Web3Modal({ cacheProvider: true });
      const istance = await web3model.connect();
      const provider = new Web3Provider(istance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setSigner(signer);
      setAddress(address);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const ctxValue = { signer, address, loading, connectWallet };
  
  return (
    <SignerCtx.Provider value={ctxValue}>
      {children}
    </SignerCtx.Provider>
  )
}

