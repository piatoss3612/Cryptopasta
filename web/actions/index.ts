import { PinResponse } from "@/libs/types";
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

export { pinFileToIPFS, pinJsonToIPFS };
