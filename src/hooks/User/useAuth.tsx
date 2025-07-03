import { create } from "zustand";

interface UserAuthResponse {
  user_id: string;
  fullname: string;
  email: string;
  role: string;
}

interface UserAuthStore {
  token: string;
  user: UserAuthResponse | null;
  setAuthToken: (token: string) => void;
  setUser: (user: UserAuthResponse) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuth = create<UserAuthStore>((set, get) => ({
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setAuthToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: "", user: null });
  },
  isAuthenticated: () => {
    const { token, user } = get();
    return Boolean(token && user);
  },
  hasRole: (role) => {
    const user = get().user;
    return user?.role === role;
  },
}));
