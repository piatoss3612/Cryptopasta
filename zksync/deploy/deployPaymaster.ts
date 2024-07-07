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

  const erc721Address = "0xc64149F1dc4b3d3Dc6157a9b7e94473cb4089D93";
  const priceConverterAddress = "0x824b601A2fEC9528829490BaC1C61d94DB575266";
  const mockUSDTAddress = "0xc8653E56042003482E7561Cf34d882da4f6709d4";

  const paymaster = await deployer.deploy(
    paymasterArtifact,
    [erc721Address, priceConverterAddress, mockUSDTAddress],
    undefined,
    [paymasterArtifact.bytecode]
  );
  const paymasterAddress = await paymaster.getAddress();
  console.log(`AA paymaster address: ${paymasterAddress}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: paymasterAddress,
    contract: "contracts/aa/AgentPaymaster.sol:AgentPaymaster",
    constructorArguments: abiCoder.encode(
      ["address", "address", "address"],
      [erc721Address, priceConverterAddress, mockUSDTAddress]
    ),
    bytecode: paymasterArtifact.bytecode,
  });

  console.log(`Done!`);
}
