import React from "react";
import GuestHeader from "../header/Header";
import GuestFooter from "../footer/GuestFooter";
import { IconNews } from "@tabler/icons-react";

const newsList = [
  {
    id: 1,
    title: "Ngày hội hiến máu toàn quốc 2024 diễn ra sôi nổi",
    description: "Hàng nghìn người dân trên cả nước đã tham gia ngày hội hiến máu, góp phần cứu sống nhiều bệnh nhân.",
    date: "10/06/2024",
    image: "https://static.vinmec.com/2022/07/15/hiem-mau-tinh-nguyen.jpg",
    link: "#"
  },
  {
    id: 2,
    title: "Câu chuyện xúc động từ người hiến máu nhiều lần",
    description: "Chia sẻ của anh Nguyễn Văn A về hành trình hiến máu hơn 20 lần và những cảm xúc đặc biệt.",
    date: "05/06/2024",
    image: "https://media.baodautu.vn/Images/duongngoc/2021/06/14/nguoi-hien-mau.jpg",
    link: "#"
  },
  {
    id: 3,
    title: "Các bệnh viện kêu gọi hiến máu nhóm O",
    description: "Nguồn máu nhóm O đang thiếu hụt nghiêm trọng, các bệnh viện lớn đồng loạt kêu gọi cộng đồng tham gia hiến máu.",
    date: "01/06/2024",
    image: "https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/4/7/hien-mau-16808596485891964685741.jpg",
    link: "#"
  },
  // Thêm tin tức khác nếu muốn
];

export default function BloodNews() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <GuestHeader />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-2 mb-2">
            <IconNews size={32} className="text-red-700" />
            Tin tức về hiến máu
          </h1>
          <p className="text-gray-700 text-lg">
            Cập nhật các sự kiện, hoạt động và câu chuyện ý nghĩa về hiến máu trên toàn quốc.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {newsList.map(news => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-red-800 mb-2">{news.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{news.date}</p>
                <p className="text-gray-600 mb-4">{news.description}</p>
                <a
                  href={news.link}
                  className="text-red-600 font-semibold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem chi tiết
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GuestFooter />
    </div>
  );
}
