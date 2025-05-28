import { motion } from "framer-motion";
import {
  IconWeight,
  IconHeartbeat,
  IconHeartRateMonitor,
  IconPill,
  IconCalendar,
  IconId,
  IconLineHeight,
  IconFilterHeart,
  IconUser,
  IconUpload,
} from "@tabler/icons-react";
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Image,
  message,
  Button,
  Select,
} from "antd";
import dayjs from "dayjs";
import type {
  RegisterBlood,
  StatusHealth,
} from "../../../../hooks/useRegisterBlood";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
// import { form } from "framer-motion/client";

interface FormHealthProps {
  statusHealth: StatusHealth;
  setStatusHealth: React.Dispatch<React.SetStateAction<StatusHealth>>;
}

export default function FormHealth({ formData, setFormData }: FormHealthProps) {
  console.log("📌 Current formData:", formData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`📝 Input Changed: ${name} = ${value}`);
    console.log("📋 Current formData before change:", formData);
    setFormData({
      height: formData.statusHealth?.height || "",
      weight: formData.statusHealth?.weight || "",
      bloodPressure: formData.statusHealth?.bloodPressure || "",
      medicalHistory: formData.statusHealth?.medicalHistory || "",
      currentCondition: formData.statusHealth?.currentCondition || "",
      medication: formData.statusHealth?.medication || "",
      lastDonationDate: formData.statusHealth?.lastDonationDate || "",
      //   cccd: formData.statusHealth?.cccd || "",
      imgHealth: formData.statusHealth?.imgHealth || "",
    });
  };

  const handleUpload = (
    info: UploadChangeParam,
    field: "cccd" | "imgHealth"
  ) => {
    const file = info.file.originFileObj as RcFile;
    console.log("📷 File Upload:", file);

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [field]: fileURL,
      }));
      message.success("Tải ảnh thành công");
    }
  };

  const inputClass = "flex items-center gap-2 mb-4";

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Thông Tin Sức Khỏe
      </h2>

      <Form layout="vertical">
        {/* Tên người điền */}
        <Form.Item
          label={
            <span className={inputClass}>
              <IconUser size={20} /> Tên người điền
            </span>
          }
          rules={[{ required: true, message: "Vui lòng nhập tên người điền!" }]}
        >
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập tên người điền"
          />
        </Form.Item>

        {/* Chiều cao - Cân nặng - Huyết áp cùng hàng */}
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            label={
              <span className={inputClass}>
                <IconLineHeight size={20} /> Chiều cao
              </span>
            }
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Nhập chiều cao!" }]}
          >
            <Input
              type="number"
              name="height"
              value={formData.statusHealth?.height}
              onChange={handleChange}
              placeholder="cm"
              min={50}
              max={250}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className={inputClass}>
                <IconWeight size={20} /> Cân nặng
              </span>
            }
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Nhập cân nặng!" }]}
          >
            <Input
              type="number"
              name="weight"
              value={formData.statusHealth?.weight}
              onChange={(value) => handleChange(value)}
              placeholder="kg"
              min={30}
              max={200}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className={inputClass}>
                <IconHeartbeat size={20} /> Huyết áp
              </span>
            }
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Nhập huyết áp!" }]}
          >
            <Input
              type="number"
              name="bloodPressure"
              value={formData.statusHealth?.bloodPressure}
              onChange={handleChange}
              placeholder="VD: 120/80"
              min={80}
              max={120}
            />
          </Form.Item>
        </div>

        {/* Tiền sử bệnh: chọn nhiều */}
        <Form.Item
          label={
            <span className={inputClass}>
              <IconHeartRateMonitor size={20} /> Tiền sử bệnh
            </span>
          }
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn các bệnh lý đã mắc"
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                medicalHistory: value.join(", "),
              }))
            }
            options={[
              { label: "Tiểu đường", value: "Tiểu đường" },
              { label: "Tim mạch", value: "Tim mạch" },
              { label: "Hô hấp", value: "Hô hấp" },
              { label: "Khác", value: "Khác" },
            ]}
          />
        </Form.Item>

        {/* Tình trạng hiện tại: chọn 1 */}

        {/* Thuốc đang dùng */}
        <Form.Item
          label={
            <span className={inputClass}>
              <IconPill size={20} /> Thuốc đang dùng
            </span>
          }
        >
          <Input
            name="medication"
            value={formData.statusHealth?.medication}
            onChange={handleChange}
            placeholder="VD: Paracetamol"
          />
        </Form.Item>
        <div className="flex gap-4">
          <div className="w-1/2 relative">
            <Form.Item
              label={
                <span className={inputClass}>
                  <IconCalendar size={20} /> Ngày hiến máu gần nhất
                </span>
              }
            >
              <DatePicker
                style={{ width: "100%" }}
                value={
                  formData.statusHealth?.lastDonationDate
                    ? dayjs(formData.statusHealth.lastDonationDate)
                    : null
                }
              />
            </Form.Item>
          </div>
          <div className="w-1/2 relative">
            <Form.Item
              label={
                <span className={inputClass}>
                  <IconHeartRateMonitor size={20} /> Tình trạng hiện tại
                </span>
              }
            >
              <Select
                value={formData.statusHealth?.currentCondition}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, currentCondition: value }))
                }
                options={[
                  { label: "Tốt", value: "Tốt" },
                  { label: "Bình thường", value: "Bình thường" },
                  { label: "Không khỏe", value: "Không khỏe" },
                ]}
                placeholder="Chọn tình trạng"
              />
            </Form.Item>
          </div>
        </div>

        {/* Ảnh CCCD
          <Form.Item
            label={
              <span className={inputClass}>
                <IconId size={20} /> Ảnh CCCD
              </span>
            }
          >
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => handleUpload(info, "cccd")}
            >
              <Button icon={<IconUpload />}>Tải ảnh lên</Button>
            </Upload>
            {formData.statusHealth?.cccd && (
              <Image
                src={formData.statusHealth?.cccd}
                alt="Ảnh CCCD"
                height={150}
                className="mt-2 rounded-lg shadow"
              />
            )}
          </Form.Item> */}

        {/* Giấy khám sức khỏe */}
        <Form.Item
          label={
            <span className={inputClass}>
              <IconFilterHeart size={20} /> Giấy khám sức khỏe
            </span>
          }
        >
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={(info) => handleUpload(info, "imgHealth")}
          >
            <Button icon={<IconUpload />}>Tải ảnh lên</Button>
          </Upload>
          {formData.statusHealth?.imgHealth && (
            <Image
              src={formData.statusHealth?.imgHealth}
              alt="Giấy khám sức khỏe"
              height={150}
              className="mt-2 rounded-lg shadow"
            />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large">
          Gửi thông tin
        </Button>
      </Form>
    </motion.div>
  );
}
