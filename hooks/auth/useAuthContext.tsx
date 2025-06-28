import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/config/axiosInstance';
import { storeToken, getToken, removeToken } from '@/utils/authToken';

interface User {
  user_id: string;
  email: string;
  fullname: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        setToken(savedToken);
        try {
          const res = await api.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(res.data?.data);
        } catch (err) {
          console.log('⚠️ Token expired hoặc lỗi xác thực:', err);
          await logout();
        }
      }
    };

    loadSession();
  }, []);

const login = async (email: string, password: string) => {
  const res = await api.post('/api/v1/auth/login', {
    username: email,
    password,
  });

  const receivedToken = res.data?.data?.access_token;
  const userInfo = res.data?.data?.user;

  if (receivedToken) {
    await storeToken(receivedToken);
    setToken(receivedToken);
    setUser(userInfo);
  }

  return { token: receivedToken, user: userInfo }; // ✅ Thêm dòng này!
};

  const logout = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider');
  return context;
};
