// src/config/AxiosConfig.jsx
import React, { createContext, useContext } from 'react';
import axios from 'axios';

// Tạo cấu hình Axios
const config = {
    baseURL: "https://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
};

// Tạo instance Axios
const api = axios.create(config);

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

// Xuất Axios instance và các component cần thiết
export { api }; // Xuất khẩu api