import { api } from "../../components/config/axios/axiosInstance";


const API_URL = "/api/v1/working-hours";

// Lấy tất cả giờ làm việc
export const getAllWorkingHours = async (token: string) => {
  const res = await api.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Lấy 1 giờ làm việc theo ID
export const getWorkingHourById = async (id: string, token: string) => {
  const res = await api.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Thêm mới giờ làm việc
export const createWorkingHour = async (
  data: {
    day_of_week: string;
    open_time: string;
    close_time: string;
    is_open: boolean;
  },
  token: string
) => {
  const res = await api.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Cập nhật giờ làm việc theo ID
export const updateWorkingHour = async (
  id: string,
  data: Partial<{
    day_of_week: string;
    open_time: string;
    close_time: string;
    is_open: boolean;
  }>,
  token: string
) => {
  const res = await api.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Xoá giờ làm việc
export const deleteWorkingHour = async (id: string, token: string) => {
  const res = await api.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
