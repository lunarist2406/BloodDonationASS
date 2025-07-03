// FormCreate.tsx
import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import {
  IconListCheck,
  IconDroplet,
  IconCalendar,
  IconHourglass,
  IconGauge,
  IconNumbers,
  IconBuildingBank,
  IconCircleX,
  IconFilePlus,
  IconEdit,
} from "@tabler/icons-react";
import dayjs from "dayjs";

const { Option } = Select;

interface BloodType {
  blood_id: string | number;
  blood_type_id: { blood_name: string };
  rh_id: { blood_Rh: string };
}

interface CentralType {
  centralBlood_id: string | number;
  centralBlood_name: string;
}

interface StorageType {
  date?: string;
  expired_date?: string;
  donate_id?: { donate_id: string | number };
  centralBlood_id?: { centralBlood_id: string | number };
  blood_id?: { blood_id: string | number } | string | number;
  [key: string]: any;
}

interface FormCreateProps {
  editingStorage?: StorageType | null;
  onSubmit: (payload: any) => void;
  bloods: BloodType[];
  centrals: CentralType[];
  onCancelEdit?: () => void;
}

export default function FormCreate({
  editingStorage,
  onSubmit,
  bloods,
  centrals,
  onCancelEdit,
}: FormCreateProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingStorage) {
      form.setFieldsValue({
        ...editingStorage,
        date: editingStorage.date ? dayjs(editingStorage.date) : null,
        expired_date: editingStorage.expired_date
          ? dayjs(editingStorage.expired_date)
          : null,
        donate_id: editingStorage.donate_id?.donate_id,
        centralBlood_id: editingStorage.centralBlood_id?.centralBlood_id,
        blood_id:
          typeof editingStorage.blood_id === "object"
            ? editingStorage.blood_id.blood_id
            : editingStorage.blood_id,
      });
    } else {
      form.resetFields();
    }
  }, [editingStorage, form]);

  const onFinish = (values:any) => {
    // Chuyển đổi ngày tháng sang chuỗi ISO
    const payload = {
      ...values,
      date: values.date?.toISOString(),
      expired_date: values.expired_date?.toISOString(),
    };
    onSubmit(payload);
  };

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="donate_id"
            label={
              <span className="flex items-center gap-2">
                <IconListCheck size={16} /> Mã hiến máu
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập mã hiến tặng" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="blood_id"
            label={
              <span className="flex items-center gap-2">
                <IconDroplet size={16} /> Nhóm máu
              </span>
            }
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          >
            <Select placeholder="Chọn nhóm máu">
              {bloods.map((b) => (
                <Option key={b.blood_id} value={b.blood_id}>
                  {b.blood_type_id.blood_name} {b.rh_id.blood_Rh}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label={
              <span className="flex items-center gap-2">
                <IconCalendar size={16} /> Ngày
              </span>
            }
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item
            name="expired_date"
            label={
              <span className="flex items-center gap-2">
                <IconHourglass size={16} /> Ngày hết hạn
              </span>
            }
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày hết hạn" />
          </Form.Item>

          <Form.Item
            name="ml"
            label={
              <span className="flex items-center gap-2">
                <IconGauge size={16} /> Dung tích (ml)
              </span>
            }
            rules={[{ type: "number", min: 50, message: "Tối thiểu 50ml" }]}
          >
            <InputNumber min={50} style={{ width: "100%" }} placeholder="Nhập dung tích" />
          </Form.Item>

          <Form.Item
            name="unit"
            label={
              <span className="flex items-center gap-2">
                <IconNumbers size={16} /> Đơn vị
              </span>
            }
            rules={[{ type: "number", min: 1, message: "Tối thiểu 1 đơn vị" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Nhập số đơn vị" />
          </Form.Item>

          <Form.Item
            name="current_status"
            label={
              <span className="flex items-center gap-2">
                <IconListCheck size={16} /> Trạng thái
              </span>
            }
            initialValue="STORAGE"
          >
            <Select>
              <Option value="STORAGE">STORAGE</Option>
              <Option value="EXPIRED">EXPIRED</Option>
              <Option value="USED">USED</Option>
              <Option value="EXPORTED">EXPORTED</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="centralBlood_id"
            label={
              <span className="flex items-center gap-2">
                <IconBuildingBank size={16} /> Trung tâm máu
              </span>
            }
          >
            <Select placeholder="Chọn trung tâm máu">
              {centrals.map((c) => (
                <Option key={c.centralBlood_id} value={c.centralBlood_id}>
                  {c.centralBlood_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item className="mt-4">
          <div className="flex justify-center gap-3">
            <Button
              danger
              type="primary"
              htmlType="submit"
              icon={
                editingStorage ? (
                  <IconEdit size={16} />
                ) : (
                  <IconFilePlus size={16} />
                )
              }
            >
              {editingStorage ? "Cập nhật" : "Tạo mới"}
            </Button>
            {editingStorage && (
              <Button
                onClick={onCancelEdit}
                icon={<IconCircleX size={16} />}
                type="default"
              >
                Hủy bỏ
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}