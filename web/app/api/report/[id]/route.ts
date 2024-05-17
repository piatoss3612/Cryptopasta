import { NextRequest } from "next/server";
import { request, gql } from "graphql-request";
import { Report } from "@/types";

const THE_GRAPH_MISSION_BOARD_QUERY_URL =
  "https://api.studio.thegraph.com/query/71401/bulletin-board/version/latest";

const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;

    const query = gql`
      {
        reportDiscovery(id: "${id}") {
          blockTimestamp
          title
          contentURI
          reportId
          reporter
          priceInUSD
        }
      }
    `;

    const response = await request<Report>(
      THE_GRAPH_MISSION_BOARD_QUERY_URL,
      query
    );

    // const response: Report = {
    //   reportId: "1",
    //   reporter: "0x1234567890",
    //   priceInUSD: "100000",
    //   title: "Test Report",
    //   contentURI:
    //     "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/Qmduw3yGFQALg6iFfaNssnQKJQCaZHTxBN1qNsq76hDkJL",
    //   blockTimestamp: "1630368000",
    // };

    return Response.json(response, { status: 200 });
  } catch (e) {
    console.log(e);
    const error = e as Error;
    return Response.json(
      {
        data: error.message,
      },
      { status: 500 }
    );
  }
};

export { GET };
