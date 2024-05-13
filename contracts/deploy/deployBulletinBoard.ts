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
  const cpArtifact = await deployer.loadArtifact("Cryptopasta");

  const agentTokenAddress = "0x986bD9FCecbe530A33c53E2a4333c9ae516ab892";
  const usdtAddress = "0xE7D83827A084208F7d65bf98D4B21c23C887da32";
  const priceConverterAddress = "0x308B8b1522AC9D555aa66a8d5153610b11668987";

  const bb = await deployer.deploy(
    bbArtifact,
    [agentTokenAddress, usdtAddress, priceConverterAddress],
    undefined,
    [bbArtifact.bytecode]
  );
  const bbAddress = await bb.getAddress();

  console.log(`BulletinBoard address: ${bbAddress}`);

  const bbContract = new ethers.Contract(bbAddress, bbArtifact.abi, wallet);

  const cryptopasta = await bbContract.CP();

  console.log(`Cryptopasta address: ${cryptopasta}`);

  const abiCoder = new ethers.AbiCoder();

  await verifyContract({
    address: bbAddress,
    contract: "contracts/core/BulletinBoard.sol:BulletinBoard",
    constructorArguments: abiCoder.encode(
      ["address", "address", "address"],
      [agentTokenAddress, usdtAddress, priceConverterAddress]
    ),
    bytecode: bbArtifact.bytecode,
  });

  // await verifyContract({
  //   address: cryptopasta,
  //   contract: "contracts/token/Cryptopasta.sol:Cryptopasta",
  //   constructorArguments: abiCoder.encode([], []),
  //   bytecode: cpArtifact.bytecode,
  // });

  console.log(`Done!`);
}
