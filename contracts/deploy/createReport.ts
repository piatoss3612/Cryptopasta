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
  const bbArtifact = await deployer.loadArtifact("BulletinBoard");

  const bbAddress = "0xaEe69d196eE2d35871cefdB8426A7b6056ca6C86";

  const bb = new ethers.Contract(bbAddress, bbArtifact.abi, wallet);

  const tx = await bb.createReport("TEST", "TEST", 123n, 0);
  await tx.wait();

  console.log(`Done!`);
}
