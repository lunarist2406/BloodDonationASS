// src/contexts/BloodContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/config/axiosInstance";
import { useAuth } from "../auth/useAuthContext";

interface BloodItem {
  blood_id: string;
  blood_type_id: {
    blood_name: string;
    blood_type_id: number;
  };
  rh_id: {
    blood_Rh: string;
    rh_id: number;
  };
}

interface BloodContextType {
  bloodList: BloodItem[];
  loading: boolean;
  error: string | null;
  getAllBloods: (current?: number, pageSize?: number) => void;
  getBloodById: (id: string) => Promise<any>;
  createBlood: (data: any) => Promise<any>;
}

const BloodContext = createContext<BloodContextType | null>(null);

export const BloodProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [bloodList, setBloodList] = useState<BloodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getAllBloods = async (current = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await api.get(
        `api/v1/bloods?current=${current}&pageSize=${pageSize}`,
        authHeaders
      );
      setBloodList(response.data?.data?.result || []);
      console.log("🩸 Danh Sách Máu:", response.data?.data?.result);
      setError(null);
    } catch (err: any) {
      console.error("Lỗi khi lấy danh sách blood:", err);
      setError(err?.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  const getBloodById = async (id: string) => {
    try {
      const response = await api.get(`api/v1/bloods/${id}`, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy blood theo ID:", error);
      throw error;
    }
  };

  const createBlood = async (data: any) => {
    try {
      const response = await api.post("api/v1/bloods", data, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo mới blood:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (token) getAllBloods();
  }, [token]);

  return (
    <BloodContext.Provider
      value={{
        bloodList,
        loading,
        error,
        getAllBloods,
        getBloodById,
        createBlood,
      }}
    >
      {children}
    </BloodContext.Provider>
  );
};

export const useBloodContext = () => {
  const context = useContext(BloodContext);
  if (!context) {
    throw new Error("useBloodContext must be used within a BloodProvider");
  }
  return context;
};
