// src/hooks/useAuth.ts
import { useState } from 'react';
import api from '@/config/axiosInstance';
import { storeToken } from '@/utils/authToken';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null); // Bạn có thể tạo interface riêng cho user nếu muốn

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/api/v1/auth/login', {
        username: email,
        password,
      });

      const token = res.data?.data?.access_token;
      const userInfo = res.data?.data?.user;

      if (token) {
        await storeToken(token); // Lưu token vào AsyncStorage
        setUser(userInfo);       // Lưu user vào state
        console.log('Đăng nhập thành công:', userInfo);
      }

      return { token, user: userInfo };
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await storeToken(''); // hoặc gọi removeToken() nếu có
    } catch (err) {
      console.error('Lỗi khi logout:', err);
    }
  };

  return {
    user,
    login,
    logout,
  };
};
