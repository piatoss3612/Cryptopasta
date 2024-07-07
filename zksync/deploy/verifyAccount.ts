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
  const aaArtifact = await deployer.loadArtifact("AgentAccount");

  const accountAddress = "0x071a9c84f529bdB59cEb1abCDfC5671fC23a021B";
  const ownerAddress = "0x24062377D22EE93Dc652E8Df32128C16a4326F98";
  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: accountAddress,
    contract: "contracts/aa/AgentAccount.sol:AgentAccount",
    constructorArguments: abiCoder.encode(["address"], [ownerAddress]),
    bytecode: aaArtifact.bytecode,
  });

  console.log(`Done!`);
}
