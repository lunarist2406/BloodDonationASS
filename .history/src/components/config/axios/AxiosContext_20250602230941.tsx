import { createContext, useContext } from "react";

// Tạo context rỗng, không gán sẵn API tại đây
export const AxiosContext = createContext(null);
export const AxiosContext = createContext<AxiosInstance | null>(null);

// Custom hook
export const useAxios = () => {
  return useContext(AxiosContext);
};
