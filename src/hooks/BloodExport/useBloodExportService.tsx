import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_BASE_URL = "http://localhost:3000/api/v1/export-bloods";

export default function useBloodExportService() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getExportBloods = async (current = 1, pageSize = 10, qs = "") => {
    try {
      const params: Record<string, any> = { current, pageSize };
      if (qs) params.qs = qs;

      const res = await api.get(API_BASE_URL, {
        params,
        ...authHeaders,
      });

      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xuất máu:", error);
      throw error;
    }
  };

  const getExportBloodById = async (id:string ) => {
    try {
      const res = await api.get(`${API_BASE_URL}/${id}`, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết xuất máu:", error);
      throw error;
    }
  };

  const createExportBlood = async (data:any) => {
    try {
      const res = await api.post(API_BASE_URL, data, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo xuất máu:", error);
      throw error;
    }
  };

  const updateExportBlood = async (id:string, data:any) => {
    try {
      const res = await api.put(`${API_BASE_URL}/${id}`, data, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật xuất máu:", error);
      throw error;
    }
  };

  const deleteExportBlood = async (id:string) => {
    try {
      const res = await api.delete(`${API_BASE_URL}/${id}`, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xoá xuất máu:", error);
      throw error;
    }
  };

  const getUserById = async (id:string) => {
    try {
      const res = await api.get(`/api/v1/users/${id}`, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      throw error;
    }
  };

  const getBloodById = async (id:string) => {
    try {
      const res = await api.get(`/api/v1/bloods/${id}`, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy loại máu:", error);
      throw error;
    }
  };

  const getStorageById = async (id:string) => {
    try {
      const res = await api.get(`/api/v1/storages/${id}`, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy kho lưu:", error);
      throw error;
    }
  };

  const getAllStorages = async () => {
    try {
      const res = await api.get(`/api/v1/storages`, authHeaders);
      return res.data.data.result;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho lưu:", error);
      throw error;
    }
  };

  const getAllReceivers = async () => {
    try {
      const res = await api.get(`/api/v1/receiver-bloods`, authHeaders);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người nhận:", error);
      throw error;
    }
  };

  return {
    getExportBloods,
    getExportBloodById,
    createExportBlood,
    updateExportBlood,
    deleteExportBlood,
    getUserById,
    getBloodById,
    getStorageById,
    getAllStorages,
    getAllReceivers,
  };
}
