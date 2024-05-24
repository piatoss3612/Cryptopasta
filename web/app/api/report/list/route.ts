import { NextRequest } from "next/server";
import { request, gql } from "graphql-request";
import { ReportList } from "@/types";

const THE_GRAPH_MISSION_BOARD_QUERY_URL =
  "https://api.studio.thegraph.com/query/71401/bulletin-board/v1.0.0";

const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    const reporter = url.searchParams.get("reporter");
    let pageNum = page ? parseInt(page, 10) : 1;
    let limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1) {
      pageNum = 1;
    }

    if (limitNum < 1) {
      limitNum = 10;
    }

    const query = gql`
      {
        reportDiscoveries(
            first: ${limitNum},
            skip: ${(pageNum - 1) * limitNum},
            where: {
              reporter_contains: "${reporter || ""}"
            },
            orderBy: reportId,
            orderDirection: desc
        ) {
            id
            reportId
            reporter
            priceInUSD
            title
            blockTimestamp
        }
      }
    `;

    const response = await request<ReportList>(
      THE_GRAPH_MISSION_BOARD_QUERY_URL,
      query
    );

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
