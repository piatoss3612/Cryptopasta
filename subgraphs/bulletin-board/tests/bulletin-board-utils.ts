import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  ReportDiscovery,
  ReportRated,
  ReportTaken,
  SalesClaimed
} from "../generated/bulletin_board/bulletin_board"

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

export function createReportDiscoveryEvent(
  reportId: BigInt,
  reporter: Address,
  priceInUSD: BigInt,
  title: string,
  contentURI: string
): ReportDiscovery {
  let reportDiscoveryEvent = changetype<ReportDiscovery>(newMockEvent())

  reportDiscoveryEvent.parameters = new Array()

  reportDiscoveryEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  reportDiscoveryEvent.parameters.push(
    new ethereum.EventParam("reporter", ethereum.Value.fromAddress(reporter))
  )
  reportDiscoveryEvent.parameters.push(
    new ethereum.EventParam(
      "priceInUSD",
      ethereum.Value.fromUnsignedBigInt(priceInUSD)
    )
  )
  reportDiscoveryEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  reportDiscoveryEvent.parameters.push(
    new ethereum.EventParam("contentURI", ethereum.Value.fromString(contentURI))
  )

  return reportDiscoveryEvent
}

export function createReportRatedEvent(
  reportId: BigInt,
  rater: Address,
  rating: i32
): ReportRated {
  let reportRatedEvent = changetype<ReportRated>(newMockEvent())

  reportRatedEvent.parameters = new Array()

  reportRatedEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  reportRatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  reportRatedEvent.parameters.push(
    new ethereum.EventParam(
      "rating",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(rating))
    )
  )

  return reportRatedEvent
}

export function createReportTakenEvent(
  reportId: BigInt,
  buyer: Address,
  paymentMethod: i32
): ReportTaken {
  let reportTakenEvent = changetype<ReportTaken>(newMockEvent())

  reportTakenEvent.parameters = new Array()

  reportTakenEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  reportTakenEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  reportTakenEvent.parameters.push(
    new ethereum.EventParam(
      "paymentMethod",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(paymentMethod))
    )
  )

  return reportTakenEvent
}

export function createSalesClaimedEvent(
  reportId: BigInt,
  caller: Address,
  amountInETH: BigInt,
  amountInUSDT: BigInt
): SalesClaimed {
  let salesClaimedEvent = changetype<SalesClaimed>(newMockEvent())

  salesClaimedEvent.parameters = new Array()

  salesClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  salesClaimedEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  salesClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "amountInETH",
      ethereum.Value.fromUnsignedBigInt(amountInETH)
    )
  )
  salesClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "amountInUSDT",
      ethereum.Value.fromUnsignedBigInt(amountInUSDT)
    )
  )

  return salesClaimedEvent
}
