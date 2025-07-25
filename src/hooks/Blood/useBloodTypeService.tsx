import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "/api/v1/blood-types";

export default function useBloodTypeService() {
  const { token } = useAuth();
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Lấy tất cả nhóm máu (có phân trang)
  const getAllBloodTypes = async (current = 1, pageSize = 14) => {
    try {
      const response = await api.get(
        `${API_URL}?current=${current}&pageSize=${pageSize}`,
        authHeaders
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhóm máu:", error);
      throw error;
    }
  };

  // Lấy nhóm máu theo ID
  const getBloodTypeById = async (id:string) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy nhóm máu theo ID:", error);
      throw error;
    }
  };

  // Tạo mới nhóm máu
  const createBloodType = async (data:any ) => {
    try {
      const response = await api.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo nhóm máu mới:", error);
      throw error;
    }
  };

  // Cập nhật nhóm máu theo ID
  const updateBloodType = async (id:string , data:any) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật nhóm máu:", error);
      throw error;
    }
  };

  return {
    getAllBloodTypes,
    getBloodTypeById,
    createBloodType,
    updateBloodType,
  };
}
