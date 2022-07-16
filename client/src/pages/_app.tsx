import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout";
import { SignerProvider } from "./../state/signer";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({ 
  cache: new InMemoryCache(), 
  uri: process.env.NEXT_PUBLIC_GRAPH_URL
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SignerProvider>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </SignerProvider>
  );
};

export default MyApp;
