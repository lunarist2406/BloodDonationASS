import {
  IconUser,
  IconCalendar,
  IconPhone,
  IconMapPin,
  IconDroplet,
  IconUserHeart,
} from "@tabler/icons-react";
import { notification } from "antd";

export default function FormRegisterBlood({ formData, setFormData, setWaitingList }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.dob ||
      !formData.phone ||
      !formData.roleDonation ||
      !formData.bloodType ||
      !formData.location
    ) {
      notification.error({
        message: "Lỗi Đăng Ký",
        description: "Vui lòng điền đầy đủ thông tin.",
      });
      return;
    }

    setWaitingList((prevList) => [
      ...prevList,
      { ...formData, status: "Đang chờ xác nhận" },
    ]);

    setFormData({
      fullName: "",
      dob: "",
      phone: "",
      roleDonation: "",
      bloodType: "",
      location: "",
    });
  };

  const inputStyle =
    "w-full px-3 py-2 border rounded pl-10 bg-white text-gray-800";
  const inputWrapper = "relative mb-4";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Đăng Ký Hiến Máu</h2>
      <form onSubmit={handleSubmit}>
        {/* Họ và tên */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Họ và tên</label>
          <div className="relative">
            <IconUser className="absolute top-3 left-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Nhập họ và tên"
            />
          </div>
        </div>

        {/* Ngày sinh */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Ngày sinh</label>
          <div className="relative">
            <IconCalendar className="absolute top-3 left-3 text-gray-400 w-4 h-4" />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Số điện thoại */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Số điện thoại</label>
          <div className="relative">
            <IconPhone className="absolute top-3 left-3 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        {/* Vai trò & nhóm máu */}
        <div className="mb-4 flex gap-4">
          <div className="w-1/2 relative items-center">
            <label className="block font-semibold mb-1">Vai trò</label>
            <IconUserHeart className="absolute top-9 left-3 text-gray-400 w-5 h-5" />
            <select
              name="roleDonation"
              value={formData.roleDonation}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Lựa Chọn</option>
              <option value="Người Hiến Máu">Người Hiến Máu</option>
              <option value="Người Cần Máu">Người Cần Máu</option>
            </select>
          </div>
          <div className="w-1/2 relative">
            <label className="block font-semibold mb-1">Nhóm máu</label>
            <IconDroplet className="absolute top-9 left-3 text-gray-400 w-5 h-5" />
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Lựa Chọn</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
        </div>

        {/* Địa điểm */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Địa điểm hiến máu</label>
          <div className="relative">
            <IconMapPin className="absolute top-3 left-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Nhập địa điểm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-all"
        >
          Gửi đăng ký
        </button>
      </form>
    </div>
  );
}
