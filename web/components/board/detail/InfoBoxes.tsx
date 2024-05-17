import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { Report } from "@/types";
import PurchaseBox from "./PurchaseBox";
import RatingBox from "./RatingBox";
import ClaimBox from "./ClaimBox";
import { useAgent } from "@/hooks";

interface InfoBoxesProps {
  report: Report;
}

const InfoBoxes = ({ report }: InfoBoxesProps) => {
  const { account } = useAgent();

  const isReporter =
    account && account.toLowerCase() === report.reporter.toLowerCase();

  return (
    <SimpleGrid minW={["100%", "100%", "32%"]} columns={1} spacing={4} h="100%">
      <PurchaseBox reportId={report.reportId} priceInUSD={report.priceInUSD} />
      <RatingBox reportId={report.reportId} />
      {isReporter && <ClaimBox reportId={report.reportId} />}
    </SimpleGrid>
  );
};

export default InfoBoxes;
