import api from "@/config/axiosInstance";
import { useAuth } from "../auth/useAuthContext";

const API_URL = "api/v1/notifications";

export default function useNotificationService() {
  const { token, user } = useAuth();

  const getAuthHeaders = () => {
    if (!token) throw new Error("🔐 Token chưa có. Hủy request.");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // 🔍 GET all notifications (with optional pagination)
  const getAllNotificationsByUser = async (current = 1, pageSize = 999) => {
    try {
      const res = await api.get(
        `${API_URL}?current=${current}&pageSize=${pageSize}&qs=user_id=${user?.user_id}`,
        getAuthHeaders()
      );
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thông báo:", err);
      throw err;
    }
  };

  // ✏️ read 1 notification (update)
  const markReadNotification = async (id: string) => {
    try {
        console.log("🔖 Đánh dấu thông báo đã đọc:", id);
      const res = await api.patch(`${API_URL}/mark-read/${id}`, getAuthHeaders());
      console.log("Thông báo đã đọc:", res.data);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", err);
      throw err;
    }
  };

  // ✏️ read all notifications (update)
  const markReadAllNotification = async () => {
    try {
      const res = await api.patch(`${API_URL}/mark-read-all`, getAuthHeaders());
      return res.data;
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", err);
      throw err;
    }
  };

  return {
    getAllNotificationsByUser,
    markReadNotification,
    markReadAllNotification,
  };
}
