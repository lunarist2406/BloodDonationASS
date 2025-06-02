import React from "react";
import { AxiosContext } from "./AxiosContext";
import api from "./axiosInstance";

// Chỉ export React component ở đây
export const AxiosProvider = ({ children }:React.PropsWithChildren) => {
  return <AxiosContext.Provider value={api}>{children}</AxiosContext.Provider>;
};
