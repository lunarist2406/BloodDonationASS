import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { Button } from "antd";
import {
  IconLogin,
  IconChevronDown,
  IconDroplet,
  IconBook,
  IconSearch,
} from "@tabler/icons-react";
import img1 from "../../../assets/Blood-Donation-1.webp";

export default function GuestHeader() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => setShowModal(!showModal);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-red-500 to-red-900 text-gray-300 py-2 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            onClick={handleLogoClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="logo" width={50} height={50} />
          </div>

          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="font-bold text-xl">LUNARIST</span>
            <IconChevronDown size={25} className="cursor-pointer" />
          </div>
        </div>

        <motion.button
          onClick={handleSignIn}
          className="mt-1 px-4 py-2 bg-red-700 text-white text-3xs rounded-lg font-bold flex items-center hover:bg-red-500 gap-2"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          whileHover={{
            y: -5,
            scale: 1.05,
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          }}
        >
          <IconLogin size={18} className="text-white" />
          <span>Sign in</span>
        </motion.button>
      </div>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white text-black shadow-lg z-50 px-20 rounded-md"
          >
            <div className="grid grid-cols-4 gap-2 p-10">
              <motion.div className="space-y-2">
                <motion.h3
                  className="font-bold flex items-center"
                  whileHover={{ y: -5, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                >
                  <IconDroplet size={18} className="mr-2" />
                  Dịch Vụ Hiến Máu
                </motion.h3>

                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/register-blood")}
                  className="cursor-pointer"
                >
                  Đăng ký Nhóm Máu
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/register-blood")}
                  className="cursor-pointer"
                >
                  Đăng ký Nhóm Máu Khẩn Cấp
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/register-blood")}
                  className="cursor-pointer"
                >
                  Hiến Máu & Nhận Máu
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/register-blood")}
                  className="cursor-pointer"
                >
                  Tra Cứu Thông Tin
                </motion.p>
              </motion.div>

              <motion.div className="space-y-2">
                <motion.h3
                  className="font-bold flex items-center"
                  whileHover={{ y: -5, color: "#ff0000" }}
                >
                  <IconBook size={18} className="mr-2" />
                  Thông tin
                </motion.h3>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/blood-donation-centers")}
                  className="cursor-pointer"
                >
                  Cơ sở Hiến Máu
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/blood-documents")}
                  className="cursor-pointer"
                >
                  Tài Liệu Về Máu
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/blood-news")}
                  className="cursor-pointer"
                >
                  Tin Tức Về Hiến Máu
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                  transition={{ type: "linear", duration: 0.2 }}
                  onClick={() => navigate("/blood-experience")}
                  className="cursor-pointer"
                >
                  Chia Sẻ Kinh Nghiệm
                </motion.p>
              </motion.div>

              <motion.div className="space-y-2">
                <motion.h3
                  className="font-bold flex items-center"
                  whileHover={{ y: -5, color: "#ff0000" }}
                >
                  <IconSearch size={18} className="mr-2" />
                  Tìm Kiếm
                </motion.h3>
                <motion.p whileHover={{ scale: 1.05, color: "#ff0000" }}>
                  Nhóm Máu
                </motion.p>
                <motion.p whileHover={{ scale: 1.05, color: "#ff0000" }}>
                  Người Hiến Máu
                </motion.p>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.2,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                }}
                className="rounded-md overflow-hidden"
              >
                <img
                  src={img1}
                  alt="promo"
                  className="w-full h-45 object-cover rounded-md"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <motion.div className="bg-white p-6 rounded-lg w-[400px] h-[300px] relative">
              <Button
                type="text"
                className="absolute top-2 right-2 text-red-500"
                onClick={toggleModal}
              >
                X
              </Button>
              <div className="text-black text-center">AuthPage Content</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
