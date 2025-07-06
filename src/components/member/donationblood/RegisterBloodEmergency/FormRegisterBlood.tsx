import  { useEffect, useState } from "react";
import {
  IconDroplet,
  IconCalendar,
  IconNumbers,
  IconListDetails,
  IconGenderMale,
  IconGenderFemale,
} from "@tabler/icons-react";
import { Input, Select, DatePicker, message } from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import useCentralService from "../../../../hooks/CentralBlood/useCentralService";
import useReceiverService from "../../../../hooks/Receiver/useReceiverService";
import useUser from "../../../../hooks/User/useUser";
import useBloodService from "../../../../hooks/Blood/useBloodService";

const { Option } = Select;
interface Center {
  centralBlood_id: string;
  centralBlood_name: string;
  centralBlood_address: string;
}
interface FormRegisterReceiveEmergencyProps {
  onSuccess?: () => void;
}

export default function FormRegisterReceiveEmergency({ onSuccess }: FormRegisterReceiveEmergencyProps) {
  const { userData } = useUser();
  const { getAllCentral } = useCentralService();
  const { createReceiver } = useReceiverService();
  const { getAllBloods } = useBloodService();

    const [formData, setFormData] = useState({
      blood_id: "",
      date_receiver: dayjs(),
      ml: "",
      unit: "",
      centralBlood_id: "",
      type: "", // 👈 thêm type
    });


const [centers, setCenters] = useState<Center[]>([]);
  const [bloods, setBloods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, bloodsRes] = await Promise.all([
          getAllCentral(1, 100),
          getAllBloods(1, 100),
        ]);
        setCenters(centersRes.data.result);
        setBloods(bloodsRes.data.result);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        message.error("Không thể tải danh sách trung tâm hoặc nhóm máu");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSelectChange = (value:any, field:any) => {
  setFormData((prev) => ({
    ...prev,
    [field]: field === "centralBlood_id" ? String(value) : value,
  }));
};


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const { blood_id, date_receiver, ml, unit, centralBlood_id } = formData;

    if (!blood_id || !date_receiver || !ml || !unit || !centralBlood_id) {
      return message.error("Vui lòng điền đầy đủ thông tin.");
    }

const payload = {
  blood_id,
  date_receiver: date_receiver.toISOString(),
  ml: parseInt(ml),
  unit: parseInt(unit),
  type: formData.type,
  centralBlood_id: String(centralBlood_id), // ép string ở đây luôn nếu muốn chắc ăn
};


    try {
      setLoading(true);
      await createReceiver(payload);
      message.success("Đăng ký nhận máu khẩn cấp thành công!");
      setFormData({
      blood_id: "",
      date_receiver: dayjs(),
      ml: "",
      unit: "",
      centralBlood_id: "",
      type: ""
      });
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      message.error("Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-3 py-2 border rounded pl-10 bg-white text-gray-800 text-sm";
  const inputWrapper = "relative mb-4";
  const iconMotion = {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };
  const iconClass = "absolute top-2.5 left-3 text-red-400 w-4 h-4";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-sm">
      <h2 className="text-lg font-bold mb-4 text-red-600 text-center">
        Đăng Ký Nhận Máu Khẩn Cấp
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Thông tin người dùng */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Họ và tên</label>
          <Input
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

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <Input
              value={userData?.data.phone || ""}
              className={inputStyle}
              disabled
            />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Email</label>
            <Input
              value={userData?.data.email || ""}
              className={inputStyle}
              disabled
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Số nhà</label>
            <Input
              value={userData?.data.location_id?.house_number || ""}
              className={inputStyle}
              disabled
            />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Đường</label>
            <Input
              value={userData?.data.location_id?.road || ""}
              className={inputStyle}
              disabled
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Quận</label>
            <Input
              value={userData?.data.location_id?.district || ""}
              className={inputStyle}
              disabled
            />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Thành phố</label>
            <Input
              value={userData?.data.location_id?.city || ""}
              className={inputStyle}
              disabled
            />
          </div>
        </div>

          {/* Mức độ ưu tiên và Thời gian nhận */}
          <div className="flex gap-4 mt-4">
            <div className="w-1/2">
              <label className="block font-semibold mb-1">Mức độ ưu tiên</label>
              <Select
                value={formData.type || undefined}
                onChange={(value) => handleSelectChange(value, "type")}
                className="w-full"
                placeholder="Chọn mức độ"
                allowClear
              >
                <Option value="DEFAULT">
                  <span className="text-green-600 font-semibold">Bình Thường</span>
                </Option>
                <Option value="EMERGENCY">
                  <span className="text-red-600 font-semibold">Khẩn Cấp</span>
                </Option>
              </Select>
            </div>

            <div className="w-1/2">
              <label className="block font-semibold mb-1">Thời gian nhận máu</label>
              <div className="relative">
                <motion.div {...iconMotion}>
                  <IconCalendar className={iconClass} />
                </motion.div>
                <DatePicker
                  className="w-full pl-10"
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Chọn ngày và giờ"
                  value={formData.date_receiver}
                  onChange={(date) => handleSelectChange(date, "date_receiver")}
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
              </div>
            </div>
          </div>


        {/* Nhóm máu, Số lượng máu và Số đơn vị */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="block font-semibold mb-1">Nhóm máu</label>
            <Select
              value={formData.blood_id || undefined}
              onChange={(value) => handleSelectChange(value, "blood_id")}
              className="w-full"
              placeholder="Chọn nhóm máu"
              allowClear
            >
              {bloods.map((blood:any) => (
                <Option key={blood.blood_id} value={blood.blood_id}>
                  {blood.blood_type_id.blood_name} ({blood.rh_id.blood_Rh})
                </Option>
              ))}
            </Select>
          </div>

          <div className="w-1/3">
            <label className="block font-semibold mb-1">Số lượng máu (ml)</label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconListDetails className={iconClass} />
              </motion.div>
              <Input
                type="number"
                name="ml"
                value={formData.ml}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Nhập số lượng (ml)"
                min={150}
              />
            </div>
          </div>

          <div className="w-1/3">
            <label className="block font-semibold mb-1">Số đơn vị</label>
            <div className="relative">
              <motion.div {...iconMotion}>
                <IconNumbers className={iconClass} />
              </motion.div>
              <Input
                type="number"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Nhập số đơn vị"
                min={1}
              />
            </div>
          </div>
        </div>


        {/* Trung tâm */}
        <div className={inputWrapper}>
  <label className="block font-semibold mb-1">Chọn Trung Tâm Hiến Máu</label>
  <Select
    value={selectedCenter}
    onChange={(value) => setSelectedCenter(value)}
    className="w-full"
    placeholder="Chọn trung tâm"
    loading={loading}
    allowClear
  >
    {centers.map((center: any) => (
      <Option key={center.centralBlood_id} value={center.centralBlood_id}>
        {center.centralBlood_name} - {center.centralBlood_address}
      </Option>
    ))}
  </Select>
</div>


        <div className="flex justify-center">
          <button
            type="submit"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-all mt-4 text-sm cursor-pointer"
            disabled={loading}
            style={{ color: "white" }}
          >
            <IconDroplet className="w-4 h-4" />
            Gửi Đăng Ký
          </button>
        </div>
      </form>
    </div>
  );
}
