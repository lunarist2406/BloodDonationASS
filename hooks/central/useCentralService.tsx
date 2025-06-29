import api from "@/config/axiosInstance";
import { useAuth } from "../auth/useAuthContext";

const API_URL = "api/v1/central-blood";

export default function useCentralService() {
  const { token } = useAuth();

  const getAuthHeaders = () => {
    if (!token) throw new Error("🔐 Token chưa có. Hủy request.");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // 🔍 GET all centrals (with optional pagination)
  const getAllCentral = async (current = 1, pageSize = 10) => {
    try {
      const res = await api.get(
        `${API_URL}?current=${current}&pageSize=${pageSize}`,
        getAuthHeaders()
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
      const res = await api.get(`${API_URL}/${id}`, getAuthHeaders());
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy trung tâm theo ID:", err);
      throw err;
    }
  };

  // ➕ POST (create)
  const createCentral = async (payload: any) => {
    try {
      const res = await api.post(API_URL, payload, getAuthHeaders());
      return res.data;
    } catch (err) {
      console.error("Lỗi khi tạo trung tâm:", err);
      throw err;
    }
  };

  // ✏️ PATCH (update)
  const updateCentral = async (id: string, payload: any) => {
    try {
      const res = await api.patch(`${API_URL}/${id}`, payload, getAuthHeaders());
      return res.data;
    } catch (err) {
      console.error("Lỗi khi cập nhật trung tâm:", err);
      throw err;
    }
  };

  // ❌ DELETE
  const deleteCentral = async (id: string) => {
    try {
      const res = await api.delete(`${API_URL}/${id}`, getAuthHeaders());
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
