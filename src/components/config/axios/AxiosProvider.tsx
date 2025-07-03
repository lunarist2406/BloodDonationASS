import { AxiosContext } from "./AxiosContext";
import { api } from "./axiosInstance";

export const AxiosProvider = ({ children }:React.PropsWithChildren) => {
  return <AxiosContext.Provider value={api}>{children}</AxiosContext.Provider>;
};
