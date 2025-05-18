import React from "react";
import GuestHeader from "../header/Header";
import GuestFooter from "../footer/GuestFooter";
import { IconBook } from "@tabler/icons-react";



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
        <div className=" w-full max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Tìm hiểu về các nhóm máu</h2>
          <p className="text-gray-700 mb-6">
            Có 8 nhóm máu phổ biến dựa trên sự hiện diện của các kháng nguyên A, B và protein Rh trên bề mặt hồng cầu.
          </p>
          {/* Nhóm máu */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border rounded-lg p-4 text-center">
              <div className="font-bold text-red-600 mb-2">Nhóm máu A</div>
              <div className="text-gray-600 text-sm mb-2">Có kháng nguyên A trên bề mặt hồng cầu và kháng thể kháng B trong huyết tương.</div>
              <div className="flex justify-center gap-2">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">A+</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">A-</span>
              </div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="font-bold text-blue-600 mb-2">Nhóm máu B</div>
              <div className="text-gray-600 text-sm mb-2">Có kháng nguyên B trên bề mặt hồng cầu và kháng thể kháng A trong huyết tương.</div>
              <div className="flex justify-center gap-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">B+</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">B-</span>
              </div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="font-bold text-purple-600 mb-2">Nhóm máu AB</div>
              <div className="text-gray-600 text-sm mb-2">Có cả kháng nguyên A và B trên bề mặt hồng cầu và không có kháng thể trong huyết tương.</div>
              <div className="flex justify-center gap-2">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">AB+</span>
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">AB-</span>
              </div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="font-bold text-green-600 mb-2">Nhóm máu O</div>
              <div className="text-gray-600 text-sm mb-2">Không có kháng nguyên A hay B trên bề mặt hồng cầu, nhưng có cả kháng thể kháng A và B.</div>
              <div className="flex justify-center gap-2">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">O+</span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">O-</span>
              </div>
            </div>
          </div>
          {/* Yếu tố Rh */}
          <div className="mb-8">
            <div className="font-bold text-gray-800 mb-2">Yếu tố Rh</div>
            <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
              <li>
                <b>Rh dương (Rh+):</b> Có kháng nguyên Rh trên bề mặt hồng cầu.
              </li>
              <li>
                <b>Rh âm (Rh-):</b> Không có kháng nguyên Rh trên bề mặt hồng cầu.
              </li>
            </ul>
          </div>
          {/* Bảng phân bố nhóm máu */}
          <div>
            <div className="font-bold text-gray-800 mb-2">Phân bố nhóm máu trên thế giới</div>
            <p className="text-gray-700 text-sm mb-2">
              Phân bố các nhóm máu khác nhau giữa các dân tộc và khu vực địa lý:
            </p>
            <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Nhóm máu</th>
                  <th className="border px-2 py-1">Châu Á</th>
                  <th className="border px-2 py-1">Châu Âu</th>
                  <th className="border px-2 py-1">Châu Phi</th>
                  <th className="border px-2 py-1">Châu Mỹ</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-2 py-1">O+</td><td className="border px-2 py-1">~40%</td><td className="border px-2 py-1">~35%</td><td className="border px-2 py-1">~50%</td><td className="border px-2 py-1">~45%</td></tr>
                <tr><td className="border px-2 py-1">A+</td><td className="border px-2 py-1">~25%</td><td className="border px-2 py-1">~40%</td><td className="border px-2 py-1">~25%</td><td className="border px-2 py-1">~35%</td></tr>
                <tr><td className="border px-2 py-1">B+</td><td className="border px-2 py-1">~25%</td><td className="border px-2 py-1">~10%</td><td className="border px-2 py-1">~15%</td><td className="border px-2 py-1">~10%</td></tr>
                <tr><td className="border px-2 py-1">AB+</td><td className="border px-2 py-1">~10%</td><td className="border px-2 py-1">~5%</td><td className="border px-2 py-1">~5%</td><td className="border px-2 py-1">~5%</td></tr>
                <tr><td className="border px-2 py-1">O-</td><td className="border px-2 py-1">~0.3%</td><td className="border px-2 py-1">~6%</td><td className="border px-2 py-1">~4%</td><td className="border px-2 py-1">~4%</td></tr>
                <tr><td className="border px-2 py-1">A-</td><td className="border px-2 py-1">~0.1%</td><td className="border px-2 py-1">~7%</td><td className="border px-2 py-1">~2%</td><td className="border px-2 py-1">~2%</td></tr>
                <tr><td className="border px-2 py-1">B-</td><td className="border px-2 py-1">~0.1%</td><td className="border px-2 py-1">~1%</td><td className="border px-2 py-1">~1%</td><td className="border px-2 py-1">~1%</td></tr>
                <tr><td className="border px-2 py-1">AB-</td><td className="border px-2 py-1">~0.1%</td><td className="border px-2 py-1">~1%</td><td className="border px-2 py-1">~0.5%</td><td className="border px-2 py-1">~0.5%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
               <div className="h-8" /> 
       
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Thành phần máu và công dụng</h2>
          <p className="text-gray-700 mb-6">
            Máu toàn phần có thể được tách thành nhiều thành phần khác nhau, mỗi thành phần đều có công dụng riêng trong điều trị.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Máu toàn phần */}
            <div className="border rounded-lg p-6">
              <div className="font-bold text-lg mb-2">Máu toàn phần (Whole Blood)</div>
              <div className="text-gray-700 mb-2">
                Máu toàn phần chứa tất cả các thành phần của máu: hồng cầu, bạch cầu, tiểu cầu và huyết tương.
              </div>
              <div className="font-semibold mb-1">Công dụng:</div>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Điều trị mất máu cấp tính</li>
                <li>Phẫu thuật có mất máu nhiều</li>
                <li>Chấn thương nặng</li>
              </ul>
            </div>
            {/* Hồng cầu */}
            <div className="border rounded-lg p-6">
              <div className="font-bold text-lg mb-2">Hồng cầu (Red Cells)</div>
              <div className="text-gray-700 mb-2">
                Hồng cầu là thành phần vận chuyển oxy từ phổi đến các mô và cơ quan trong cơ thể.
              </div>
              <div className="font-semibold mb-1">Công dụng:</div>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Điều trị thiếu máu</li>
                <li>Bệnh hồng cầu hình liềm</li>
                <li>Mất máu mạn tính</li>
              </ul>
            </div>
            {/* Huyết tương */}
            <div className="border rounded-lg p-6">
              <div className="font-bold text-lg mb-2">Huyết tương (Plasma)</div>
              <div className="text-gray-700 mb-2">
                Huyết tương là phần lỏng của máu, chứa nước, protein và các yếu tố đông máu.
              </div>
              <div className="font-semibold mb-1">Công dụng:</div>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Điều trị rối loạn đông máu</li>
                <li>Bệnh gan</li>
                <li>Bỏng nặng</li>
                <li>Sốc nhiễm trùng</li>
              </ul>
            </div>
            {/* Tiểu cầu */}
            <div className="border rounded-lg p-6">
              <div className="font-bold text-lg mb-2">Tiểu cầu (Platelets)</div>
              <div className="text-gray-700 mb-2">
                Tiểu cầu giúp máu đông lại khi có vết thương, ngăn ngừa chảy máu quá nhiều.
              </div>
              <div className="font-semibold mb-1">Công dụng:</div>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Điều trị ung thư</li>
                <li>Ghép tuỷ xương</li>
                <li>Bệnh giảm tiểu cầu</li>
                <li>Xuất huyết do tiểu cầu thấp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <GuestFooter />
    </div>
  );
}
