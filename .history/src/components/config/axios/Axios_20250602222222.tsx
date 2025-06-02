import React, { createContext, useContext } from 'react';
import api from './axiosInstance'; // import instance từ file khác

// Tạo context để cung cấp instance Axios
const AxiosContext = createContext(api);

// Tạo provider cho Axios
export const AxiosProvider = ({ children }) => {
  return (
    <AxiosContext.Provider value={api}>
      {children}
    </AxiosContext.Provider>
  );
};

// Custom hook để sử dụng Axios instance
export const useAxios = () => {
  return useContext(AxiosContext);
};
