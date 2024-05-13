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
  const mockUSDTArtifact = await deployer.loadArtifact("MockUSDT");
  const missionLogArtifact = await deployer.loadArtifact("MissionLog");

  const mockUSDT = await deployer.deploy(mockUSDTArtifact, [], undefined, [
    mockUSDTArtifact.bytecode,
  ]);

  const mockUSDTAddress = await mockUSDT.getAddress();

  console.log(`MockUSDT address: ${mockUSDTAddress}`);

  const agentTokenAddress = "0x986bD9FCecbe530A33c53E2a4333c9ae516ab892";

  const missionLog = await deployer.deploy(
    missionLogArtifact,
    [agentTokenAddress],
    undefined,
    [missionLogArtifact.bytecode]
  );

  const missionLogAddress = await missionLog.getAddress();

  console.log(`MissionLog address: ${missionLogAddress}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: missionLogAddress,
    contract: "contracts/token/MissionLog.sol:MissionLog",
    constructorArguments: abiCoder.encode(["address"], [agentTokenAddress]),
    bytecode: missionLogArtifact.bytecode,
  });

  await verifyContract({
    address: mockUSDTAddress,
    contract: "contracts/mock/MockUSDT.sol:MockUSDT",
    constructorArguments: abiCoder.encode([], []),
    bytecode: mockUSDTArtifact.bytecode,
  });

  console.log(`Done!`);
}
