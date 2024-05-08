import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AgentRegistered,
  OwnershipTransferred,
  PortraitAdded
} from "../generated/agent_registry/agent_registry"

export function createAgentRegisteredEvent(
  agent: Address,
  account: Address,
  tokenId: BigInt
): AgentRegistered {
  let agentRegisteredEvent = changetype<AgentRegistered>(newMockEvent())

  agentRegisteredEvent.parameters = new Array()

  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam("agent", ethereum.Value.fromAddress(agent))
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  agentRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return agentRegisteredEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPortraitAddedEvent(
  portraitId: BigInt,
  portrait: string
): PortraitAdded {
  let portraitAddedEvent = changetype<PortraitAdded>(newMockEvent())

  portraitAddedEvent.parameters = new Array()

  portraitAddedEvent.parameters.push(
    new ethereum.EventParam(
      "portraitId",
      ethereum.Value.fromUnsignedBigInt(portraitId)
    )
  )
  portraitAddedEvent.parameters.push(
    new ethereum.EventParam("portrait", ethereum.Value.fromString(portrait))
  )

  return portraitAddedEvent
}
