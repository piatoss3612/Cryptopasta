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
  const paymasterArtifact = await deployer.loadArtifact("AgentPaymaster");

  const erc721Address = "0xF4A5e929a0B725fDe9D4e3eCC5F6108DD6207A4A";

  const paymaster = await deployer.deploy(
    paymasterArtifact,
    [erc721Address],
    undefined,
    [paymasterArtifact.bytecode]
  );
  const paymasterAddress = await paymaster.getAddress();
  console.log(`AA paymaster address: ${paymasterAddress}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: paymasterAddress,
    contract: "contracts/aa/AgentPaymaster.sol:AgentPaymaster",
    constructorArguments: abiCoder.encode(["address"], [erc721Address]),
    bytecode: paymasterArtifact.bytecode,
  });

  console.log(`Done!`);
}
