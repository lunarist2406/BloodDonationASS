import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { IconInfoCircle, IconClipboardList, IconClipboardPlus, IconSettings, IconNews } from "@tabler/icons-react"
import { newsList } from "../../member/information/newsData"
import { Carousel } from "antd"

export default function GuestIntroduce() {
  const navigate = useNavigate()

  const handleRegister = () => {
    navigate("register-blood")
  }

  // Hiệu ứng xuất hiện từ dưới lên
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

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
  ]

  return (
    <div className="bg-gradient-to-r from-red-100 to-white text-black py-8 md:py-16 shadow-lg relative">
      <motion.h2
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 px-4"
      >
        <IconSettings className="inline-block mr-2" size={28} />
        <span className="block sm:inline">Giới Thiệu Về</span>
        <span className="block sm:inline"> Hệ Thống Hỗ Trợ Hiến Máu</span>
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 h[50px] gap-6 lg:gap-10 py-10 sm:px-6 md:px-10 mt-8">
        {/* Form đăng ký */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md py-10 px-10 ">
          <motion.h3
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            variants={fadeInUp}
            className="text-lg sm:text-xl font-semibold flex items-center"
          >
            <IconClipboardList className="inline-block mr-2" size={24} />
            Đăng Ký Hiến Máu
          </motion.h3>

          <motion.h3
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            variants={fadeInUp}
            className="text-lg sm:text-xl font-semibold flex items-center mt-4"
          >
            <IconInfoCircle className="inline-block mr-2" size={24} />
            Yêu Cầu
          </motion.h3>

          <motion.p
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            variants={fadeInUp}
            className="text-sm sm:text-base leading-relaxed mt-4 "
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
            onClick={handleRegister}
            className="mt-6 px-4 sm:px-5 py-2 sm:py-3 bg-red-700 text-white rounded-lg font-bold flex items-center hover:bg-red-500 cursor-pointer w-full sm:w-auto justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <IconClipboardPlus className="mr-2 text-white" size={20} />
            <span className="text-white">Đăng Ký Ngay</span>
          </motion.button>
        </div>

        {/* Quy trình */}
        <div className="lg:col-span-8 w-full">
          {/* Tiêu đề quy trình với icon */}
          <motion.h3
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            variants={fadeInUp}
            className="text-xl sm:text-2xl font-bold flex items-center mb-6 md:mb-8"
          >
            <IconClipboardList className="inline-block mr-2 sm:mr-3 text-red-600" size={26} />
            Quy trình Đăng Ký Hiến Máu
          </motion.h3>

          {/* Desktop Process Steps */}
          <div className="hidden md:block">
            <div className="flex items-center relative">
              {/* Đường kẻ ngang responsive */}
              <div className="absolute top-5 left-0 right-0 w-full h-[2px] bg-red-500"></div>
              {steps.map(({ number, title, description }, index) => (
                <motion.div
                  key={number}
                  className="flex flex-col items-center relative flex-1 min-h-[180px] min-w-[220px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.4 }}
                >
                  {/* Số bước nằm trên đường kẻ */}
                  <motion.div
                    className="z-10 w-10 h-10 rounded-full bg-gradient-to-r from-red-300 via-red-800 to-red-400 text-white flex items-center justify-center font-bold text-lg border-4 border-white"
                    animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "400% 100%",
                    }}
                  >
                    {number}
                  </motion.div>
                  {/* Nội dung mô tả nằm dưới số */}
                  <motion.div className="mt-5 text-center max-w-[160px]" whileHover={{ scale: 1.05, color: "#ff0000" }}>
                    <h3 className="font-semibold text-base lg:text-lg">{title}</h3>
                    <p className="text-gray-700 text-xs lg:text-sm mt-1">{description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Process Steps - Vertical Layout */}
          <div className="md:hidden space-y-4">
            {steps.map(({ number, title, description }, index) => (
              <motion.div
                key={number}
                className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-red-300 via-red-800 to-red-400 text-white flex items-center justify-center font-bold text-sm flex-shrink-0"
                  animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "400% 100%",
                  }}
                >
                  {number}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-base">{title}</h3>
                  <p className="text-gray-700 text-sm mt-1">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits Cards - Responsive Grid */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
            <motion.div
              className="bg-white p-4 md:p-5 rounded-lg shadow-md"
              whileHover={{ scale: 1.02, color: "#ff0000" }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-red-600">Lợi Ích Hiến Máu</h3>
              <p className="text-sm md:text-base">
                Hiến máu giúp cứu sống người bệnh, hỗ trợ cấp cứu và điều trị trong nhiều tình huống khẩn cấp.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-4 md:p-5 rounded-lg shadow-md"
              whileHover={{ scale: 1.02, color: "#ff0000" }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-red-600">Lưu Ý Sau Khi Hiến Máu</h3>
              <p className="text-sm md:text-base">
                Nghỉ ngơi hợp lý, uống nhiều nước, tránh vận động mạnh và các hoạt động nặng trong vài giờ sau hiến máu.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-4 md:p-5 rounded-lg shadow-md sm:col-span-2 lg:col-span-1"
              whileHover={{ scale: 1.02, color: "#ff0000" }}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-red-600">Thông Tin Hiến Máu Tình Nguyện</h3>
              <p className="text-sm md:text-base">
                Hiến máu tình nguyện là hành động nhân đạo, thể hiện tinh thần sẻ chia, giúp đỡ cộng đồng.
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
        className="mt-8 md:mt-10 text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 leading-relaxed pt-8 md:pt-12 px-4"
      >
        <IconNews className="inline-block mr-2" size={28} />
        <span className="block sm:inline">Thông tin Hệ Thống</span>
        <span className="block sm:inline"> Hỗ Trợ Hiến Máu</span>
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 sm:px-6 md:px-10 mt-6 md:mt-10">
        {/* News Section */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-bold mb-4">Tin tức</h2>
          <Carousel autoplay dots={true}>
            {newsList.length > 0 ? (
              newsList.map((news) => (
                <div key={news.id} className="p-2 sm:p-4">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg"
                  />
                  <h3 className="text-base md:text-lg font-semibold mt-2">{news.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-3">{news.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{news.date}</p>
                  <a href={news.link} className="text-blue-500 mt-2 inline-block text-sm hover:underline">
                    Xem thêm
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            )}
          </Carousel>
        </div>

        {/* Experience Section */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Kinh Nghiệm Hiến Máu</h2>
          <div className="mt-4 md:mt-8 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-base md:text-lg">🌿 Trước khi hiến máu:</h3>
              <ul className="list-disc pl-5 text-sm md:text-base space-y-1">
                <li>Ăn uống đầy đủ, tránh đồ nhiều dầu mỡ.</li>
                <li>Uống đủ nước để máu lưu thông tốt hơn.</li>
                <li>Ngủ đủ giấc, tránh đồ uống có cồn.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base md:text-lg">💉 Trong khi hiến máu:</h3>
              <ul className="list-disc pl-5 text-sm md:text-base space-y-1">
                <li>Thư giãn, hít thở sâu và giữ bình tĩnh.</li>
                <li>Thông báo tình trạng sức khỏe nếu có bất thường.</li>
                <li>Nắm chặt và thả lỏng bàn tay để máu lưu thông.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base md:text-lg">🍊 Sau khi hiến máu:</h3>
              <ul className="list-disc pl-5 text-sm md:text-base space-y-1">
                <li>Nghỉ ngơi ít nhất 15 phút.</li>
                <li>Uống nước cam hoặc nước trái cây bổ sung vitamin C.</li>
                <li>Tránh vận động mạnh trong 24 giờ.</li>
                <li>Chú ý vùng băng tay nếu có dấu hiệu sưng đỏ.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base md:text-lg">🌟 Một số lời khuyên khác:</h3>
              <ul className="list-disc pl-5 text-sm md:text-base space-y-1">
                <li>Mặc áo tay ngắn để tiện cho việc lấy máu.</li>
                <li>Rủ thêm bạn bè nếu bạn lo lắng.</li>
                <li>Lưu giữ thẻ hiến máu và thông tin trung tâm hiến máu.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
