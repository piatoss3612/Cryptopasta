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
  const factoryArtifact = await deployer.loadArtifact("AgentAccountFactory");
  const aaArtifact = await deployer.loadArtifact("AgentAccount");

  const accountAddress = "0x36e5c73029a1d20ADf4E011B9A207e454Bb0196C";
  const ownerAddress = "0x3459D0E2935be1920BBEdB6064e181D31715ebad";
  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: accountAddress,
    contract: "contracts/aa/AgentAccount.sol:AgentAccount",
    constructorArguments: abiCoder.encode(["address"], [ownerAddress]),
    bytecode: aaArtifact.bytecode,
  });

  console.log(`Done!`);
}
