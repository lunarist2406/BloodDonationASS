import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IconLogin,
  IconMail,
  IconLock,
  IconEyeOff,
  IconEye,
} from "@tabler/icons-react";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/background.png";
import { api } from "../../../components/config/axios/axiosInstance";
import { useAuth } from "../../../hooks/User/useAuth";

interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: {
      user_id: string;
      fullname: string;
      email: string;
      role_name: string;
    };
  };
}

export default function Login() {
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      const loginData = {
        username: email.trim(),
        password: password.trim(),
      };

      console.log("Sending login request with data:", loginData);

      const response = await api.post<LoginResponse>(
        "/api/v1/auth/login",
        loginData
      );

      console.log("Full login response:", response);
      console.log("Login response data:", response.data);
      console.log("Data object:", response.data.data);
      if (response.data?.data?.access_token) {
        console.log("Token found:", response.data.data.access_token);
        setAuthToken(response.data.data.access_token);
        setUser(response.data?.data.user);
        const fullname = response.data.data.user.fullname?.trim() || "";
        const lastWord = fullname.split(" ").pop() || "";
        navigate(`/${encodeURIComponent(lastWord)}`);
      } else {
        console.error("Token not found in response:", response.data);
        setError("Không nhận được token từ server");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Email hoặc mật khẩu không chính xác");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("register");
  };

  return (
    <div className="min-h-screen relative">
      {/* Full screen background image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <img
          src={backgroundImage}
          alt="Login"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Login Form */}
      <div className="relative min-h-screen flex items-center justify-end">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 m-8 rounded-2xl shadow-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <img src={logo} alt="logo" className="w-16 h-20" />
          </motion.div>
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Đăng Nhập
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <IconMail size={18} className="mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <IconLock size={18} className="mr-2" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <IconEyeOff size={20} className="cursor-pointer" />
                  ) : (
                    <IconEye size={20} className="cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="mr-6" />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={() => navigate("verify-notice")}
                className="text-red-600 hover:underline hover:text-red-800 bg-transparent p-0 m-0 border-none cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-red-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IconLogin size={20} className="text-white" />
              )}
              <span className="text-white">
                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </span>
            </motion.button>

            <div className="text-center text-sm text-red-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={handleRegister}
                className="text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
