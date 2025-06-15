import { api } from "../../components/config/axios/axiosInstance";
import type { SearchByCentralDistanceDTO, SearchByCurrentPosDTO, SearchByDistanceDTO } from "./useBloodDonationFilter";
import { useAuth } from "../User/useAuth";

const API_URL = "http://localhost:3000/api/v1/search";
// service layer controlling API
export default function useBloodDonationService() {
  const { token } = useAuth();
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Lấy tất cả thông tin tìm kiếm
  const getAllSearchByDistance = async (
    searchByDistance: SearchByDistanceDTO
  ) => {
    try {
      const response = await api.get(
        `${API_URL}/distance?user_id=${searchByDistance.user_id}&radiusInKm=${searchByDistance.radiusInKm}&typeToSearch=${searchByDistance.typeToSearch}`,
        authHeaders
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người hiến máu/nhận máu theo vị trí", error);
      throw error;
    }
  };

  const searchByCurrentPosition = async (
    searchByCurrentPos: SearchByCurrentPosDTO 
  ) => {
    try {
      const response = await api.get(
        `${API_URL}/search-from-current-pos?lat=${searchByCurrentPos.lat}&lng=${searchByCurrentPos.lng}&radiusInKm=${searchByCurrentPos.radiusInKm}`,
        authHeaders
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người hiến máu/nhận máu theo vị trí hiện tại", error);
      throw error;
    }
  };

  const searchByCentralDistance = async (
    searchByCentralPos: SearchByCentralDistanceDTO 
  ) => {
    try {
      const response = await api.get(
        `${API_URL}/search-by-central-distance?central_id=${searchByCentralPos.central_id}&radiusInKm=${searchByCentralPos.radiusInKm}`,
        authHeaders
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người hiến máu/nhận máu từ vị trí trung tâm", error);
      throw error;
    }
  };

  return {
    getAllSearchByDistance,
    searchByCurrentPosition,
    searchByCentralDistance
  };
}
