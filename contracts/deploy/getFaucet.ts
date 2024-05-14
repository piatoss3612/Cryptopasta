import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  AgentRegistry__factory,
  BulletinBoard__factory,
} from "../typechain-types/factories/contracts/core";

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

  const accountAddress = await registry.agentToAccount(owner.address);

  console.log("Account address: ", accountAddress);

  const paymasterParams = utils.getPaymasterParams(
    "0x68f52F79D8bdD1ab1dd8f9C150Af111Dbf59d88d",
    {
      type: "General",
      innerInput: new Uint8Array(),
    }
  );

  const faucetTx: types.Transaction = {
    from: accountAddress,
    to: "0xE7D83827A084208F7d65bf98D4B21c23C887da32",
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(accountAddress),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    } as types.Eip712Meta,
    gasPrice: await provider.getGasPrice(),
    gasLimit: BigInt(1000000),
    data: "0xde5f72fd",
  };

  console.log("Tx: ", faucetTx);

  const signedTxHash = EIP712Signer.getSignedDigest(faucetTx);

  console.log("Signed tx hash: ", signedTxHash);

  const signature = ethers.concat([
    ethers.Signature.from(owner.signingKey.sign(signedTxHash)).serialized,
  ]);

  console.log("Signature: ", signature);

  faucetTx.customData = {
    ...faucetTx.customData,
    customSignature: signature,
  };

  const serialized = types.Transaction.from(faucetTx).serialized;

  console.log("Serialized: ", serialized);

  const sentTx = await provider.broadcastTransaction(serialized);

  await sentTx.wait();

  console.log("Faucet tx hash: ", sentTx.hash);

  console.log(`Done!`);
}
