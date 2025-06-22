import { useEffect, useState } from "react";
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
  Spin,
} from "antd";
import dayjs from "dayjs";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import useHealthService from "../../../hooks/HealthInfor/useHealthService";
import useUser from "../../../hooks/User/useUser";
import useBlood from "../../../hooks/Blood/useBlood";
import isAxiosLikeError from "../../../constraint/typeError";

export default function FormHealth() {
  const [form] = Form.useForm();
  const [healthData, setHealthData] = useState<any>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();
  const { getHealthInfoByUser, createHealthInfo, updateHealthInfo } =
    useHealthService();
  const { blood } = useBlood();

  const fetchHealthInfo = async () => {
    try {
      const data = await getHealthInfoByUser();
      if (data?.data) {
        // map data cho đúng với tên field của form
        const mappedData = {
          blood_id: data.data.blood_id?.blood_id || undefined,
          height: data.data.height,
          weight: data.data.weight_decimal,
          blood_pressure: data.data.blood_pressure,
          medical_history: data.data.medical_history,
          latest_donate: data.data.latest_donate
            ? dayjs(data.data.latest_donate)
            : null,
          status_health: data.data.status_health,
          img_health: data.data.img_health,
        };
        setHealthData(data.data);

        form.setFieldsValue(mappedData);
      }
      console.log("Thông tin sức khỏe:", data);
    } catch (err) {
      console.warn("Không có thông tin sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthInfo();
  }, []);

  const handleUpload = (info: UploadChangeParam) => {
    const file = info.file.originFileObj as RcFile;
    if (file) {
      setFileUpload(file);
      const url = URL.createObjectURL(file);
      form.setFieldValue("img_health", url);
    }
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("user_id", userData?.data?.user_id || "");
    formData.append("blood_id", values.blood_id || "");
    formData.append("height", values.height);
    formData.append("weight_decimal", values.weight);
    formData.append("blood_pressure", values.blood_pressure);
    formData.append("medical_history", values.medical_history || "");
    formData.append(
      "latest_donate",
      values.latest_donate ? dayjs(values.latest_donate).toISOString() : ""
    );
    formData.append("status_health", values.status_health || "");
    if (fileUpload) formData.append("img_health", fileUpload);

    try {
      if (healthData?.health_id) {
        await updateHealthInfo(healthData.health_id, formData);
        message.success("Cập nhật thông tin thành công");
      } else {
        await createHealthInfo(formData);
        message.success("Tạo mới thông tin thành công");
      }
    } catch (error) {
      if (isAxiosLikeError(error)) {
        const msg = error.response?.data?.message;
        if (Array.isArray(msg)) {
          message.error(msg.join(" | "));
        } else if (typeof msg === "string") {
          message.error(msg);
        }
      } else {
        message.error("Lỗi không xác định");
      }
    }
  };

  const inputClass = "flex items-center gap-2 mb-4";

  if (loading) {
    return <Spin fullscreen />;
  }

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

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          fullName: userData?.data?.fullname || "",
        }}
      >
        <Form.Item
          label={
            <span className={inputClass}>
              <IconUser size={20} /> Tên người điền
            </span>
          }
        >
          <Input disabled value={userData?.data?.fullname} />
        </Form.Item>

        <div className="flex gap-4 mb-4">
          <Form.Item
            name="height"
            label={
              <span className={inputClass}>
                <IconLineHeight size={20} /> Chiều cao (cm)
              </span>
            }
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true }]}
          >
            <Input type="number" min={140} max={250} />
          </Form.Item>

          <Form.Item
            name="weight"
            label={
              <span className={inputClass}>
                <IconWeight size={20} /> Cân nặng (kg)
              </span>
            }
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true }]}
          >
            <Input type="number" min={40} max={150} />
          </Form.Item>
        </div>

        <div className="flex gap-4 mb-4">
          <Form.Item
            name="blood_id"
            label={
              <span className={inputClass}>
                <IconFilterHeart size={20} /> Nhóm máu
              </span>
            }
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn nhóm máu"
              options={
                blood?.data?.result?.map((b) => ({
                  label: `${b.blood_type_id.blood_name} (${b.rh_id.blood_Rh})`,
                  value: b.blood_id,
                })) || []
              }
            />
          </Form.Item>

          <Form.Item
            name="blood_pressure"
            label={
              <span className={inputClass}>
                <IconHeartbeat size={20} /> Huyết áp
              </span>
            }
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="VD: 120" />
          </Form.Item>
        </div>

        <Form.Item
          name="medical_history"
          label={
            <span className={inputClass}>
              <IconHeartRateMonitor size={20} /> Tiền sử bệnh
            </span>
          }
        >
          <Select
            mode="multiple"
            placeholder="Chọn bệnh lý"
            options={[
              { label: "Tiểu đường", value: "Tiểu đường" },
              { label: "Tim mạch", value: "Tim mạch" },
              { label: "Hô hấp", value: "Hô hấp" },
              { label: "Khác", value: "Khác" },
            ]}
          />
        </Form.Item>

        <div className="flex gap-4 mb-4">
          <Form.Item
            name="latest_donate"
            label={
              <span className={inputClass}>
                <IconCalendar size={20} /> Lần hiến máu gần nhất
              </span>
            }
            style={{ flex: "1 1 50%" }}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="status_health"
            label={
              <span className={inputClass}>
                <IconHeartRateMonitor size={20} /> Tình trạng hiện tại
              </span>
            }
            style={{ flex: "1 1 50%" }}
          >
            <Select
              placeholder="Chọn tình trạng"
              options={[
                { label: "Tốt", value: "Tốt" },
                { label: "Trung bình", value: "Trung bình" },
                { label: "Yếu", value: "Yếu" },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <span className={inputClass}>
              <IconUpload size={20} /> Ảnh giấy khám sức khỏe
            </span>
          }
        >
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
          >
            <Button icon={<IconUpload />}>Tải ảnh</Button>
          </Upload>
          {form.getFieldValue("img_health") && (
            <Image
              src={form.getFieldValue("img_health")}
              alt="Ảnh giấy khám sức khỏe"
              style={{ marginTop: 8 }}
              width={150}
            />
          )}
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large">
          {healthData ? "Cập nhật thông tin" : "Tạo mới thông tin"}
        </Button>
      </Form>
    </motion.div>
  );
}
