/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IKnownCodesStorage,
  IKnownCodesStorageInterface,
} from "../../../../../../@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IKnownCodesStorage";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "bytecodeHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "sendBytecodeToL1",
        type: "bool",
      },
    ],
    name: "MarkedAsKnown",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
    ],
    name: "getMarker",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_bytecodeHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_l1PreimageHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_l1PreimageBytesLen",
        type: "uint256",
      },
    ],
    name: "markBytecodeAsPublished",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_shouldSendToL1",
        type: "bool",
      },
      {
        internalType: "bytes32[]",
        name: "_hashes",
        type: "bytes32[]",
      },
    ],
    name: "markFactoryDeps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IKnownCodesStorage__factory {
  static readonly abi = _abi;
  static createInterface(): IKnownCodesStorageInterface {
    return new Interface(_abi) as IKnownCodesStorageInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IKnownCodesStorage {
    return new Contract(address, _abi, runner) as unknown as IKnownCodesStorage;
  }
}
