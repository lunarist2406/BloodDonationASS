// FormCreate.tsx
import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
  message,
  Col,
} from "antd";
import {
  IconListCheck,
  IconDroplet,
  IconCalendar,
  IconHourglass,
  IconGauge,
  IconNumbers,
  IconBuildingBank,
  IconTrash,
  IconCircleX,
  IconFilePlus,
  IconEdit,
} from "@tabler/icons-react";
import dayjs from "dayjs";

const { Option } = Select;

export default function FormCreate({
  editingStorage,
  onSubmit,
  bloods,
  centrals,
  onCancelEdit,
}) {
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

  const onFinish = (values) => {
    // Convert dates to ISO strings
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
                <IconListCheck size={16} /> Donate ID
              </span>
            }
            rules={[{ required: true, message: "Please input Donate ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="blood_id"
            label={
              <span className="flex items-center gap-2">
                <IconDroplet size={16} /> Blood Type
              </span>
            }
            rules={[{ required: true, message: "Please select Blood Type" }]}
          >
            <Select placeholder="Select blood">
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
                <IconCalendar size={16} /> Date
              </span>
            }
            rules={[{ required: true, message: "Please select Date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="expired_date"
            label={
              <span className="flex items-center gap-2">
                <IconHourglass size={16} /> Expired Date
              </span>
            }
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="ml"
            label={
              <span className="flex items-center gap-2">
                <IconGauge size={16} /> ML
              </span>
            }
            rules={[{ type: "number", min: 50, message: "Min 50" }]}
          >
            <InputNumber min={50} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="unit"
            label={
              <span className="flex items-center gap-2">
                <IconNumbers size={16} /> Unit
              </span>
            }
            rules={[{ type: "number", min: 1, message: "Min 1" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="current_status"
            label={
              <span className="flex items-center gap-2">
                <IconListCheck size={16} /> Status
              </span>
            }
            initialValue="STORAGE"
          >
            <Select>
              <Option value="STORAGE">STORAGE</Option>
              <Option value="EXPIRED">EXPIRED</Option>
              <Option value="USED">USED</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="centralBlood_id"
            label={
              <span className="flex items-center gap-2">
                <IconBuildingBank size={16} /> Central Blood Center
              </span>
            }
          >
            <Select placeholder="Select center">
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
              {editingStorage ? "Update" : "Create"}
            </Button>
            {editingStorage && (
              <Button
                onClick={onCancelEdit}
                icon={<IconCircleX size={16} />}
                type="default"
              >
                Cancel
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
