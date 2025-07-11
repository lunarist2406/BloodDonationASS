import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "/api/v1/central-blood";

export default function useCentralService() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 🔍 GET all centrals (with optional pagination)
  const getAllCentral = async (current = 1, pageSize = 10) => {
    try {
      const res = await api.get(
        `${API_URL}?current=${current}&pageSize=${pageSize}`,
        authHeaders
      );
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy danh sách trung tâm:", err);
      throw err;
    }
  };

  // 🔍 GET by ID
  const getCentralById = async (id: string) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, authHeaders);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy trung tâm theo ID:", err);
      throw err;
    }
  };

  // ➕ POST (create)
  const createCentral = async (payload: any) => {
    try {
      const res = await api.post(API_URL, payload, authHeaders);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi tạo trung tâm:", err);
      throw err;
    }
  };

  // ✏️ PATCH (update)
  const updateCentral = async (id: string, payload: any) => {
    try {
      const res = await api.patch(`${API_URL}/${id}`, payload, authHeaders);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi cập nhật trung tâm:", err);
      throw err;
    }
  };

  // ❌ DELETE
  const deleteCentral = async (id: string) => {
    try {
      const res = await api.delete(`${API_URL}/${id}`, authHeaders);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi xoá trung tâm:", err);
      throw err;
    }
  };

  return {
    getAllCentral,
    getCentralById,
    createCentral,
    updateCentral,
    deleteCentral,
  };
}
