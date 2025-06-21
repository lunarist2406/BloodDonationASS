import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "http://localhost:3000/api/v1/infor-health";
// service layer controlling API
export default function useHealthService() {
  const { token } = useAuth();
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Lấy tất cả thông tin sức khỏe (có phân trang)
  const getAllHealthInfo = async (current = 1, pageSize = 10) => {
    try {
      const response = await api.get(
        `${API_URL}?current=${current}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thông tin sức khỏe:", error);
      throw error;
    }
  };
  const getHealthInfoByUser = async () => {
    try {
      const response = await api.get(`${API_URL}/user`,authHeaders)
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sức khỏe của user:", error);
      throw error;
    }
  };
  // Lấy thông tin sức khỏe theo ID
  const getHealthInfoById = async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sức khỏe theo ID:", error);
      throw error;
    }
  };

  // Tạo mới thông tin sức khỏe
  const createHealthInfo = async (data) => {
    try {
      const response = await api.post(API_URL, data, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo mới thông tin sức khỏe:", error);
      throw error;
    }
  };

const updateHealthInfo = async (id, data) => {
  try {
    const formData = new FormData();

    // Chuyển tất cả field từ object data vào FormData
    Object.entries(data).forEach(([key, value]) => {
      // Tránh thêm undefined/null
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await api.patch(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Bắt buộc khi gửi file
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin sức khỏe:", error);
    throw error;
  }
};


  const deleteHealthInfo = async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa thông tin sức khỏe:", error);
      throw error;
    }
  };

  return {
    getAllHealthInfo,
    getHealthInfoById,
      getHealthInfoByUser, 

    createHealthInfo,
    updateHealthInfo,
    deleteHealthInfo,
  };
}
