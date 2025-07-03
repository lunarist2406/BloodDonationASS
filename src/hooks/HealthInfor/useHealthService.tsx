import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "http://localhost:3000/api/v1/infor-health";

export default function useHealthService() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
      const response = await api.get(`${API_URL}/user`, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sức khỏe của user:", error);
      throw error;
    }
  };

  const getHealthInfoByEmail = async (email:string) => {
    try {
      const response = await api.get(`${API_URL}/email`, {
        ...authHeaders,
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sức khỏe theo email:", error);
      throw error;
    }
  };

  const getHealthInfoById = async (id:string ) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sức khỏe theo ID:", error);
      throw error;
    }
  };

  const createHealthInfo = async (data:any) => {
    try {
      const response = await api.post(API_URL, data, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo mới thông tin sức khỏe:", error);
      throw error;
    }
  };

  const createHealthInfoAdmin = async (data:any) => {
    try {
      const response = await api.post(`${API_URL}/admin`, data, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi admin tạo thông tin sức khỏe:", error);
      throw error;
    }
  };

const updateHealthInfo = async (data:any) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.patch(`${API_URL}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin sức khỏe:", error);
    throw error;
  }
};


const updateHealthInfoAdmin = async (id:string, formData:any) => {
  try {
    const response = await api.patch(`${API_URL}/${id}/admin`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi admin cập nhật thông tin sức khỏe:", error);
    throw error;
  }
};




  const deleteHealthInfo = async (id:string) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`, authHeaders);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa thông tin sức khỏe:", error);
      throw error;
    }
  };

  return {
    getAllHealthInfo,
    getHealthInfoByUser,
    getHealthInfoByEmail,
    getHealthInfoById,
    createHealthInfo,
    createHealthInfoAdmin,
    updateHealthInfo,
    updateHealthInfoAdmin,
    deleteHealthInfo,
  };
}
