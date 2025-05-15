import { motion } from "framer-motion";
import {
  IconHeart,
  IconInfoCircle,
  IconClipboardList,
  IconArrowRightCircle,
  IconClipboardPlus,
} from "@tabler/icons-react";

export default function GuestIntroduce() {
  // Hiệu ứng xuất hiện từ dưới lên
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-r from-red-100 to-white text-black py-16 shadow-lg relative ">
      <motion.h2
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
        className="text-3xl font-bold text-center mb-12 "
      >
        <IconHeart className="inline-block mr-2" size={32} /> Giới Thiệu Về Hệ
        Thống Hỗ Trợ Hiến Máu
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <motion.h3
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            variants={fadeInUp}
            className="text-xl font-semibold flex items-center"
          >
            <IconClipboardList className="inline-block mr-2" size={28} />
            Đăng Ký Hiến Máu
          </motion.h3>
          <motion.h3
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            variants={fadeInUp}
            className="text-xl font-semibold flex items-center mt-4"
          >
            <IconInfoCircle className="inline-block mr-2" size={28} /> Yêu Cầu
          </motion.h3>
          <motion.p
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            variants={fadeInUp}
            className="text-base leading-relaxed mt-4"
          >
            Độ tuổi từ 18 đến 60
            <br />
            Có trạng thái tinh thần và sức khỏe tốt
            <br />
            Cân nặng ít nhất là 42 kg (nữ) và 45 kg (nam)
            <br />
            Lần hiến máu gần nhất cách 12 tuần trở lên
            <br />
            Không nhiễm hay có nguy cơ nhiễm HIV
            <br />
            Không bị viêm gan B và virus lây qua đường máu
            <br />
            Không bị bệnh tim mạch, huyết áp, hô hấp và dạ dày
          </motion.p>
          <motion.button
            className="mt-6 px-5 py-3 bg-red-700 text-white rounded-lg font-bold flex items-center hover:bg-red-500"
            whileHover={{ scale: 1.05 }}
          >
            <IconClipboardPlus className="mr-2" size={24} /> Đăng Ký Ngay
          </motion.button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>
              Đăng ký Hiến máu 
            </h2>
            <h2>
              Đăng Ký Hiến Máu Khẩn cấp
            </h2>
        </div>
      </div>
    </div>
  );
}
