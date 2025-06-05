import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconUserPlus, IconMail, IconLock, IconUser, IconMapPin } from "@tabler/icons-react";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from "react-router-dom";
import {api} from "../../../components/config/axios/axiosInstance";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role_name: "MEMBER",
    location: {
      ipAddress: "",
      country: "Việt Nam",
      district: "",
      road: ""
    }
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Lấy IP address khi component mount
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            ipAddress: data.ip
          }
        }));
      } catch (error) {
        console.error('Không thể lấy IP address:', error);
        // Nếu không lấy được IP, set một giá trị mặc định
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            ipAddress: '127.0.0.1'
          }
        }));
      }
    };

    fetchIP();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Kiểm tra mật khẩu
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    // Kiểm tra gender
    if (!formData.gender) {
      setError("Vui lòng chọn giới tính");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/v1/auth/register', {
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        role_name: formData.role_name,
        gender: formData.gender,
        location: {
          ipAddress: formData.location.ipAddress,
          country: formData.location.country,
          district: formData.location.district,
          road: formData.location.road
        }
      });

      navigate('/login');
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        } else {
          console.error('Response data:', err.response?.data);
          console.error('Response status:', err.response?.status);
          // Hiển thị lỗi chi tiết từ API
          if (Array.isArray(err.response?.data?.message)) {
            setError(err.response?.data?.message.join(', '));
          } else {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
          }
        }
      } else {
        setError('Có lỗi xảy ra khi đăng ký');
      }
    } finally {
      setIsLoading(false);
    }
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
          alt="Register"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Registration Form */}
      <div className="relative min-h-screen flex items-center justify-end">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-xl bg-white/95 backdrop-blur-sm p-8 m-8 rounded-2xl shadow-2xl mx-auto"
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
            Đăng Ký Tài Khoản
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Hệ thống Hỗ trợ Hiến Máu
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconUser size={18} className="mr-2" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconMail size={18} className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconUser size={18} className="mr-2" />
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconLock size={18} className="mr-2" />
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconLock size={18} className="mr-2" />
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconMapPin size={18} className="mr-2" />
                  Quận/Huyện
                </label>
                <input
                  type="text"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập quận/huyện"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <IconMapPin size={18} className="mr-2" />
                  Đường/Phố
                </label>
                <input
                  type="text"
                  name="location.road"
                  value={formData.location.road}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nhập đường/phố"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-red-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IconUserPlus size={20} />
              )}
              {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </motion.button>

            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Đăng nhập ngay
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 