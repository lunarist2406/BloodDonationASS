import type { AxiosInstance } from "axios";
import { createContext, useContext } from "react";

export const AxiosContext = createContext<AxiosInstance | null>(null);
export const useAxios = () => {
  return useContext(AxiosContext);
};
