import { AnimatePresence, motion } from "framer-motion";
import {
  IconHeart,
  IconInfoCircle,
  IconClipboardList,
  IconClipboardPlus,
  IconSettings,
  IconNews,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function GuestIntroduce() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const newsData = [
    {
      id: 1,
      title:
        "KHỞI ĐỘNG THÁNG NHÂN ĐẠO NĂM 2025: HÀNH TRÌNH NHÂN ĐẠO - LAN TỎA YÊU THƯƠNG",
      description:
        "Ngày 8-5, tại TPHCM, Trung ương Hội Chữ thập đỏ Việt Nam và UBND TPHCM phối hợp tổ chức lễ phát động Tháng Nhân đạo cấp quốc gia năm 2025 với chủ đề 'Hành trình nhân đạo - Lan tỏa yêu thương'.",
      date: "08/05/2025",
      image:
        "https://giotmauvang.org.vn/assets/images/271b5fe5f864d480023593de2e8aaf3a.png",
      link: "https://giotmauvang.org.vn/news/khoi-dong-thang-nhan-dao-nam-2025-hanh-trinh-nhan-dao-lan-toa-yeu-thuong",
    },
    {
      id: 2,
      title:
        "KHỞI ĐỘNG THÁNG NHÂN ĐẠO NĂM 2025: HÀNH TRÌNH NHÂN ĐẠO - LAN TỎA YÊU THƯƠNG",
      description:
        "Ngày 8-5, tại TPHCM, Trung ương Hội Chữ thập đỏ Việt Nam và UBND TPHCM phối hợp tổ chức lễ phát động Tháng Nhân đạo cấp quốc gia năm 2025 với chủ đề 'Hành trình nhân đạo - Lan tỏa yêu thương'.",
      date: "08/05/2025",
      image:
        "https://giotmauvang.org.vn/assets/images/271b5fe5f864d480023593de2e8aaf3a.png",
      link: "https://giotmauvang.org.vn/news/khoi-dong-thang-nhan-dao-nam-2025-hanh-trinh-nhan-dao-lan-toa-yeu-thuong",
    },
  ];
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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-gradient-to-r from-red-100 to-white text-black py-16 shadow-lg relative ">
      <motion.h2
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
        className="text-3xl font-bold text-center mb-12 "
      >
        <IconSettings className="inline-block mr-2" size={32} />
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
      {/* Hệ thống thông tin tin tức */}
      <motion.h2
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
        className="mt-10 text-3xl font-bold text-center mb-12 "
      >
        <IconNews className="inline-block mr-2" size={32} /> Thông tin Hệ Thống
        Hỗ Trợ Hiến Máu
      </motion.h2>
      <div className="grid grid-cols-15 gap-10 px-10 mt-8">
        <div className="col-span-12 md:col-span-11 bg-white p-6 rounded-lg shadow-md overflow-hidden relative">
          <h2 className="text-xl font-bold mb-4">Tin tức</h2>
          <div className="overflow-hidden relative">
            <motion.div
              className="flex"
              initial={{ x: 0 }}
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{ width: `${newsData.length * 100}%` }}
            >
              {newsData.map((news) => (
                <div className="min-w-full p-4" key={news.id}>
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-200 h-100 object-cover rounded"
                  />
                  <h6 className="text-lg font-semibold mt-2">{news.title}</h6>
                  <p className="text-sm text-gray-600 mt-1">
                    {news.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{news.date}</p>
                  <a
                    href={news.link}
                    className="text-blue-500 mt-2 inline-block"
                  >
                    Xem thêm
                  </a>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Kinh Nghiệm Hiến Máu</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg">🌿 Trước khi hiến máu:</h3>
              <ul className="list-disc pl-5">
                <li>Ăn uống đầy đủ, tránh đồ nhiều dầu mỡ.</li>
                <li>Uống đủ nước để máu lưu thông tốt hơn.</li>
                <li>Ngủ đủ giấc, tránh đồ uống có cồn.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg">💉 Trong khi hiến máu:</h3>
              <ul className="list-disc pl-5">
                <li>Thư giãn, hít thở sâu và giữ bình tĩnh.</li>
                <li>Thông báo tình trạng sức khỏe nếu có bất thường.</li>
                <li>Nắm chặt và thả lỏng bàn tay để máu lưu thông.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg">🍊 Sau khi hiến máu:</h3>
              <ul className="list-disc pl-5">
                <li>Nghỉ ngơi ít nhất 15 phút.</li>
                <li>Uống nước cam hoặc nước trái cây bổ sung vitamin C.</li>
                <li>Tránh vận động mạnh trong 24 giờ.</li>
                <li>Chú ý vùng băng tay nếu có dấu hiệu sưng đỏ.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                🌟 Một số lời khuyên khác:
              </h3>
              <ul className="list-disc pl-5">
                <li>Mặc áo tay ngắn để tiện cho việc lấy máu.</li>
                <li>Rủ thêm bạn bè nếu bạn lo lắng.</li>
                <li>Lưu giữ thẻ hiến máu và thông tin trung tâm hiến máu.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
