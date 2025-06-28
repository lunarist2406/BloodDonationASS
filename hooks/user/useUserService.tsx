// src/hooks/useUserService.ts
import api from '@/config/axiosInstance';
import { useAuth } from '../auth/useAuthContext';

const API_URL = 'api/v1/users';

export default function useUserService() {
  const { token } = useAuth();

  const getAuthHeaders = () => {
    if (!token) throw new Error("🔐 Token chưa có. Hủy request.");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getAllUsers = async (current = 1, pageSize = 10) => {
    const res = await api.get(`${API_URL}`, {
      ...getAuthHeaders(),
      params: {
        current,
        pageSize,
      },
    });
    return res.data;
  };

  const getUserById = async (id: string) => {
    const res = await api.get(`${API_URL}/${id}`, getAuthHeaders());
    return res.data;
  };

  const getUserByEmail = async (email: string) => {
    const res = await api.get(`${API_URL}/${email}`, getAuthHeaders());
    return res.data;
  };

  const createUser = async (newUserData) => {
    const res = await api.post(API_URL, newUserData, getAuthHeaders());
    return res.data;
  };

  const updateUser = async (id, updatedData) => {
    const res = await api.patch(`${API_URL}/${id}`, updatedData, getAuthHeaders());
    return res.data;
  };

  const deleteUser = async (id) => {
    const res = await api.delete(`${API_URL}/${id}`, getAuthHeaders());
    return res.data;
  };

  return {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
  };
}
