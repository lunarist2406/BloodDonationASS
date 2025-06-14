import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import {
  // IconLogin,
  IconChevronDown,
  IconDroplet,
  IconBook,
  IconSearch,
  IconLogout,
  IconSettings2,
  IconDatabase,
  IconBuildingBank,
  IconUserCog,
  IconShieldCheck,
} from "@tabler/icons-react";
import img1 from "../../../assets/Blood-Donation-1.webp";
import { useAuth } from "../../../hooks/User/useAuth";

export default function GuestHeader() {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const isAdmin = () => user?.role === "ADMIN";
  const isMember = () => user?.role === "MEMBER";
  console.log("User role:", user?.role);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fullname = user?.fullname?.trim() || "";
    const lastWord = fullname.split(" ").pop() || "";
    navigate(`/${encodeURIComponent(lastWord)}`);
  };

  // const handleSignIn = () => {
  //   navigate("/login");
  // };

  const handleSignOut = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-red-500 to-red-900 text-gray-300 py-2 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-2 flex items-center justify-between ">
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
            {(isMember() || isAdmin()) && (
              <IconChevronDown size={25} className="cursor-pointer" />
            )}
          </div>
        </div>

        {isAuthenticated() && (
          <div className="flex items-center gap-4">
            <span className="text-white">Xin chào, {user?.fullname}</span>
            <motion.button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-700 text-white text-3xs rounded-lg font-bold flex items-center hover:bg-red-500 gap-2"
              whileHover={{
                y: -5,
                scale: 1.05,
                backgroundColor: "rgba(255, 0, 0, 0.2)",
              }}
            >
              <IconLogout size={18} className="text-white" />
              <span>Đăng xuất</span>
            </motion.button>
          </div>
          // ) : (
          //   // <motion.button
          //   //   onClick={handleSignIn}
          //   //   className="mt-1 px-4 py-2 bg-red-700 text-white text-3xs rounded-lg font-bold flex items-center hover:bg-red-500 gap-2"
          //   //   style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          //   //   whileHover={{
          //   //     y: -5,
          //   //     scale: 1.05,
          //   //     backgroundColor: "rgba(255, 0, 0, 0.2)",
          //   //   }}
          //   // >
          //   //   <IconLogin size={18} className="text-white" />
          //   //   <span>Đăng nhập</span>
          //   // </motion.button>
        )}
      </div>
      <AnimatePresence>
        {showDropdown && isAuthenticated() && (
          <motion.div
            ref={dropdownRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white text-black shadow-lg z-50 px-20 rounded-md"
          >
            {/* Member  */}
            {isMember() && (
              <div className="grid grid-cols-4 gap-2 p-5">
                <motion.div className="space-y-2">
                  <motion.h3
                    className="font-bold flex items-center"
                    whileHover={{ y: -5, color: "#ff0000" }}
                    transition={{ type: "linear", duration: 0.2 }}
                  >
                    <IconDroplet size={18} className="mr-2" />
                    Dịch Vụ Hiến Máu
                  </motion.h3>

                  <Link
                    to="/register-blood"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Đăng ký Nhóm Máu
                  </Link>
                  <Link
                    to="/register-blood-emergency"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Đăng ký Nhóm Máu Khẩn Cấp
                  </Link>
                  <Link
                    to="/donation-blood"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Hiến Máu
                  </Link>
                  <Link
                    to="/receiver-blood"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Nhận Máu
                  </Link>
                </motion.div>

                <motion.div className="space-y-2">
                  <motion.h3
                    className="font-bold flex items-center"
                    whileHover={{ y: -5, color: "#ff0000" }}
                  >
                    <IconBook size={18} className="mr-2" />
                    Thông tin
                  </motion.h3>
                  <Link
                    to="/blood-donation-centers"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Cơ sở Hiến Máu
                  </Link>
                  <Link
                    to="/blood-documents"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Tài Liệu Về Máu
                  </Link>
                  <Link
                    to="/blood-news"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Tin Tức Về Hiến Máu
                  </Link>
                  <Link
                    to="/blood-experience"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Chia Sẻ Kinh Nghiệm
                  </Link>
                </motion.div>

                <motion.div className="space-y-2">
                  <motion.h3
                    className="font-bold flex items-center"
                    whileHover={{ y: -5, color: "#ff0000" }}
                  >
                    <IconSearch size={18} className="mr-2" />
                    Tìm Kiếm
                  </motion.h3>
                  <Link
                    to="/seek-information"
                    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Tra Cứu Thông Tin
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
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
            )}

            {/* admin  */}
            {isAdmin() && (
              <motion.div className="p-6 space-y-10">
                <motion.h3
                  className=" font-bold text-lg flex items-center text-red-700 "
                  whileHover={{ y: -3 }}
                >
                  <IconShieldCheck size={20} className="mr-2" />
                  Quản Lý Hệ Thống Cấp Cao
                </motion.h3>

                <div className="flex gap-40 flex-wrap mt-5">
                  <Link
                    to="/manage-users"
                    className="flex items-center gap-2 hover:scale-105 hover:text-red-500 transition-all duration-200 font-semibold"
                    onClick={() => setShowDropdown(false)}
                  >
                    <IconUserCog size={18} />
                    Quản Lý Người Dùng
                  </Link>

                  <Link
                    to="/manage-blood-centers"
                    className="flex items-center gap-2 hover:scale-105 hover:text-red-500 transition-all duration-200 font-semibold"
                    onClick={() => setShowDropdown(false)}
                  >
                    <IconBuildingBank size={18} />
                    Quản Lý Trung Tâm Hiến Máu
                  </Link>

                  <Link
                    to="/manage-blood-storage"
                    className="flex items-center gap-2 hover:scale-105 hover:text-red-500 transition-all duration-200 font-semibold"
                    onClick={() => setShowDropdown(false)}
                  >
                    <IconDatabase size={18} />
                    Quản Lý Kho Máu
                  </Link>

                  <Link
                    to="/system-settings"
                    className="flex items-center gap-2 hover:scale-105 hover:text-red-500 transition-all duration-200 font-semibold"
                    onClick={() => setShowDropdown(false)}
                  >
                    <IconSettings2 size={18} />
                    Quản Lý Hệ Thống
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
