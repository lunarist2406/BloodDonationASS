import { useEffect, useState } from "react";
import {
  IconGenderMale,
  IconGenderFemale,
  IconClockHour8,
} from "@tabler/icons-react";
import { Input, message, Select, DatePicker } from "antd";
import { motion } from "framer-motion";
import useUser from "../../../../hooks/User/useUser";
import useCentralService from "../../../../hooks/CentralBlood/useCentralService";
import dayjs from "dayjs";
import useDonateBloodService from "../../../../hooks/RegistrationForm/useDonateBloodService";

const { Option } = Select;

interface FormRegisterBloodProps {
  onSuccess?: () => void;
}

export default function FormRegisterBlood({onSuccess}: FormRegisterBloodProps) {
  const { userData } = useUser();
  const { getAllCentral } = useCentralService();
  const { createDonateBlood } = useDonateBloodService();

  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await getAllCentral(1, 10);
        setCenters(res.data.result);
      } catch (err) {
        console.error("Lỗi khi tải trung tâm:", err);
        message.error("Lỗi tải danh sách trung tâm");
      }
    };
    fetchCenters();
  }, []);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!selectedCenter) {
      return message.error("Vui lòng chọn trung tâm hiến máu");
    }
    if (!selectedDate) {
      return message.error("Vui lòng chọn thời gian hiến máu");
    }
    setLoading(true);
    const payload = {
      date_donate: selectedDate.toISOString(),
      centralBlood_id: selectedCenter,
    };
    console.log("Payload gửi API:", payload);
    try {
      const res = await createDonateBlood(payload);
      console.log("Kết quả trả về:", res);
      message.success("Đăng ký hiến máu thành công!");

       onSuccess?.();
    } catch (err: any) {
      console.error("Lỗi đăng ký hiến máu:", err);
      const errorMessage =
        err?.response?.data?.message || "Đã xảy ra lỗi khi đăng ký hiến máu.";

      message.error("Lỗi đăng ký hiến máu: " + errorMessage);
    } finally {
        setLoading(false);
      }
  };

  const inputStyle =
    "w-full px-3 py-2 border rounded pl-10 bg-white text-gray-800";
  const inputWrapper = "relative mb-4";
  const iconClass = "absolute top-2.5 left-3 text-red-400 w-4 h-4";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-sm">
      <h2 className="text-lg font-bold mb-4 text-red-600 text-center">
        Đăng Ký Hiến Máu
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Họ và tên</label>
          <Input
            type="text"
            name="fullName"
            value={userData?.data.fullname || ""}
            className={inputStyle}
            disabled
          />
        </div>

        <div className="flex gap-4">
          <div className={`${inputWrapper} w-1/2`}>
            <label className="block font-semibold mb-1">Ngày sinh</label>
            <Input
              value={
                userData?.data.dob
                  ? new Date(userData.data.dob).toLocaleDateString("vi-VN")
                  : ""
              }
              className={inputStyle}
              disabled
            />
          </div>
          <div className={`${inputWrapper} w-1/2`}>
            <label className="block font-semibold mb-1">Giới tính</label>
            <Select
              value={userData?.data.gender}
              className="w-full text-sm"
              disabled
            >
              <Option value="male">
                <IconGenderMale className="inline mr-1 text-red-400 w-4 h-4" />{" "}
                Nam
              </Option>
              <Option value="female">
                <IconGenderFemale className="inline mr-1 text-red-400 w-4 h-4" />{" "}
                Nữ
              </Option>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              ></motion.div>
              <Input
                type="tel"
                name="phone"
                value={userData?.data.phone || ""}
                className={inputStyle}
                disabled
              />
            </div>
          </div>

          <div className="w-1/2">
            <label className="block font-semibold mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={userData?.data.email || ""}
              className={inputStyle}
              disabled
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Quận</label>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              ></motion.div>
              <Input
                type="tel"
                name="phone"
                value={userData?.data.location_id.district || ""}
                className={inputStyle}
                disabled
              />
            </div>
          </div>

          <div className="w-1/2">
            <label className="block font-semibold mb-1">Thành Phố </label>
            <Input
              type="email"
              name="email"
              value={userData?.data.location_id.city || ""}
              className={inputStyle}
              disabled
            />
          </div>
        </div>

        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">
            Chọn Trung Tâm Hiến Máu
          </label>
          <Select
            value={selectedCenter}
            onChange={(value) => setSelectedCenter(value)}
            className="w-full"
            placeholder="Chọn địa điểm"
            loading={loading}
            allowClear
          >
            {centers.map((center:any) => (
              <Option
                key={center.centralBlood_id}
                value={center.centralBlood_id}
              >
                {center.centralBlood_name} - {center.centralBlood_address}
              </Option>
            ))}
          </Select>
        </div>

        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">
            Chọn thời gian hiến máu
          </label>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <IconClockHour8 className={iconClass} />
            </motion.div>
            <DatePicker
              className="w-full pl-10"
              showTime
              format="YYYY-MM-DD"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-all mt-4 text-sm cursor-pointer"
          disabled={loading}
          style={{color: "white"}}
        >
          Gửi đăng ký
        </button>
      </form>
    </div>
  );
}
