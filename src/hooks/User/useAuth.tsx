import { create } from 'zustand';

interface UserAuthResponse {
  user_id: string;
  fullname: string;
  email: string;
  role_name: string;
}

interface UserAuthStore {
  token: string | null;
  user: UserAuthResponse | null;
  setAuthToken: (token: string) => void;
  setUser: (user: UserAuthResponse) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuth = create<UserAuthStore>((set, get) => ({
  token: null,
  user: null,
  setAuthToken: (token) => {
    console.log('Đang cài đặt token:', token);
    set({ token });
    return token;
  },
  setUser: (user) => {
    console.log('Đang cài đặt thông tin người dùng:', user);
    set({ user });
    return user ? { ...user } : null;
  },
  clearAuth: () => set({ token: null, user: null }),
  isAuthenticated: () => {
    const state = get();
    return !!state.token && !!state.user;
  },
  hasRole: (role) => {
    const state = get();
    return state.user?.role_name === role;
  }
}));