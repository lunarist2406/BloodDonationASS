import React from "react";
import GuestHeader from "../header/Header";
import GuestFooter from "../footer/GuestFooter";
import { IconNews } from "@tabler/icons-react";

const newsList = [
  {
    id: 1,
    title: "KHỞI ĐỘNG THÁNG NHÂN ĐẠO NĂM 2025: HÀNH TRÌNH NHÂN ĐẠO - LAN TỎA YÊU THƯƠNG",
    description: "Ngày 8-5, tại TPHCM, Trung ương Hội Chữ thập đỏ Việt Nam và UBND TPHCM phối hợp tổ chức lễ phát động Tháng Nhân đạo cấp quốc gia năm 2025 với chủ đề 'Hành trình nhân đạo - Lan tỏa yêu thương'.",
    date: "08/05/2025",
    image: "https://giotmauvang.org.vn/assets/images/271b5fe5f864d480023593de2e8aaf3a.png",
    link: "https://giotmauvang.org.vn/news/khoi-dong-thang-nhan-dao-nam-2025-hanh-trinh-nhan-dao-lan-toa-yeu-thuong"
  },
  {
    id: 2,
    title: "NGÀY TOÀN DÂN HIẾN MÁU 7/4/2025",
    description: "Ngày 7/4, chúng ta cùng nhau hướng về một ngày ý nghĩa – Ngày Toàn dân hiến máu tình nguyện.",
    date: "07/04/2025",
    image: "https://giotmauvang.org.vn/assets/images/7eab298659878b1f5644db7cfc2091ae.jpg",
    link: "https://giotmauvang.org.vn/news/ngay-toan-dan-hien-mau-742025"
  },
  {
    id: 3,
    title: "ÁP DỤNG CÔNG NGHỆ SỐ TRONG HOẠT ĐỘNG HIẾN MÁU TÌNH NGUYỆN",
    description: "Ngày 04/3, tại Trung tâm Hiến máu nhân đạo, Hội Chữ thập đỏ Thành phố phối hợp Hội Tin học Thành phố cùng với sự đồng hành của các đối tác thực hiện trao tặng trang thiết bị phục vụ cho công tác hiến máu tình nguyện.",
    date: "04/03/2025",
    image: "https://giotmauvang.org.vn/assets/images/da5501e9bb4fde7f2a6c831c04eae5e7.jpg",
    link: "https://giotmauvang.org.vn/news/ap-dung-cong-nghe-so-trong-hoat-dong-hien-mau-tinh-nguyen"
  },
  {
    id: 4,
    title: "HƠN 1.000 ĐƠN VỊ ĐƯỢC TIẾP NHẬN TẠI LỄ HỘI XUÂN HỒNG NĂM 2025",
    description: "Sáng ngày 15-1, Ban Chỉ đạo vận động hiến máu tình nguyện TPHCM tổ chức tổng kết công tác vận động hiến máu tình nguyện năm 2024 và phát động Chiến dịch vận động hiến máu tình nguyện dịp Tết Nguyên đán 'Lễ hội Xuân hồng năm 2025'; Ngày hội hiến máu 'Giọt hồng khai Xuân'.",
    date: "15/01/2025",
    image: "https://giotmauvang.org.vn/assets/images/71a1a5459a5869b6a90b417182830d36.png",
    link: "https://giotmauvang.org.vn/news/hon-1000-don-vi-mau-duoc-tiep-nhan-tai-le-hoi-xuan-hong-nam-2025"
  },
  {
    id: 5,
    title: "HỘI NGHỊ TỔNG KẾT CÔNG TÁC VẬN ĐỘNG HIẾN MÁU TÌNH NGUYỆN NĂM 2024",
    description: "Ngày 20/12/2024, Bệnh viện Truyền máu Huyết học đã tổ chức thành công 'Hội Nghị Tổng Kết Công Tác Vận động Hiến Máu Tình Nguyện Năm 2024'.",
    date: "20/12/2024",
    image: "https://giotmauvang.org.vn/assets/images/b29b36485037691b95a6c99867a3ae77.jpg",
    link: "https://giotmauvang.org.vn/news/ngay-20-12-2024-benh-vien-truyen-mau-huyet-hoc-da-to-chuc-thanh-cong-hoi-nghi-tong-ket-cong-tac-van-dong-hien-mau-tinh-nguyen-nam-2024"
  },
  {
    id: 6,
    title: "KỶ NIỆM 25 NĂM THÀNH LẬP VÀ PHÁT TRIỂN TRUNG TÂM HIẾN MÁU NHÂN ĐẠO TPHCM",
    description: "Ngày 26/12, Trung tâm Hiến máu nhân đạo TPHCM tổ chức kỷ niệm 25 năm ngày thành lập (1999-2024).",
    date: "26/12/2024",
    image: "https://giotmauvang.org.vn/assets/images/6e1692feb6fcf12a2cc8938a321d19ae.jpg",
    link: "https://giotmauvang.org.vn/news/ky-niem-25-nam-thanh-lap-va-phat-trien-Trung-tam-Hien-mau-nhan-dao-TPHCM"
  },
  {
    id: 7,
    title: "CHƯƠNG TRÌNH LỄ KỶ NIỆM 30 NĂM XÂY DỰNG VÀ PHÁT TRIỂN PHONG TRÀO HIẾN MÁU TÌNH NGUYỆN THÀNH PHỒ HỒ CHÍ MINH GIAI ĐOẠN (1994-2024)",
    description: "Sáng 22/11, Ban chỉ đạo vận động hiến máu tình nguyện TPHCM tổ chức họp mặt kỷ niệm 30 năm xây dựng và phát triển phong trào hiến máu tình nguyện TPHCM (1994-2024)",
    date: "22/11/2024",
    image: "https://giotmauvang.org.vn/assets/images/0fd6921ff5382a668b8b8b88353e24b1.jpg",
    link: "https://giotmauvang.org.vn/news/chuong-trinh-le-ky-niem-30-nam-xay-dung-va-phat-trien-phong-trao-hien-mau-tinh-nguyen-thanh-pho-ho-chi-minh-giai-doan-1994-2024"
  },
  {
    id: 8,
    title: "30 NĂM PHONG TRÀO HIẾN MÁU (TRI ÂN NGƯỜI HIẾN MÁU NHIỀU CÓ HOÀN CẢNH KHÓ KHĂN)",
    description: "Sáng ngày 19/09/2024, Ban chỉ đạo vận động hiến máu tình nguyện TP.HCM tổ chức tổ chức chương trình tri ân người hiến máu nhiều lần có hoàn cảnh khó khăn. Hoạt động nhân dịp Kỷ niệm 30 năm xây dựng và phát triển phong trào hiến máu tình nguyện TP.HCM (1994 -2024).",
    date: "12/09/2024",
    image: "https://giotmauvang.org.vn/assets/images/3442d1cfdb7a8fb5089b792df1128934.jpg",
    link: "https://giotmauvang.org.vn/news/30-phong-trao-hien-mau-tri-an-nguoi-co-hoan-canh-kho-khan"
  },
  {
    id: 9,
    title: "HÀNH TRÌNH ĐỎ 2024: TỔ CHỨC 431 ĐIỂM HIẾN MÁU, TIẾP NHẬN HƠN 128.000 ĐƠN VỊ MÁU",
    description: "Trải qua 58 ngày (từ 1/6 đến 28/7), Hành trình Đỏ lần thứ XII năm 2024 đã tổ chức được 431 điểm hiến máu tại 51 tỉnh/thành phố, tiếp nhận 128.119 đơn vị máu; trung bình mỗi buổi tổ chức đạt gần 300 đơn vị máu.",
    date: "16/08/2024",
    image: "https://giotmauvang.org.vn/assets/images/ac5a7c82cf1f1d1d13df1210954ea82c.jpg",
    link: "https://giotmauvang.org.vn/news/hanh-trinh-do-2024-to-chuc-431-diem-hien-mau-tiep-nhan-hon-128-000-don-vi-mau"
  },
  {
    id: 10,
    title: "HỘI NGHỊ SƠ KẾT CÔNG TÁC VẬN ĐỘNG HIẾN MÁU TÌNH NGUYỆN 6 THÁNG ĐẦU NĂM 2024",
    description: "Ngày 05/07/2024, tại 118 Hồng Bàng, phường 12, quận 5, Bệnh viện Truyền máu Huyết học đã tổ chức thành công 'Hội nghị Sơ kết Công tác Vận động Hiến máu Tình nguyện 6 tháng đầu năm 2024'. Đây là dịp để tổng kết, đánh giá những thành quả đã đạt được trong công tác vận động hiến máu, đồng thời đề ra phương hướng, mục tiêu cho giai đoạn tiếp theo.",
    date: "05/07/2024",
    image: "https://giotmauvang.org.vn/assets/images/c6e6719076ad9f7f73e948e51d2093aa.png",
    link: "https://giotmauvang.org.vn/news/hoi-nghi-so-ket-cong-tac-van-dong-hien-mau-tinh-nguyen-6-thang-dau-nam-2024"
  },
  {
    id: 11,
    title: "BV.TMHH THAM GIA HÀNH TRÌNH ĐỎ LẦN THỨ 12/2024",
    description: "Từ ngày 1/6/2024 đến ngày 28/7/2024, Bệnh Viện Truyền Máu Huyết Học Thành Phố Hồ Chí Minh sẽ cùng đồng hành với 50 tỉnh thành trên cả nước tham gia hành trình đỏ lần thứ 12 - năm 2024. Đây là một chương trình kết nối dòng máu việt với sứ mệnh giải quyết tình trạng thiếu hụt máu cho điều trị, đồng thời nâng cao ý thức cộng đồng về tầm quan trọng của việc hiến máu tình nguyện",
    date: "01/06/2024",
    image: "https://giotmauvang.org.vn/assets/images/c6aff84e345ba95b0c2acfedca79d34c.png",
    link: "https://giotmauvang.org.vn/news/bvtmhh-tham-gia-hanh-trinh-do-lan-thu-12-2024"
  },
  {
    id: 12,
    title: "VẬN ĐỘNG HIẾN MÁU 6 THÁNG ĐẦU NĂM 2024",
    description: "NHM đã cung cấp kịp thời và đầy đủ lượng máu cho các bệnh viện trong khu vực TP.HCM. Việc cung cấp máu được thực hiện theo kế hoạch của từng bệnh viện. Bên cạnh đó, NHM cũng đã hỗ trợ cho các bệnh viện thuộc khu vực miền Tây Năm Bộ trong 6 tháng đầu năm 2024.",
    date: "05/07/2024",
    image: "https://giotmauvang.org.vn/assets/images/3bf159e16cde41264285f346349a6ef8.png",
    link: "https://giotmauvang.org.vn/news/van-dong-hien-mau-6-thang-dau-nam-2024"
  },
  {
    id: 13,
    title: "TĂNG CƯỜNG TIẾP NHẬN NHÓM MÁU AB",
    description: "Ngân Hàng máu thiếu trầm trọng nhóm máu AB chỉ còn chưa đến 100 túi trong kho",
    date: "10/06/2024",
    image: "https://giotmauvang.org.vn/assets/images/a477d2d19cc95675f89fdbd7253e0d3c.png",
    link: "https://giotmauvang.org.vn/news/tang-cuong-tiep-nhan-nhom-mau-ab"
  },
  {
    id: 14,
    title: "VẬN ĐỘNG NGƯỜI DÂN THAM GIA HIẾN MÁU HỖ TRỢ KHU VỰC MIỀN TÂY NAM BỘ",
    description: "Với sứ mệnh là Ngân Hàng Máu cung cấp chế phẩm máu cho hơn 150 bệnh viện trên địa bàn TP.HCM và hỗ trợ cho miền Tây Nam Bộ trong dịp Tết Nguyên Đán này. Để giúp cho những người bệnh cũng có được một cái Tết ấm no, chúng tôi kính mong quý vị hãy sắp xếp thời gian quý báu đến tham gia hiến máu nhân đạo, giúp cho dự trữ kho Ngân Hàng Máu nằm ở mức an toàn trước khi bước vào kì nghỉ Tết Nguyên Đán gần 10 ngày.",
    date: "26/01/2024",
    image: "https://giotmauvang.org.vn/assets/images/4b4a851b9cd65a32053984e330c9e665.jpg",
    link: "https://giotmauvang.org.vn/news/van-dong-nguoi-dan-tham-gai-hien-mau-ho-tro-cho-khu-vuc-mien-tay-nam-bo"
  },
  {
    id: 15,
    title: "BỆNH VIỆN TRUYỀN MÁU HUYẾT HỌC BÁO CÁO SỐ LIỆU TIẾP NHẬN MÁU NĂM 2023",
    description: "Sáng 5/1/2024, Bệnh viện Truyền Máu Huyết Học (BV.TMHH) tổ chức Hội nghị tổng kết Hiến máu tình nguyện năm 2023 và triển khai kế hoạch công tác vận động hiến máu tình nguyện năm 2024; phát động chiến dịch vận động hiến máu tình nguyện dịp Tết Nguyên Đán Giáp Thìn -Lễ hội Xuân hồng 2024 với thông điệp 'Hiến giọt máu đào -Trao đời sự sống'.",
    date: "05/01/2024",
    image: "https://giotmauvang.org.vn/assets/images/951aa4d26cf57b7aaf7d299e1a13413f.png",
    link: "https://giotmauvang.org.vn/news/benh-vien-truyen-mau-huyen-hoc-bao-cao-so-lieu-tiep-nhan-mau-nam-2023"
  },
  {
    id: 16,
    title: "NGÀY 'THẾ GIỚI TÔN VINH NGƯỜI HIẾN MÁU'",
    description: "Ngày 14/06/2023, Bệnh viện Truyền Máu Huyết Học tổ chức tri ân người hiến máu tình nguyện nhân dịp kỷ niệm Ngày Thế giới Hiến máu năm 2023 (World Blood Donor Day 2023).",
    date: "14/06/2024",
    image: "https://giotmauvang.org.vn/assets/images/9ea3823e878acd232152f9e8bdb66f66.png",
    link: "https://giotmauvang.org.vn/news/ngay-the-gioi-ton-vinh-nguoi-hien-mau"
  },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {newsList.map(news => (
            <a
              key={news.id}
              href={news.link}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer block"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2
                  className="text-xl font-bold text-red-800 mb-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {news.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">{news.date}</p>
                <p
                  className="text-gray-600 mb-4"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {news.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <GuestFooter />
    </div>
  );
}
