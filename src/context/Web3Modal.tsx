"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Set chains
const coreTestnet = {
  chainId: 1115,
  name: "Core Blockchain Testnet",
  currency: "tCORE",
  explorerUrl: "https://scan.test.btcs.network",
  rpcUrl: "https://rpc.test.btcs.network",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [coreTestnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Web3Modal({ children }) {
  return children;
}
