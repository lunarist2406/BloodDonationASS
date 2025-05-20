import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IconLogin, IconMail, IconLock } from "@tabler/icons-react";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/background.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây
    console.log("Login attempt:", { email, password });
  };

  const handleRegister = () => {
    navigate('/register');
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
            <img src={logo} alt="logo" className="w-20 h-20" />
          </motion.div>
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Đăng Nhập
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Hệ thống Hỗ trợ Hiến Máu
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <IconMail size={18} className="mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-red-600 hover:text-red-800">
                Quên mật khẩu?
              </a>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconLogin size={20} />
              Đăng Nhập
            </motion.button>

            <div className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={handleRegister}
                className="text-red-600 hover:text-red-800 font-medium"
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