import { PaymasterContext } from "@/context/PaymasterProvider";
import { useContext } from "react";

const usePaymaster = () => {
  return useContext(PaymasterContext);
};

export default usePaymaster;
