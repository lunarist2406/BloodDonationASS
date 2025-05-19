import React from "react";
import GuestHeader from "../header/Header";
import GuestFooter from "../footer/GuestFooter";
import { IconMessage } from "@tabler/icons-react";

const experiences = [
  {
    id: 1,
    author: "Trương Văn Phước",
    title: "Mỗi lần hiến máu, mình cảm thấy đã làm được một việc có ý nghĩa cho xã hội",
    content:
      "Anh Trương Văn Phước, một tình nguyện viên tại huyện Nhà Bè, TP.HCM, đã tham gia hiến máu 46 lần trong suốt 20 năm. Ban đầu, anh cũng có những lo lắng về sức khỏe, nhưng sau lần hiến máu đầu tiên, anh nhận thấy sức khỏe vẫn ổn định và tiếp tục tham gia hiến máu đều đặn. Anh còn tích cực vận động người thân và đồng nghiệp cùng tham gia hiến máu, trở thành tấm gương sáng trong cộng đồng.",
    date: "02/06/2024",
  },
  {
    id: 2,
    author: "Lý Trường Thành",
    title: "Cuộc sống của em có ý nghĩa hơn khi tham gia hiến máu!",
    content:
      "Lý Trường Thành, sinh viên năm thứ 2 Trường Đại học Công nghệ – ĐHQGHN, chia sẻ rằng việc tham gia hiến máu tình nguyện giúp cuộc sống của em trở nên ý nghĩa hơn. Sau lần hiến máu đầu tiên, em cảm thấy bớt hồi hộp và lo lắng, nhận ra rằng hành động nhỏ bé của mình có thể giúp đỡ những người cần máu.",
    date: "28/05/2024",
  },
  {
    id: 3,
    author: "Chị Loan",
    title: "Mỗi giọt máu cho đi - Một cuộc đời ở lại",
    content:
      "Chị Loan, một cán bộ Đoàn tại Thanh Hóa, luôn tâm niệm rằng hiến máu tình nguyện không chỉ giúp đỡ bệnh nhân mà còn là cách để kiểm tra sức khỏe của bản thân. Chị tích cực vận động gia đình, bạn bè và đồng nghiệp tham gia hiến máu, lan tỏa thông điệp yêu thương trong cộng đồng.",
    date: "20/05/2024",
  },
    {
    id: 4,
    author: "Nguyễn Văn Hảo",
    title: "Mỗi giọt máu cho đi một cuộc đời ở lại",
    content:
      "Thiếu tá Nguyễn Văn Hảo, Trưởng phòng Điều độ, Công ty cổ phần Kho vận Tân cảng, đã tham gia hiến máu 23 lần. Tại các điểm hiến máu, anh thường xuyên tư vấn và chia sẻ kinh nghiệm với những người lần đầu tham gia, giúp họ cảm thấy yên tâm và hiểu rõ hơn về quy trình hiến máu.",
    date: "20/05/2024",
  },
    {
    id: 5,
    author: "Phạm Phú Mỹ",
    title: "Thường xuyên hiến máu, hiến huyết tương, chia sẻ yêu thương, trao sự sống",
    content:
      "Anh Phạm Phú Mỹ ở Quảng Ngãi đã có 48 lần hiến máu, trong đó có nhiều lần hiến máu khẩn cấp. Đặc biệt, trong thời điểm dịch COVID-19 bùng phát, anh và vợ đã kịp thời hiến máu cứu một sản phụ đang cần truyền máu gấp, thể hiện tinh thần nhân đạo và trách nhiệm cộng đồng.",
    date: "20/05/2024",
  },
  // Thêm các kinh nghiệm khác nếu muốn
];

export default function BloodExperience() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <GuestHeader />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-2 mb-2">
            <IconMessage size={32} className="text-red-700" />
            Chia sẻ kinh nghiệm
          </h1>
          <p className="text-gray-700 text-lg">
            Những câu chuyện, bí quyết và trải nghiệm thực tế từ cộng đồng hiến máu.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {experiences.map(exp => (
            <div
              key={exp.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
            >
              <h2 className="text-xl font-bold text-red-800 mb-1">{exp.title}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {/* {exp.author} &nbsp;|&nbsp; {exp.date} */}
              </p>
              <p className="text-gray-700 flex-1 mb-2">{exp.content}</p>
            </div>
          ))}
        </div>
      </div>
      <GuestFooter />
    </div>
  );
}
