import { utils, Wallet, Provider } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
import { verifyContract } from "./utils";
dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncSepoliaTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncSepoliaTestnet.url);
  const wallet = new Wallet(DEPLOYER_PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);
  const priceConverterArtifact = await deployer.loadArtifact("PriceConverter");

  const ethToUsdPriceFeed = "0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF";
  const ethDecimals = 18;

  const usdtToUsdPriceFeed = "0x07F05C2aFeb54b68Ea425CAbCcbF53E2d5605d76";
  const usdtDecimals = 6;

  const priceConverter = await deployer.deploy(
    priceConverterArtifact,
    [ethToUsdPriceFeed, ethDecimals, usdtToUsdPriceFeed, usdtDecimals],
    undefined,
    [priceConverterArtifact.bytecode]
  );
  const priceConverterAddress = await priceConverter.getAddress();
  console.log(`PriceConverter address: ${priceConverterAddress}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: priceConverterAddress,
    contract: "contracts/chainlink/PriceConverter.sol:PriceConverter",
    constructorArguments: abiCoder.encode(
      ["address", "uint8", "address", "uint8"],
      [ethToUsdPriceFeed, ethDecimals, usdtToUsdPriceFeed, usdtDecimals]
    ),
    bytecode: priceConverterArtifact.bytecode,
  });

  console.log(`Done!`);
}
