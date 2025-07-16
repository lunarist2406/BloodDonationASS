import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "../auth/useAuthContext";
import api from "@/config/axiosInstance";

const API_URL = "/api/v1/infor-health";

export const HealthContext = createContext(null);

export const HealthProvider = ({ children }:any) => {
  const { token } = useAuth();

  const [healthList, setHealthList] = useState([]);
  const [userHealth, setUserHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 📦 Get all
  const getAllHealthInfo = async (current = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}?current=${current}&pageSize=${pageSize}`);
      setHealthList(res.data?.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy healthList:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👤 Get by user
  const getHealthInfoByUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}/user`, authHeaders);
      setUserHealth(res.data?.data || null);
    } catch (err) {
      console.error("Lỗi khi lấy userHealth:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📧 Get by email
  const getHealthInfoByEmail = async (email) => {
    try {
      const res = await api.get(`${API_URL}/email`, {
        ...authHeaders,
        params: { email },
      });
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy theo email:", err);
    }
  };

  // 🔍 Get by ID
  const getHealthInfoById = async (id) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, authHeaders);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lấy theo ID:", err);
    }
  };

  // ➕ Create
  const createHealthInfo = async (data) => {
    try {
      const res = await api.post(API_URL, data, authHeaders);
      await getAllHealthInfo();
      await getHealthInfoByUser();
      return res.data;
    } catch (err) {
      console.error("Lỗi khi tạo thông tin:", err);
      throw err;
    }
  };

  // 🔧 Admin create
  const createHealthInfoAdmin = async (data) => {
    try {
      const res = await api.post(`${API_URL}/admin`, data, authHeaders);
      await getAllHealthInfo();
      return res.data;
    } catch (err) {
      console.error("Admin tạo lỗi:", err);
    }
  };

  // ✏️ Update
  const updateHealthInfo = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await api.patch(`${API_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await getAllHealthInfo();
      await getHealthInfoByUser();
      return res.data;
    } catch (err) {
      console.error("Cập nhật lỗi:", err);
    }
  };

  // ✏️ Admin update
  const updateHealthInfoAdmin = async (id, formData) => {
    try {
      const res = await api.patch(`${API_URL}/${id}/admin`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await getAllHealthInfo();
      return res.data;
    } catch (err) {
      console.error("Admin cập nhật lỗi:", err);
    }
  };

  // ❌ Delete
  const deleteHealthInfo = async (id) => {
    try {
      const res = await api.delete(`${API_URL}/${id}`, authHeaders);
      await getAllHealthInfo();
      return res.data;
    } catch (err) {
      console.error("Xoá lỗi:", err);
    }
  };

  // 🚀 Fetch data khi Provider mount
  useEffect(() => {
    if (token) {
      getAllHealthInfo();
      getHealthInfoByUser();
    }
  }, [token]);

  return (
    <HealthContext.Provider
      value={{
        healthList,
        userHealth,
        loading,
        getAllHealthInfo,
        getHealthInfoByUser,
        getHealthInfoByEmail,
        getHealthInfoById,
        createHealthInfo,
        createHealthInfoAdmin,
        updateHealthInfo,
        updateHealthInfoAdmin,
        deleteHealthInfo,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
