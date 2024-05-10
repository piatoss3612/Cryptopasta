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
  const registryArtifact = await deployer.loadArtifact("AgentRegistry");
  const agentTokenArtifact = await deployer.loadArtifact("Agent");

  const factoryAddress = "0x4d7068BaA2fB745Ff606778a946394986D91c246";
  const portraits = [
    "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmfPN898BsCRsinpvNZkw1uQyw9HjApWZKKrMyZq9RXUqu",
    "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmVoH7ptD5K78dsBa9hqnEhGU91epgnhdqxWZdZgaJd485",
    "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmaXymEBvAqpbVo7uX682arywHFjiw4yuH8A98hw8crG7Z",
    "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmXTxdydZDs62hC3HUSq1y3JboqcFMnVVQgm9Td28U3U96",
  ];

  const registry = await deployer.deploy(
    registryArtifact,
    [factoryAddress, portraits],
    undefined,
    [registryArtifact.bytecode]
  );
  const registryAddress = await registry.getAddress();

  console.log(`Agent registry address: ${registryAddress}`);

  const registryContract = new ethers.Contract(
    registryAddress,
    registryArtifact.abi,
    wallet
  );

  const agentTokenAddress = await registryContract.AGENT_TOKEN();

  console.log(`Agent token address: ${agentTokenAddress}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: registryAddress,
    contract: "contracts/core/AgentRegistry.sol:AgentRegistry",
    constructorArguments: abiCoder.encode(
      ["address", "string[]"],
      [factoryAddress, portraits]
    ),
    bytecode: registryArtifact.bytecode,
  });

  console.log(`Done!`);
}
