import { PaymentContext } from "@/context/PaymentProvider";
import { useContext } from "react";

const usePayment = () => {
  return useContext(PaymentContext);
};

export default usePayment;
