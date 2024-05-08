import {
  AgentRegistered as AgentRegisteredEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PortraitAdded as PortraitAddedEvent
} from "../generated/agent_registry/agent_registry"
import {
  AgentRegistered,
  OwnershipTransferred,
  PortraitAdded
} from "../generated/schema"

export function handleAgentRegistered(event: AgentRegisteredEvent): void {
  let entity = new AgentRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.agent = event.params.agent
  entity.account = event.params.account
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePortraitAdded(event: PortraitAddedEvent): void {
  let entity = new PortraitAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.portraitId = event.params.portraitId
  entity.portrait = event.params.portrait

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
