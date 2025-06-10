import { motion } from "framer-motion";
import {
  IconWeight,
  IconHeartbeat,
  IconHeartRateMonitor,
  IconCalendar,
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
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import useHealthService from "../../../../hooks/HealthInfor/useHealthService";
import useFormHealth from "../../../../hooks/HealthInfor/useFormHealth";
import useUser from "../../../../hooks/User/useUser";
import useBlood, {
  type DataBlood,
  type ResultBlood,
} from "../../../../hooks/Blood/useBlood";
// import { form } from "framer-motion/client";

export default function FormHealth() {
  const { createHealthInfo } = useHealthService();
  const { userData } = useUser();
  console.log("user:", userData);
  const { formHealth, setFormHealth } = useFormHealth();
  const { blood } = useBlood();
  console.log("Blood list:", blood);
  console.log("Health Form :", formHealth);
  const onFinish = async () => {
    try {
      const payload = {
        user_id: formHealth.user_id,
        blood_id: formHealth.blood_id || "",
        height: formHealth.height,
        weight_decimal: formHealth.weight,
        blood_pressure: formHealth.blood_pressure,
        medical_history: formHealth.medical_history,
        latest_donate: formHealth.latest_donate,
        status_health: formHealth.status_health,
        img_health: formHealth.img_health || "",
      };
      console.log("📤 Sending payload:", payload);
      await createHealthInfo(payload);
      message.success("Health information submitted successfully!");
    } catch (error: unknown ) {
      // Check có phải lỗi từ Axios không
      if (error.response) {
        console.error("🚨 Lỗi khi tạo mới thông tin sức khỏe:", error);

        // Lỗi chi tiết từ backend
        const messages = error.response.data?.message;
        if (Array.isArray(messages)) {
          console.error("🧾 Danh sách lỗi:", messages);
          throw new Error(messages.join(" | "));
        } else if (typeof messages === "string") {
          throw new Error(messages);
        }
        message.error(messages)
      }

      // Nếu không phải lỗi từ response (timeout, network,...)
      throw new Error(
        "Đã có lỗi không xác định xảy ra khi tạo thông tin sức khỏe."
      );
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Xử lý ép kiểu number cho các field cần thiết
    const parsedValue =
      name === "height" || name === "weight" || name === "blood_pressure"
        ? Number(value)
        : value;

    setFormHealth((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleUpload = (
    info: UploadChangeParam,
    field: "cccd" | "imgHealth"
  ) => {
    const file = info.file.originFileObj as RcFile;
    console.log("📷 File Upload:", file);

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormHealth((prev) => ({
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

      <Form layout="vertical" onFinish={onFinish}>
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
            value={userData?.data?.fullname}
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
              value={formHealth.height}
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
              value={formHealth.weight}
              onChange={handleChange}
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
              name="blood_pressure"
              value={formHealth.blood_pressure}
              onChange={handleChange}
              placeholder="VD: 120/80"
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
              setFormHealth((prev) => ({
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
        {/* Nhóm máu */}
        <Form.Item
          label={
            <span className={inputClass}>
              <IconFilterHeart size={20} /> Nhóm máu
            </span>
          }
          rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
        >
          <Select
            placeholder="Chọn nhóm máu"
            value={formHealth.blood_id}
            onChange={(value) =>
              setFormHealth((prev) => ({
                ...prev,
                blood_id: value,
              }))
            }
            options={
              blood?.data?.result
                ?.filter((b) => b.blood_type_id && b.rh_id)
                .map((b) => ({
                  label: `${b.blood_type_id.blood_name} (${b.rh_id.blood_Rh})`,
                  value: b.blood_id,
                })) || []
            }
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
                  formHealth.latest_donate
                    ? dayjs(formHealth.latest_donate)
                    : null
                }
                onChange={(date, dateString) =>
                  setFormHealth((prev) => ({
                    ...prev,
                    latest_donate: dateString,
                  }))
                }
                format="YYYY-MM-DD"
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
                value={formHealth.status_health}
                onChange={(value) =>
                  setFormHealth((prev) => ({
                    ...prev,
                    status_health: value,
                  }))
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
          {formHealth.img_health && (
            <Image
              src={formHealth.img_health}
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
