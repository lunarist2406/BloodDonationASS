import { useAuth } from "../User/useAuth";
import { api } from "../../components/config/axios/axiosInstance";

export default function useStorage() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 📥 GET list with pagination
  const getStorages = async (current = 1, pageSize = 10, qs = "") => {
    const res = await api.get(
      `/api/v1/storages?current=${current}&pageSize=${pageSize}&qs=${qs}`,
      authHeaders
    );
    return res.data;
  };

  // 📥 GET 1 item by id
  const getStorageById = async (id: string) => {
    const res = await api.get(`/api/v1/storages/${id}`, authHeaders);
    return res.data;
  };

  // ➕ POST new storage
  const createStorage = async (data: {
    donate_id: string;
    blood_id: string;
    date: string;
    ml: number;
    unit: number;
    expired_date: string;
    current_status: string;
    centralBlood_id: number;
  }) => {
    const res = await api.post("/api/v1/storages", data, authHeaders);
    return res.data;
  };

  // 🔁 PATCH update storage
  const updateStorage = async (
    id: string,
    data: {
      donate_id: string;
      blood_id: string;
      date: string;
      ml: number;
      unit: number;
      expired_date: string;
      current_status: string;
      centralBlood_id: number;
    }
  ) => {
    const res = await api.patch(`/api/v1/storages/${id}`, data, authHeaders);
    return res.data;
  };

  // ❌ DELETE storage
  const deleteStorage = async (id: string) => {
    const res = await api.delete(`/api/v1/storages/${id}`, authHeaders);
    return res.data;
  };

  return {
    getStorages,
    getStorageById,
    createStorage,
    updateStorage,
    deleteStorage,
  };
}
