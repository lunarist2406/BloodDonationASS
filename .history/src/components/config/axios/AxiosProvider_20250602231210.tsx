import React, { FC } from "react";
import { AxiosContext } from "./AxiosContext";
import api from "./axiosInstance";

export const AxiosProvider: FC = ({ children }) => {
  return (
    <AxiosContext.Provider value={api}>
      {children}
    </AxiosContext.Provider>
  );
};
