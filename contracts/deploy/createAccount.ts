import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { AgentRegistry__factory } from "../typechain-types/factories/contracts/core";

// load env file
import dotenv from "dotenv";
dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
const OWNER_PRIVATE_KEY = process.env.SUB_WALLET_PRIVATE_KEY || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncSepoliaTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncSepoliaTestnet.url);
  const wallet = new Wallet(DEPLOYER_PRIVATE_KEY, provider);

  const owner = new Wallet(OWNER_PRIVATE_KEY, provider);
  console.log("SC Account owner address: ", owner.address);
  console.log("SC Account owner pk: ", owner.privateKey);

  const registryAddress = "0xC40416509213951995078dba6a309F234c3eC9B8";

  const registry = AgentRegistry__factory.connect(registryAddress, wallet);

  const tx = await registry.register(owner.address, 2);

  await tx.wait();

  console.log("Tx: ", tx);

  const accountAddress = await registry.agentToAccount(owner.address);

  console.log("Account address: ", accountAddress);

  console.log(`Done!`);
}
