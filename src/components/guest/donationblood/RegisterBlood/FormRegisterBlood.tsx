import {
  IconUser,
  IconCalendar,
  IconPhone,
  IconMapPin,
  IconDroplet,
  IconUserHeart,
  IconGenderMale,
  IconGenderFemale,
  IconMail,
  IconNumbers,
  IconBuildingHospital,
  IconListDetails,
} from "@tabler/icons-react";
import { Input, notification, Select } from "antd";
import { Option } from "antd/es/mentions";
import { motion } from "framer-motion";

export default function FormRegisterBlood({
  formData,
  setFormData,
  setWaitingList,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📋 Form Submitted:", formData);
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
      fullName: formData.fullName,
      dob: formData.dob,
      phone: formData.phone,
      roleDonation: formData.roleDonation,
      bloodType: formData.bloodType,
      location: formData.location,
      statusHealth: {
        height: "",
        weight: "",
        bloodPressure: "",
        medicalHistory: "",
        currentCondition: "",
        medication: "",
        lastDonationDate: "",
        cccd: "",
        imgHealth: "",
      },
      status: "",
      hospital: "",
    });
  };
  const handleSelectChange = (value, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const inputStyle =
    "w-full px-3 py-2 border rounded pl-10 bg-white text-gray-800";
  const inputWrapper = "relative mb-4";
  const iconMotion = {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };
  const iconClass = "absolute top-2.5 left-3 text-red-400 w-4 h-4";
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-sm">
      <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center justify-center gap-2">
        Đăng Ký Nhóm Máu
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Họ và tên */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Họ và tên</label>
          <div className="relative">
            <motion.div {...iconMotion}>
              <IconUser className={iconClass} />
            </motion.div>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Nhập họ và tên"
            />
          </div>
        </div>

        {/* Ngày sinh và Giới tính */}
        <div className="flex gap-4">
          <div className={inputWrapper + " w-1/2"}>
            <label className="block font-semibold mb-1">Ngày sinh</label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconCalendar className={iconClass} />
              </motion.div>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>

          <div className={inputWrapper + " w-1/2"}>
            <label className="block font-semibold mb-1">Giới tính</label>

            <Select
              value={formData.gender}
              onChange={(value) => handleSelectChange(value, "gender")}
              className="w-full text-sm pl-10"
              styles={{ popup: { root: { fontSize: "12px" } } }}
              placeholder="Lựa chọn"
            >
              <Option value="male">
                <IconGenderMale className="inline mr-1 text-red-400 w-4 h-4" />
                Nam
              </Option>
              <Option value="female">
                <IconGenderFemale className="inline mr-1 text-red-400 w-4 h-4" />
                Nữ
              </Option>
            </Select>
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          {/* Số điện thoại */}
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconPhone className={iconClass} />
              </motion.div>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Nhập số điện thoại liện hệ"
              />
            </div>
          </div>

          {/* Email */}
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Email</label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconMail className={iconClass} />
              </motion.div>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Nhập email liên hệ"
              />
            </div>
          </div>
        </div>

        {/* Vai trò & thời gian cần máu */}
        <div className="mb-4 flex gap-4">
          <div className="w-1/2 relative">
            <label className="block font-semibold mb-1">Vai trò</label>
            <Select
              value={formData.roleDonation}
              onChange={(value) => handleSelectChange(value, "roleDonation")}
              className="w-full text-sm pl-10"
              placeholder="Lựa chọn"
              suffixIcon={<IconUserHeart className="text-red-400 w-4 h-4 " />}
            >
              <Option value="">Chọn Vai Trò</Option>

              <Option value="Người Hiến Máu">
                <span className="flex items-center gap-1">
                  <IconUserHeart className="text-red-400 w-4 h-4 " />
                  Người Hiến Máu
                </span>
              </Option>
              <Option value="Người Cần Máu">
                <span className="flex items-center gap-1">
                  <IconUserHeart className="text-red-400 w-4 h-4 " />
                  Người Cần Cần Máu
                </span>
              </Option>
            </Select>
          </div>

          <div className="w-1/2 relative">
            <label className="block font-semibold mb-1">
              Thời gian thực hiện
            </label>
            <motion.div {...iconMotion}></motion.div>
            <Input
              type="datetime-local"
              name="neededTime"
              value={formData.neededTime}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Giờ"
            />
          </div>
        </div>

        {/* Nhóm máu & số lượng */}
        <div className="mb-4 flex gap-4">
          <div className="w-3/8 relative">
            <label className="block font-semibold mb-1 ">Nhóm máu</label>
            <Select
              value={formData.bloodType}
              onChange={(value) => handleSelectChange(value, "bloodType")}
              className="w-full text-sm pl-10"
              placeholder="Chọn nhóm máu"
              suffixIcon={<IconDroplet className="text-red-400 w-4 h-4" />}
            >
              <Option value="">Chọn nhóm máu</Option>

              <Option value="A">
                <span className="flex items-center gap-1">
                  <IconDroplet className="text-red-400 w-4 h-4" />
                  Máu (A)
                </span>
              </Option>
              <Option value="B">
                <span className="flex items-center gap-1">
                  <IconDroplet className="text-red-400 w-4 h-4" />
                  Máu (B)
                </span>
              </Option>
              <Option value="AB">
                <span className="flex items-center gap-1">
                  <IconDroplet className="text-red-400 w-4 h-4" />
                  Máu (AB)
                </span>
              </Option>
              <Option value="O">
                <span className="flex items-center gap-1">
                  <IconDroplet className="text-red-400 w-4 h-4" />
                  Máu (O)
                </span>
              </Option>
            </Select>
          </div>
          <div className="w-3/8 relative">
            <label className="block font-semibold mb-1 ">Loại Rh</label>
            <Select
              value={formData.rh}
              onChange={(value) => handleSelectChange(value, "bloodType")}
              className="w-full text-sm pl-10"
              placeholder="Chọn nhóm máu"
              suffixIcon={<IconDroplet className="text-red-400 w-4 h-4" />}
            >
              <Option value="">Chọn Rh</Option>

              <Option value="Rh+">
                <span className="flex items-center gap-1">
                  <IconDroplet className="text-red-400 w-4 h-4" />
                  RH (+)
                </span>
              </Option>
              <Option value="Rh-">
                <span className="flex items-center gap-1">
                  <IconDroplet className="text-red-400 w-4 h-4" />
                  RH (-)
                </span>
              </Option>
            </Select>
          </div>
          <div className="w-2/8 relative">
            <label className="block font-semibold mb-1">Số lượng (ml)</label>

            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={inputStyle}
              placeholder="ml"
              min="150"
              suffix={<IconNumbers className="text-red-400 w-4 h-4" />}
            />
          </div>
        </div>

        {/* Địa điểm hiến máu */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Địa điểm</label>
          <div className="relative">
            <motion.div {...iconMotion}>
              <IconMapPin className={iconClass} />
            </motion.div>
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

        {/* Bệnh viện */}
        <div className="flex gap-4">
          {/* Bệnh viện */}
          <div className="w-5/8">
            <label className="block font-semibold mb-1">Bệnh viện</label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconBuildingHospital className={iconClass} />
              </motion.div>
              <Input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Tên bệnh viện"
              />
            </div>
          </div>

          {/* Khoa */}
          <div className="w-3/8">
            <label className="block font-semibold mb-1">
              Mức độ thực hiện{" "}
            </label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconListDetails className={iconClass} />
              </motion.div>
              <Select
                value={formData.department}
                onChange={(value) => handleSelectChange(value, "department")}
                className="w-full"
                placeholder="Chọn mức độ"
              >
                <Option value="1">Gấp</Option>
                <Option value="2">Thông thường</Option>
                <Option value="3">Dự phòng</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-all mt-4 text-sm"
        >
          Gửi đăng ký
        </button>
      </form>
    </div>
  );
}
