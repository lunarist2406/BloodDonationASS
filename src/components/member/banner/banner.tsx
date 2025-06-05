import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IconUser,
  IconHeart,
  IconSearch,
  IconStar,
  IconArrowRightCircle,
} from "@tabler/icons-react";

export default function GuestBanner() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="bg-gradient-to-r from-red-200 to-red-400 text-black py-12 shadow-lg relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-start justify-between space-y-8 md:space-y-0 md:space-x-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left md:w-1/2"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Chào mừng bạn đến với Hệ thống Hỗ trợ Hiến Máu!
          </h2>
          <ul className="list-none space-y-4">
            <motion.li whileHover={{ x: 10 }} className="flex items-center">
              <IconUser className="mr-2" size={20} /> Dễ dàng tham gia: Đăng ký
              tài khoản, cập nhật nhóm máu và theo dõi lịch sử hiến máu của bạn.
            </motion.li>
            <motion.li whileHover={{ x: 10 }} className="flex items-center">
              <IconHeart className="mr-2" size={20} /> Kết nối cộng đồng: Tìm
              kiếm thông tin về nhóm máu, người hiến máu khẩn cấp.
            </motion.li>
            <motion.li whileHover={{ x: 10 }} className="flex items-center">
              <IconSearch className="mr-2" size={20} /> Thông tin hữu ích: Cung
              cấp kiến thức, tin tức mới nhất về hiến máu.
            </motion.li>
            <motion.li whileHover={{ x: 10 }} className="flex items-center">
              <IconStar className="mr-2" size={20} /> Tham gia ngay: Hãy trở
              thành một phần của cộng đồng nhân ái.
            </motion.li>
          </ul>
          <motion.button
            onClick={handleRegister}
            className="mt-6 px-5 py-3 bg-red-700 text-white rounded-lg font-bold flex items-center hover:bg-red-500"
            whileHover={{ scale: 1.05 }}
          >
            <IconArrowRightCircle className="mr-2" size={24} /> Đăng Ký Hiến Máu
            Ngay
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="video-container md:w-1/2"
        >
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/YHxdhI5ZrHc?si=RtMIzDizj2YO6aBm"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
