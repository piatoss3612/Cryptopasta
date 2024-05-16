import { PinResponse, ReportList } from "@/types";
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

const getReportList = async (page?: number, limit?: number) => {
  const response = await axios.get<ReportList>("/api/report/list", {
    params: {
      page,
      limit,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch report list");
  }

  return response.data;
};

const getReportById = async (reportId: string) => {
  const response = await axios.get<Report>(`/api/report/${reportId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch report");
  }

  return response.data;
};

export { pinFileToIPFS, pinJsonToIPFS, getReportList, getReportById };
