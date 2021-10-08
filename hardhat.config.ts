require("dotenv").config();
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {},
  etherscan: {},
};

const {
  ETH_RPC_URL_RINKEBY,
  POLYGON_RPC_URL_MUMBAI,
  POLYGON_RPC_URL_MATIC,
  PRIVATE_KEY_RINKEBY,
  PRIVATE_KEY_MUMBAI,
  PRIVATE_KEY_MATIC,
  ETHERSCAN_API_KEY,
  PRIVATE_KEY_MAINNET,
  ETH_RPC_URL_MAINNET,
  CORGI_TREASURY_ADDRESS,
} = process.env;

if (ETH_RPC_URL_RINKEBY && PRIVATE_KEY_RINKEBY) {
  (config.networks as any).rinkeby = {
    url: ETH_RPC_URL_RINKEBY,
    accounts: [PRIVATE_KEY_RINKEBY],
  };
}

if (ETH_RPC_URL_MAINNET && PRIVATE_KEY_MAINNET) {
  (config.networks as any).mainnet = {
    url: ETH_RPC_URL_MAINNET,
    accounts: [PRIVATE_KEY_MAINNET],
  };
}

if (POLYGON_RPC_URL_MUMBAI && PRIVATE_KEY_MUMBAI) {
  (config.networks as any).mumbai = {
    url: POLYGON_RPC_URL_MUMBAI,
    accounts: [PRIVATE_KEY_MUMBAI],
  };
}

if (POLYGON_RPC_URL_MATIC && PRIVATE_KEY_MATIC) {
  (config.networks as any).matic = {
    url: POLYGON_RPC_URL_MATIC,
    accounts: [PRIVATE_KEY_MATIC],
  };
}

if (ETHERSCAN_API_KEY) {
  (config.etherscan as any).apiKey = ETHERSCAN_API_KEY;
}

export default config as HardhatUserConfig;

const MAINNET_TOKEN_METADATA_URI = "https://cryptocorgis.co/api/token-metadata/{id}";
const RINKEBY_TOKEN_METADATA_URI = "https://rinkeby.cryptocorgis.co/api/token-metadata/{id}";
const MUMBAI_TOKEN_METADATA_URI = "https://mumbai.cryptocorgis.co/api/token-metadata/{id}";
const MATIC_TOKEN_METADATA_URI = "https://matic.cryptocorgis.co/api/token-metadata/{id}";
const CONTRACT_METADATA_URI = "https://cryptocorgis.co/api/contract-metadata";

task("deploy_breeder", "Deploy the CryptoCorgisBreeder smart contract", async (args, hre) => {
  const breederFactory = await hre.ethers.getContractFactory("CryptoCorgisBreeder");
  const tokenMetadataUri = hre.network.name === "rinkeby" ? RINKEBY_TOKEN_METADATA_URI 
  : hre.network.name === "mumbai" ? MUMBAI_TOKEN_METADATA_URI
  : hre.network.name === "matic" ? MATIC_TOKEN_METADATA_URI
  : MAINNET_TOKEN_METADATA_URI ;
  const breeder = await breederFactory.deploy(tokenMetadataUri, CONTRACT_METADATA_URI, CORGI_TREASURY_ADDRESS);
  await breeder.deployed();
  console.log(
    "Deployed CryptoCorgisBreeder: ",
    breeder.address,
    tokenMetadataUri,
    CONTRACT_METADATA_URI,
    CORGI_TREASURY_ADDRESS,
  );
});
