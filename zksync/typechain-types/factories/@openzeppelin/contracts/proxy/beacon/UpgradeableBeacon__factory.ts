/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  UpgradeableBeacon,
  UpgradeableBeaconInterface,
} from "../../../../../@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation_",
        type: "address",
      },
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "BeaconInvalidImplementation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x0002000000000002000000000301001900000060033002700000004c033001970000000100200190000000290000c13d0000008002000039000000400020043f000000040030008c000001100000413d000000000201043b000000e002200270000000590020009c0000005d0000a13d0000005a0020009c000000670000613d0000005b0020009c0000007f0000613d0000005c0020009c000001100000c13d000000240030008c000001100000413d0000000002000416000000000002004b000001100000c13d0000000401100370000000000101043b0000004e0010009c000001100000213d000000000200041a0000004e052001970000000003000411000000000035004b000000e40000c13d0000004e06100198000000ee0000c13d0000005801000041000000800010043f000000840000043f00000060010000410000012d000104300000000002000416000000000002004b000001100000c13d0000001f023000390000004d022001970000008002200039000000400020043f0000001f0230018f000000050430027200000005044002100000003b0000613d00000080050000390000008006400039000000000701034f000000007807043c0000000005850436000000000065004b000000370000c13d000000000002004b000000490000613d000000000141034f00000003022002100000008004400039000000000504043300000000052501cf000000000525022f000000000101043b0000010002200089000000000121022f00000000012101cf000000000151019f0000000000140435000000400030008c000001100000413d000000800300043d0000004e0030009c000001100000213d000000a00600043d0000004e0060009c000001100000213d000000400200043d000000000006004b000000b10000c13d00000058010000410000000000120435000000040120003900000000000104350000004c0020009c0000004c02008041000000400120021000000057011001c70000012d000104300000005d0020009c000000870000613d0000005e0020009c000001100000c13d0000000001000416000000000001004b000001100000c13d0000000101000039000000000101041a000000830000013d0000000001000416000000000001004b000001100000c13d000000000100041a0000004e051001970000000002000411000000000025004b000000de0000c13d0000004f01100197000000000010041b00000000010004140000004c0010009c0000004c01008041000000c00110021000000050011001c70000800d02000039000000030300003900000051040000410000000006000019012b01210000040f0000000100200190000001100000613d00000000010000190000012c0001042e0000000001000416000000000001004b000001100000c13d000000000100041a0000004e01100197000000800010043f00000061010000410000012c0001042e000000240030008c000001100000413d0000000002000416000000000002004b000001100000c13d0000000401100370000000000301043b0000004e0030009c000001100000213d000000000100041a0000004e021001970000000001000411000000000012004b000000e90000c13d00000052010000410000000000100439000000040030044300000000010004140000004c0010009c0000004c01008041000000c00110021000000053011001c70000800202000039000200000003001d012b01260000040f0000000100200190000000e30000613d00000002020000290000004e05200197000000000101043b000000000001004b000001120000c13d000000400100043d00000056020000410000000000210435000000040210003900000000005204350000004c0010009c0000004c01008041000000400110021000000057011001c70000012d00010430000100000002001d000000000100041a0000004f02100197000000000262019f000000000020041b0000000002000414000200000003001d0000004e051001970000004c0020009c0000004c02008041000000c00120021000000050011001c70000800d0200003900000003030000390000005104000041012b01210000040f00000002030000290000000100200190000001100000613d00000052010000410000000000100439000000040030044300000000010004140000004c0010009c0000004c01008041000000c00110021000000053011001c70000800202000039012b01260000040f0000000100200190000000e30000613d000000000101043b000000000001004b000000fa0000c13d0000005601000041000000010300002900000000001304350000000401300039000000020200002900000000002104350000004c0030009c0000004c03008041000000400130021000000057011001c70000012d000104300000005f01000041000000800010043f000000840020043f00000060010000410000012d00010430000000000001042f0000005f01000041000000800010043f000000840030043f00000060010000410000012d000104300000005f02000041000000800020043f000000840010043f00000060010000410000012d000104300000004f01200197000000000161019f000000000010041b00000000010004140000004c0010009c0000004c01008041000000c00110021000000050011001c70000800d02000039000000030300003900000051040000410000007a0000013d0000000101000039000000000201041a0000004f022001970000000205000029000000000252019f000000000021041b00000000010004140000004c0010009c0000004c01008041000000c00110021000000050011001c70000800d0200003900000002030000390000005404000041012b01210000040f0000000100200190000001100000613d00000020010000390000010000100443000001200000044300000055010000410000012c0001042e00000000010000190000012d000104300000000101000039000000000201041a0000004f02200197000000000252019f000000000021041b00000000010004140000004c0010009c0000004c01008041000000c00110021000000050011001c70000800d02000039000000020300003900000054040000410000007a0000013d000000000001042f00000124002104210000000102000039000000000001042d0000000002000019000000000001042d00000129002104230000000102000039000000000001042d0000000002000019000000000001042d0000012b000004320000012c0001042e0000012d000104300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000001ffffffe0000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000008be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e01806aa1896bbf26568e884a7374b41e002500962caba6a15023a8d90e8508b830200000200000000000000000000000000000024000000000000000000000000bc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b0000000200000000000000000000000000000040000001000000000000000000847ac5640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000001e4fbdf70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000715018a500000000000000000000000000000000000000000000000000000000715018a6000000000000000000000000000000000000000000000000000000008da5cb5b00000000000000000000000000000000000000000000000000000000f2fde38b000000000000000000000000000000000000000000000000000000003659cfe6000000000000000000000000000000000000000000000000000000005c60da1b118cdaa7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024000000800000000000000000000000000000000000000000000000000000002000000080000000000000000014c592e71797479845bf41aeab7a05595013a9a5385616296483be14f8942783";

type UpgradeableBeaconConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UpgradeableBeaconConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UpgradeableBeacon__factory extends ContractFactory {
  constructor(...args: UpgradeableBeaconConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    implementation_: AddressLike,
    initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      implementation_,
      initialOwner,
      overrides || {}
    );
  }
  override deploy(
    implementation_: AddressLike,
    initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      implementation_,
      initialOwner,
      overrides || {}
    ) as Promise<
      UpgradeableBeacon & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): UpgradeableBeacon__factory {
    return super.connect(runner) as UpgradeableBeacon__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UpgradeableBeaconInterface {
    return new Interface(_abi) as UpgradeableBeaconInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): UpgradeableBeacon {
    return new Contract(address, _abi, runner) as unknown as UpgradeableBeacon;
  }
}
