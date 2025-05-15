import React from "react";
import GuestHeader from "../header/Header";
import GuestFooter from "../footer/GuestFooter";
import { IconBook } from "@tabler/icons-react";

const documents = [
  {
    id: 1,
    title: "Tổng quan về các nhóm máu",
    description: "Tìm hiểu về các nhóm máu chính, đặc điểm và ý nghĩa trong truyền máu.",
    link: "#"
  },
  {
    id: 2,
    title: "Quy trình hiến máu an toàn",
    description: "Các bước chuẩn bị, quy trình và lưu ý khi tham gia hiến máu.",
    link: "#"
  },
  {
    id: 3,
    title: "Lợi ích của việc hiến máu",
    description: "Những lợi ích về sức khỏe và cộng đồng khi bạn tham gia hiến máu.",
    link: "#"
  },
  // Thêm các tài liệu khác nếu muốn
];

export default function BloodDocuments() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <GuestHeader />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-2 mb-2">
            <IconBook size={32} className="text-red-700" />
            Tài liệu về máu
          </h1>
          <p className="text-gray-700 text-lg">
            Tổng hợp các kiến thức, hướng dẫn và thông tin hữu ích về máu, hiến máu và truyền máu.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold text-red-800 mb-2">{doc.title}</h2>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              <a
                href={doc.link}
                className="text-red-600 font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem chi tiết
              </a>
            </div>
          ))}
        </div>
      </div>
      <GuestFooter />
    </div>
  );
}