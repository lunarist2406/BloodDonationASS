import {api} from '../components/config/axios/axiosInstance';

const API_URL = 'http://localhost:3000/api/v1/infor-health';

export default function useInforHealth() {
  // Lấy tất cả thông tin sức khỏe (có phân trang)
  const getAllHealthInfo = async (current = 1, pageSize = 10) => {
    try {
      const response = await api.get(`${API_URL}?current=${current}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông tin sức khỏe:', error);
      throw error;
    }
  };

  // Lấy thông tin sức khỏe theo ID
  const getHealthInfoById = async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sức khỏe theo ID:', error);
      throw error;
    }
  };

  // Tạo mới thông tin sức khỏe
  const createHealthInfo = async (data) => {
    try {
      const response = await api.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo mới thông tin sức khỏe:', error);
      throw error;
    }
  };

  // Cập nhật thông tin sức khỏe
  const updateHealthInfo = async (id, data) => {
    try {
      const response = await api.patch(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin sức khỏe:', error);
      throw error;
    }
  };

  // Xóa thông tin sức khỏe
  const deleteHealthInfo = async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa thông tin sức khỏe:', error);
      throw error;
    }
  };

  return {
    getAllHealthInfo,
    getHealthInfoById,
    createHealthInfo,
    updateHealthInfo,
    deleteHealthInfo,
  };
}
