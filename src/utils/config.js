const { Defi, Token } = require("../../contracts/abi.json");

const ChainConfig = {
  core: {
    testnet: {
      id: 1115,
      name: "Core Blockchain Testnet",
      network: "Core Blockchain Testnet",
      nativeCurrency: {
        decimals: 18,
        name: "tCORE",
        symbol: "tCORE",
      },
      rpcUrls: ["https://rpc.test.btcs.network"],
      blockExplorers: ["https://scan.test.btcs.network"],
      DefiContract: {
        address: "0x1748A13Af65400808146615A6FBAda941C5eadDF",
        abi: Defi,
      },
      TokenContract: {
        address: "0xabCE63e2d95486862B88d1BA04A8AA75e6f023ae",
        abi: Token,
      },
    },
  },
};

export const chainConfig = ChainConfig.core.testnet;
export const defiContract = chainConfig.DefiContract;
export const tokenContract = chainConfig.TokenContract;
