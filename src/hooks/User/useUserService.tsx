import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "./useAuth";

const API_URL = "http://localhost:3000/api/v1/users";

export default function useUserService() {
  const { token } = useAuth(); // Lấy token từ auth context

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Get all users for admin
  const getAllUsers = async (current = 1, pageSize = 10) => {
    const res = await api.get(`${API_URL}`, {
      params: {
        current,
        pageSize,
      },
      headers: authHeaders,
    });
    return res.data;
  };

  // Get user by ID & set userInfor
  const getUserById = async (id: string) => {
    const res = await api.get(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  // Get user by Email
  const getUserByEmail = async (email: string) => {
    const res = await api.get(`${API_URL}/${email}`, authHeaders);
    return res.data;
  };

  // Create new user
  const createUser = async (newUserData) => {
    const res = await api.post(API_URL, newUserData, authHeaders);
    return res.data;
  };

  // Update user by ID
  const updateUser = async (id, updatedData) => {
    const res = await api.patch(`${API_URL}/${id}`, updatedData, authHeaders);
    return res.data;
  };

  // Delete user by ID
  const deleteUser = async (id) => {
    const res = await api.delete(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  return {
    // setter nếu bạn cần sửa bên ngoài
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
  };
}
