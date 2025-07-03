import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "http://localhost:3000/api/v1/bloods";

export default function useBloodService() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Lấy tất cả blood (có phân trang nếu cần)
  const getAllBloods = async (current = 1, pageSize = 10) => {
    try {
      const response = await api.get(
        `${API_URL}?current=${current}&pageSize=${pageSize}`,
        authHeaders
      );
      return response.data;
    } catch (error) {
        
      console.error("Lỗi khi lấy danh sách blood:", error);
      throw error;
    }
  };

  // Lấy blood theo ID
  const getBloodById = async (id:string) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy blood theo ID:", error);
      throw error;
    }
  };

  // Tạo mới blood
  const createBlood = async (data:any) => {
    try {
      const response = await api.post(API_URL, data, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo mới blood:", error);
      throw error;
    }
  };

  // Cập nhật blood theo ID
  //   const updateBlood = async (id, data) => {
  //     try {
  //       const response = await api.put(`${API_URL}/${id}`, data, authHeaders);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Lỗi khi cập nhật blood:", error);
  //       throw error;
  //     }
  //   };

  return {
    getAllBloods,
    getBloodById,
    createBlood,
    // updateBlood,
  };
}
