import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
const OWNER_PRIVATE_KEY = process.env.SUB_WALLET_PRIVATE_KEY || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncSepoliaTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncSepoliaTestnet.url);
  const wallet = new Wallet(DEPLOYER_PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);
  const registryArtifact = await deployer.loadArtifact("AgentRegistry");

  const owner = new Wallet(OWNER_PRIVATE_KEY, provider);
  console.log("SC Account owner address: ", owner.address);
  console.log("SC Account owner pk: ", owner.privateKey);

  const registryAddress = "0xC40416509213951995078dba6a309F234c3eC9B8";

  const registry = new ethers.Contract(
    registryAddress,
    registryArtifact.abi,
    wallet
  );

  const accountAddress = await registry.agentToAccount(owner.address);

  console.log("Account address: ", accountAddress);

  const paymasterParams = utils.getPaymasterParams(
    "0x68f52F79D8bdD1ab1dd8f9C150Af111Dbf59d88d",
    {
      type: "General",
      innerInput: new Uint8Array(),
    }
  );

  const crTx = {
    from: accountAddress,
    to: wallet.address,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(accountAddress),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    } as types.Eip712Meta,
    value: ethers.parseEther("0.1"),
    gasPrice: await provider.getGasPrice(),
    gasLimit: 3000000,
    data: "0x",
  };

  console.log("Tx: ", crTx);

  const signedTxHash = EIP712Signer.getSignedDigest(crTx);

  console.log("Signed tx hash: ", signedTxHash);

  const signature = ethers.concat([
    ethers.Signature.from(owner.signingKey.sign(signedTxHash)).serialized,
  ]);

  console.log("Signature: ", signature);

  crTx.customData = {
    ...crTx.customData,
    customSignature: signature,
  };

  const serialized = types.Transaction.from(crTx).serialized;

  console.log("Serialized: ", serialized);

  const sentTx = await provider.broadcastTransaction(serialized);
  await sentTx.wait();

  console.log(`Done!`);
}
