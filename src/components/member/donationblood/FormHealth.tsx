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

export default function FormHealth() {
  const [form] = Form.useForm();
  const [healthData, setHealthData] = useState<any>(null);
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [loading, setLoading] = useState(true);

  const { userData } = useUser();
  const { getHealthInfoByUser, createHealthInfo, updateHealthInfo } =
    useHealthService();
  const { blood } = useBlood();

  // Lấy data sức khỏe của user
  const fetchHealthInfo = async () => {
    setLoading(true);
    try {
      const res = await getHealthInfoByUser();
      if (res?.data) {
        const mappedData = {
          blood_id: res.data.blood_id?.blood_id || undefined,
          height: res.data.height,
          weight: res.data.weight_decimal,
          blood_pressure: res.data.blood_pressure,
          medical_history: res.data.medical_history,
          latest_donate: res.data.latest_donate ? dayjs(res.data.latest_donate) : null,
          status_health: res.data.status_health,
          img_health: res.data.img_health ? [res.data.img_health] : [],
        };
        setHealthData(res.data);
        form.setFieldsValue(mappedData);
      }
    } catch {
      message.warning("Chưa có thông tin sức khỏe");
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthInfo();
  }, []);

  // Xử lý upload ảnh
  const handleUpload = (info: UploadChangeParam) => {
    const files = info.fileList
      .map((file) => file.originFileObj)
      .filter(Boolean) as RcFile[];
    setFileList(files);

    // Preview ảnh trong form
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    form.setFieldValue("img_health", previewURLs);
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (index: number) => {
    const currentImages = form.getFieldValue("img_health") || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    form.setFieldValue("img_health", newImages);

    // Nếu đang xóa ảnh mới upload
    if (index < fileList.length) {
      const newFileList = [...fileList];
      newFileList.splice(index, 1);
      setFileList(newFileList);
    }
  };

  // Tạo mới
  const onCreateFinish = async (values: any) => {
    const data = {
      ...values,
      user_id: userData?.data?.user_id || "",
      weight_decimal: values.weight,
      latest_donate: values.latest_donate
        ? dayjs(values.latest_donate).toISOString()
        : "",
      img_health: fileList?.[0] || null,
      medical_history: Array.isArray(values.medical_history)
    ? values.medical_history.join(",")
    : values.medical_history,
    };

    try {
      await createHealthInfo(data);
      message.success("Tạo mới thông tin thành công");
      fetchHealthInfo();
    } catch (error) {
      message.error("Tạo mới thất bại");
    }
  };

  // Cập nhật
  const onUpdateFinish = async (values: any) => {
    const data = {
      ...values,
      user_id: userData?.data?.user_id || "",
      weight_decimal: values.weight,
      latest_donate: values.latest_donate
        ? dayjs(values.latest_donate).toISOString()
        : "",
      img_health: fileList?.[0] || null,
      medical_history: Array.isArray(values.medical_history)
    ? values.medical_history.join(",")
    : values.medical_history,
    };

    try {
      await updateHealthInfo(data);
      message.success("Cập nhật thông tin thành công");
      fetchHealthInfo();
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  if (loading) {
    return (
      <Spin
        size="large"
        tip="Đang tải..."
        className="w-full h-60 flex justify-center items-center"
      />
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
        Thông Tin Sức Khỏe
      </h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={healthData ? onUpdateFinish : onCreateFinish}
        initialValues={{
          fullName: userData?.data?.fullname || "",
        }}
      >
        <Form.Item label={<span className="flex items-center gap-2 mb-2"><IconUser size={20} /> Tên người điền</span>}>
          <Input disabled value={userData?.data?.fullname} />
        </Form.Item>

        <div className="flex gap-2 mb-3">
          <Form.Item
            name="height"
            label={<span className="flex items-center gap-2 mb-2"><IconLineHeight size={20} /> Chiều cao (cm)</span>}
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true, message: "Chiều cao là bắt buộc" }]}
          >
            <Input type="number" min={140} max={250} />
          </Form.Item>

          <Form.Item
            name="weight"
            label={<span className="flex items-center gap-2 mb-2"><IconWeight size={20} /> Cân nặng (kg)</span>}
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true, message: "Cân nặng là bắt buộc" }]}
          >
            <Input type="number" min={40} max={150} />
          </Form.Item>
        </div>

        <div className="flex gap-2 mb-3">
          <Form.Item
            name="blood_id"
            label={<span className="flex items-center gap-2 mb-2"><IconFilterHeart size={20} /> Nhóm máu</span>}
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true, message: "Nhóm máu là bắt buộc" }]}
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
            label={<span className="flex items-center gap-2 mb-2"><IconHeartbeat size={20} /> Huyết áp</span>}
            style={{ flex: "1 1 50%" }}
            rules={[{ required: true, message: "Huyết áp là bắt buộc" }]}
          >
            <Input type="number" placeholder="VD: 120" />
          </Form.Item>
        </div>

        <Form.Item
          name="medical_history"
          label={<span className="flex items-center gap-2 mb-2"><IconHeartRateMonitor size={20} /> Tiền sử bệnh</span>}
        >
          <Select
            mode="multiple"
            placeholder="Chọn bệnh lý"
            options={[
              { label: "Tiểu đường", value: "Tiểu đường" },
              { label: "Tim mạch", value: "Tim mạch" },
              { label: "Hô hấp", value: "Hô hấp" },
              { label: "Khác", value: "Khác" },
              { label: "Không có tiền sử bệnh", value: "Không có tiền sử bệnh" },
            ]}
          />
        </Form.Item>

        <div className="flex gap-2 mb-3">
          <Form.Item
            name="latest_donate"
            label={<span className="flex items-center gap-2 mb-2"><IconCalendar size={20} /> Lần hiến máu gần nhất</span>}
            style={{ flex: "1 1 50%" }}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="status_health"
            label={<span className="flex items-center gap-2 mb-2"><IconHeartRateMonitor size={20} /> Tình trạng hiện tại</span>}
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
          label={<span className="flex items-center gap-2 mb-2"><IconUpload size={20} /> Ảnh giấy khám sức khỏe</span>}
        >
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
            multiple
          >
            <Button icon={<IconUpload />}>Tải ảnh</Button>
          </Upload>

          <div
            style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {Array.isArray(form.getFieldValue("img_health")) &&
              form.getFieldValue("img_health").filter(Boolean).map((url: string, idx: number) => (
                <div key={idx} className="relative w-[120px] h-[120px]">
                  <Image
                    src={url}
                    alt={`Ảnh ${idx + 1}`}
                    style={{ objectFit: "cover" }}
                    width={120}
                    height={120}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block>
          {healthData ? "Cập nhật thông tin" : "Tạo mới thông tin"}
        </Button>
      </Form>
    </motion.div>
  );
}
