import {api} from '../components/config/axios/axiosInstance';

const API_URL = 'http://localhost:3000/api/v1/blood-types';

export default function useBloodType() {
  // Lấy tất cả nhóm máu (có phân trang)
  const getAllBloodTypes = async (current = 1, pageSize = 10) => {
    try {
      const response = await api.get(`${API_URL}?current=${current}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhóm máu:', error);
      throw error;
    }
  };

  // Lấy nhóm máu theo ID
  const getBloodTypeById = async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy nhóm máu theo ID:', error);
      throw error;
    }
  };

  // Tạo mới nhóm máu
  const createBloodType = async (data) => {
    try {
      const response = await api.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo nhóm máu mới:', error);
      throw error;
    }
  };

  // Cập nhật nhóm máu theo ID
  const updateBloodType = async (id, data) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật nhóm máu:', error);
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
