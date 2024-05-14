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

  const factory = await deployer.deploy(
    factoryArtifact,
    [utils.hashBytecode(aaArtifact.bytecode)],
    undefined,
    [aaArtifact.bytecode]
  );
  const factoryAddress = await factory.getAddress();
  console.log(`AA factory address: ${factoryAddress}`);

  const aaFactory = new ethers.Contract(
    factoryAddress,
    factoryArtifact.abi,
    wallet
  );

  const owner = Wallet.createRandom();
  console.log("SC Account owner address: ", owner.address);
  console.log("SC Account owner pk: ", owner.privateKey);

  const salt = ethers.ZeroHash;
  const tx = await aaFactory.deployAccount(salt, owner.address);
  await tx.wait();

  const abiCoder = new ethers.AbiCoder();
  const accountAddress = utils.create2Address(
    factoryAddress,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address"], [owner.address])
  );

  console.log(`SC Account deployed on address ${accountAddress}`);

  await verifyContract({
    address: factoryAddress,
    contract: "contracts/aa/AgentAccountFactory.sol:AgentAccountFactory",
    constructorArguments: abiCoder.encode(
      ["bytes32"],
      [utils.hashBytecode(aaArtifact.bytecode)]
    ),
    bytecode: factoryArtifact.bytecode,
  });

  await verifyContract({
    address: accountAddress,
    contract: "contracts/aa/AgentAccount.sol:AgentAccount",
    constructorArguments: abiCoder.encode(["address"], [owner.address]),
    bytecode: aaArtifact.bytecode,
  });

  console.log(`Done!`);
}
