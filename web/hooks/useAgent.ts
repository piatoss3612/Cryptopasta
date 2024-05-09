import { AgentContext } from "@/context/AgentProvider";
import { useContext } from "react";

const useAgent = () => {
  return useContext(AgentContext);
};

export default useAgent;
