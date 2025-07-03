import {api} from '../../components/config/axios/axiosInstance';

const API_URL = 'http://localhost:3000/api/v1/rhs';

export default function useRh() {
  // Lấy tất cả nhóm Rh (có phân trang)
  const getAllRh = async (current = 1, pageSize = 10) => {
    try {
      const response = await api.get(`${API_URL}?current=${current}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhóm Rh:', error);
      throw error;
    }
  };

  // Lấy nhóm Rh theo ID
  const getRhById = async (id:string) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy nhóm Rh theo ID:', error);
      throw error;
    }
  };

  // Tạo nhóm Rh mới
  const createRh = async (data:any) => {
    try {
      const response = await api.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo nhóm Rh:', error);
      throw error;
    }
  };

  // Cập nhật nhóm Rh
  const updateRh = async (id:string, data:any) => {
    try {
      const response = await api.patch(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật nhóm Rh:', error);
      throw error;
    }
  };

  // Xóa nhóm Rh (nếu API hỗ trợ)
  const deleteRh = async (id:string) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa nhóm Rh:', error);
      throw error;
    }
  };

  return {
    getAllRh,
    getRhById,
    createRh,
    updateRh,
    deleteRh,
  };
}
