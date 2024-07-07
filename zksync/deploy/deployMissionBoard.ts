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
  const mbArtifact = await deployer.loadArtifact("MissionBoard");
  const cpArtifact = await deployer.loadArtifact("Cryptopasta");

  const agentTokenAddress = "0xc64149F1dc4b3d3Dc6157a9b7e94473cb4089D93";
  const usdtAddress = "0xc8653E56042003482E7561Cf34d882da4f6709d4";
  const priceConverterAddress = "0x824b601A2fEC9528829490BaC1C61d94DB575266";

  const mb = await deployer.deploy(
    mbArtifact,
    [agentTokenAddress, usdtAddress, priceConverterAddress],
    undefined,
    [mbArtifact.bytecode]
  );
  const mbAddress = await mb.getAddress();

  console.log(`MissionBoard address: ${mbAddress}`);

  const bbContract = new ethers.Contract(mbAddress, mbArtifact.abi, wallet);

  const cryptopasta = await bbContract.CP();

  console.log(`Cryptopasta address: ${cryptopasta}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: mbAddress,
    contract: "contracts/core/MissionBoard.sol:MissionBoard",
    constructorArguments: abiCoder.encode(
      ["address", "address", "address"],
      [agentTokenAddress, usdtAddress, priceConverterAddress]
    ),
    bytecode: mbArtifact.bytecode,
  });

  // await verifyContract({
  //   address: cryptopasta,
  //   contract: "contracts/token/Cryptopasta.sol:Cryptopasta",
  //   constructorArguments: abiCoder.encode([], []),
  //   bytecode: cpArtifact.bytecode,
  // });

  console.log(`Done!`);
}
