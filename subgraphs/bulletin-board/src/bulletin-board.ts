import {
  OwnershipTransferred as OwnershipTransferredEvent,
  ReportDiscovery as ReportDiscoveryEvent,
  ReportRated as ReportRatedEvent,
  ReportTaken as ReportTakenEvent,
  SalesClaimed as SalesClaimedEvent
} from "../generated/bulletin_board/bulletin_board"
import {
  OwnershipTransferred,
  ReportDiscovery,
  ReportRated,
  ReportTaken,
  SalesClaimed
} from "../generated/schema"

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

export function handleReportDiscovery(event: ReportDiscoveryEvent): void {
  let entity = new ReportDiscovery(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reportId = event.params.reportId
  entity.reporter = event.params.reporter
  entity.priceInUSD = event.params.priceInUSD
  entity.title = event.params.title
  entity.contentURI = event.params.contentURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReportRated(event: ReportRatedEvent): void {
  let entity = new ReportRated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reportId = event.params.reportId
  entity.rater = event.params.rater
  entity.rating = event.params.rating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReportTaken(event: ReportTakenEvent): void {
  let entity = new ReportTaken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reportId = event.params.reportId
  entity.buyer = event.params.buyer
  entity.paymentMethod = event.params.paymentMethod

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSalesClaimed(event: SalesClaimedEvent): void {
  let entity = new SalesClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reportId = event.params.reportId
  entity.caller = event.params.caller
  entity.amountInETH = event.params.amountInETH
  entity.amountInUSDT = event.params.amountInUSDT

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
