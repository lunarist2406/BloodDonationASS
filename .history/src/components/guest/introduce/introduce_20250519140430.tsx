import { motion } from "framer-motion";
import {
  IconHeart,
  IconInfoCircle,
  IconClipboardList,
  IconClipboardPlus,
  IconSettings,
  IconNews,
} from "@tabler/icons-react";

export default function GuestIntroduce() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const steps = [
    {
      number: 1,
      title: "Đăng Ký Hiến Máu",
      description: "Điền thông tin và gửi đăng ký.",
    },
    {
      number: 2,
      title: "Khám Sức Khỏe",
      description: "Kiểm tra sức khỏe trước khi hiến máu.",
    },
    {
      number: 3,
      title: "Hiến Máu",
      description: "Thực hiện quá trình hiến máu an toàn.",
    },
    {
      number: 4,
      title: "Nhận Giấy Chứng Nhận",
      description: "Nghỉ ngơi và nhận giấy chứng nhận.",
    },
  ];
  return (
    <div className="bg-gradient-to-r from-red-100 to-white text-black py-16 shadow-lg relative ">
      <motion.h2
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
        className="text-3xl font-bold text-center mb-12 "
      >
        <IconSettings className="inline-block mr-2" size={32} /> Giới Thiệu Về
        Hệ Thống Hỗ Trợ Hiến Máu
      </motion.h2>

      <div className="grid grid-cols-12 gap-10 px-10 mt-8">
        {/* Form đăng ký chiếm 1/3 (4 cột) */}
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg shadow-md ">
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

        {/* Quy trình chiếm 2/3 (8 cột) */}
        <div className="col-span-12 md:col-span-6 max-w-full mx-auto">
          {/* Tiêu đề quy trình với icon */}
          <motion.h3
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            variants={fadeInUp}
            className="text-2xl font-bold flex items-center mb-8"
          >
            <IconClipboardList
              className="inline-block mr-3 text-red-600"
              size={30}
            />
            Quy trình Đăng Ký Hiến Máu
          </motion.h3>

          <div className="flex items-center relative">
            {/* Đường kẻ ngang toàn bộ, nằm giữa số bước */}
            <div className="absolute top-6 left-0 right-0 w-[900px] h-[2px] bg-red-500"></div>

            {steps.map(({ number, title, description }, index) => (
              <motion.div
                key={number}
                className="flex flex-col items-center relative flex-1 min-h-[120px] min-w-[220px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.4 }}
              >
                {/* Số bước nằm trên đường kẻ, cố định kích thước và căn giữa */}
                <motion.div
                  className="z-10 w-10 h-10 rounded-full bg-gradient-to-r from-red-300 via-red-800 to-red-400 text-white flex items-center justify-center font-bold text-lg border-4 border-white"
                  animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "400% 100%",
                  }}
                >
                  {number}
                </motion.div>

                {/* Nội dung mô tả nằm dưới số */}
                <motion.div
                  className="mt-3 text-center max-w-[200px]"
                  whileHover={{ scale: 1.05, color: "#ff0000" }}
                >
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-gray-700 text-sm mt-1">{description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5  w-[900px]">
            <motion.div
              className="bg-white p-5 rounded-lg shadow-md"
              whileHover={{ scale: 1.05, color: "#ff0000" }}
            >
              <h3 className="text-xl font-semibold mb-3 text-red-600">
                Lợi Ích Hiến Máu
              </h3>
              <p>
                Hiến máu giúp cứu sống người bệnh, hỗ trợ cấp cứu và điều trị
                trong nhiều tình huống khẩn cấp.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-5 rounded-lg shadow-md"
              whileHover={{ scale: 1.05, color: "#ff0000" }}
            >
              <h3 className="text-xl font-semibold mb-3 text-red-600">
                Lưu Ý Sau Khi Hiến Máu
              </h3>
              <p>
                Nghỉ ngơi hợp lý, uống nhiều nước, tránh vận động mạnh và các
                hoạt động nặng trong vài giờ sau hiến máu.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-5 rounded-lg shadow-md"
              whileHover={{ scale: 1.05, color: "#ff0000" }}
            >
              <h3 className="text-xl font-semibold mb-3 text-red-600">
                Thông Tin Hiến Máu Tình Nguyện
              </h3>
              <p>
                Hiến máu tình nguyện là hành động nhân đạo, thể hiện tinh thần
                sẻ chia, giúp đỡ cộng đồng.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
  
      <motion.h2
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
        className="mt-10 text-3xl font-bold text-center mb-12 "
      >
        <IconNews  className="inline-block mr-2" size={32} /> Giới Thiệu Về
        Thông tin Hệ Thống Hỗ Trợ Hiến Máu
      </motion.h2>

    </div>
  );
}
