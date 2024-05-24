import {
  CryptopastaList,
  GetEntriesResponse,
  GetMissionsResponse,
  MissionLogList,
  Missions,
  PinResponse,
  Report,
  ReportList,
  TokenMetadata,
} from "@/types";
import axios from "axios";

const pinFileToIPFS = async (
  file: File,
  accessToken: string
): Promise<PinResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<PinResponse>(
    "http://localhost:8080/pinata/pinFile",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to pin file to IPFS");
  }

  return response.data;
};
const pinJsonToIPFS = async (
  name: string,
  description: string,
  image: string,
  accessToken: string
): Promise<PinResponse> => {
  const response = await axios.post<PinResponse>(
    "http://localhost:8080/pinata/pinJson",
    {
      name,
      description,
      image,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to pin JSON to IPFS");
  }

  return response.data;
};

const getReportList = async (
  page?: number,
  limit?: number,
  reporter?: string
): Promise<ReportList> => {
  const response = await axios.get<ReportList>("/api/report/list", {
    params: {
      page,
      limit,
      reporter,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch report list");
  }

  return response.data;
};

const getReportById = async (reportId: string): Promise<Report> => {
  const response = await axios.get<Report>(`/api/report/${reportId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch report");
  }

  return response.data;
};

const getCryptopastaList = async (
  agentAddress: string,
  page?: number,
  limit?: number
): Promise<CryptopastaList> => {
  const response = await axios.get<CryptopastaList>("/api/cryptopasta", {
    params: {
      agent_address: agentAddress,
      page,
      limit,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch cryptopasta list");
  }

  return response.data;
};

const getMissionLogList = async (
  agentAddress: string,
  page?: number,
  limit?: number
): Promise<MissionLogList> => {
  const response = await axios.get<MissionLogList>("/api/missionlog", {
    params: {
      agent_address: agentAddress,
      page,
      limit,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch mission log list");
  }

  return response.data;
};

const getTokenMetadata = async (uri: string): Promise<TokenMetadata> => {
  const response = await axios.get<TokenMetadata>(uri);

  if (response.status !== 200) {
    throw new Error("Failed to fetch token metadata");
  }

  return response.data;
};

const getMissions = async (
  accessToken: string,
  agentID: string,
  lastMissionID?: string,
  limit?: number
): Promise<Missions> => {
  const response = await axios.get<GetMissionsResponse>(
    "http://localhost:8080/mission",
    {
      params: {
        agentID,
        lastMissionID,
        limit,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to get missions");
  }

  return response.data.missions;
};

const getEntries = async (
  accessToken: string,
  missionID: string
): Promise<GetEntriesResponse> => {
  const response = await axios.get<GetEntriesResponse>(
    `http://localhost:8080/mission/${missionID}/entries`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to get entries");
  }

  return response.data;
};

export {
  pinFileToIPFS,
  pinJsonToIPFS,
  getReportList,
  getReportById,
  getTokenMetadata,
  getCryptopastaList,
  getMissionLogList,
  getMissions,
  getEntries,
};
