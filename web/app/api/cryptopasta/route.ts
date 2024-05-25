import { NextRequest } from "next/server";
import { request, gql } from "graphql-request";
import { CryptopastaList } from "@/types";

const THE_GRAPH_CRYPTOPASTA_QUERY_URL =
  "https://api.studio.thegraph.com/query/71401/cryptopasta/version/latest";

const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const agentAddress = url.searchParams.get("agent_address");
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    let pageNum = page ? parseInt(page, 10) : 1;
    let limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1) {
      pageNum = 1;
    }

    if (limitNum < 1) {
      limitNum = 100;
    }

    const query = gql`
      {
        transferSingles(
          orderBy: cryptopasta_id,
          where: { to: "${agentAddress}" },
          skip: ${(pageNum - 1) * limitNum},
          first: ${limitNum}
        ) {
          cryptopasta_id
        }
      }
    `;

    const response = await request<CryptopastaList>(
      THE_GRAPH_CRYPTOPASTA_QUERY_URL,
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
