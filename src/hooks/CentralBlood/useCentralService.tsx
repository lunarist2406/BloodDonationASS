import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "http://localhost:3000/api/v1/central-blood";
// service layer controlling API
export default function useCentralService() {
  const { token } = useAuth();
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Lấy tất cả trung tâm
  const getAllCentral = async (current = 1, pageSize = 10) => {
      try {
        const response = await api.get(
          `${API_URL}?current=${current}&pageSize=${pageSize}`,
          authHeaders
        );
        return response.data;
      } catch (error) {
          
        console.error("Lỗi khi lấy danh sách central:", error);
        throw error;
      }
    };

  return {
    getAllCentral,
  };
}
