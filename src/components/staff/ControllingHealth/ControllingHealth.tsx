import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Space,
  Image,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Upload,
  DatePicker,
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useHealthService from "../../../hooks/HealthInfor/useHealthService";

const { TextArea } = Input;

export default function ControllingHealth() {
  const {
    getAllHealthInfo,
    deleteHealthInfo,
    updateHealthInfoAdmin,
  } = useHealthService();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState({ open: false, record: null });
  const [editModal, setEditModal] = useState({ open: false, record: null });
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getAllHealthInfo(current, pageSize);
      setData(res.data.result);
      setPagination({
        current,
        pageSize,
        total: res.data.meta.total,
      });
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu sức khỏe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa?",
      onOk: async () => {
        try {
          await deleteHealthInfo(id);
          message.success("Xóa thành công!");
          fetchData();
        } catch (err) {
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  const handleEdit = (record) => {
    setEditModal({ open: true, record });
    form.setFieldsValue({
      user_id: record.user_id?.user_id || "", // đảm bảo không bị undefined
      blood_id: record.blood_id?.blood_id,
      height: record.height,
      weight_decimal: record.weight_decimal,
      blood_pressure: record.blood_pressure,
      medical_history: record.medical_history,
      latest_donate: dayjs(record.latest_donate),
      status_health: record.status_health,
    });
  };

const handleUpdate = async () => {
  try {
    const values = await form.validateFields();
    console.log("🧪 Values from form:", values);

    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (key === "latest_donate") {
        formData.append(key, value.toISOString());
      } else if (key === "img_health" && value?.file) {
        formData.append("img_health", value.file.originFileObj);
      } else {
        formData.append(key, value);
      }
    }

    // Log FormData để xem user_id chính xác không
    console.log("📦 FormData content:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    await updateHealthInfoAdmin(editModal.record.infor_health, formData);
    message.success("Cập nhật thành công!");
    setEditModal({ open: false, record: null });
    fetchData();
  } catch (err) {
    console.error("❌ Cập nhật thất bại:", err);
    message.error("Cập nhật thất bại!");
  }
};


  const columns = [
    {
      title: "Họ tên",
      dataIndex: ["user_id", "fullname"],
    },
    {
      title: "Email",
      dataIndex: ["user_id", "email"],
    },
    {
      title: "Chiều cao",
      dataIndex: "height",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight_decimal",
    },
    {
      title: "Tình trạng",
      dataIndex: "status_health",
    },
    {
      title: "Ảnh",
      render: (_, record) =>
        record.img_health ? (
          <Image width={50} src={record.img_health} />
        ) : (
          "Không có"
        ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setViewModal({ open: true, record })} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.infor_health)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-bold">Quản lý thông tin sức khỏe</h2>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          Tải lại
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.infor_health}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchData(page, pageSize),
        }}
      />

      {/* Modal View */}
      <Modal
        title="Chi tiết thông tin sức khỏe"
        open={viewModal.open}
        onCancel={() => setViewModal({ open: false, record: null })}
        footer={null}
      >
        {viewModal.record && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên">{viewModal.record.user_id?.fullname}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewModal.record.user_id?.email}</Descriptions.Item>
            <Descriptions.Item label="Chiều cao">{viewModal.record.height} cm</Descriptions.Item>
            <Descriptions.Item label="Cân nặng">{viewModal.record.weight_decimal} kg</Descriptions.Item>
            <Descriptions.Item label="Huyết áp">{viewModal.record.blood_pressure}</Descriptions.Item>
            <Descriptions.Item label="Tình trạng">{viewModal.record.status_health}</Descriptions.Item>
            <Descriptions.Item label="Tiền sử">{viewModal.record.medical_history}</Descriptions.Item>
            <Descriptions.Item label="Lần hiến gần nhất">
              {dayjs(viewModal.record.latest_donate).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Cập nhật thông tin sức khỏe"
        open={editModal.open}
        onCancel={() => setEditModal({ open: false, record: null })}
        onOk={handleUpdate}
        okText="Cập nhật"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="user_id" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="blood_id" label="Blood ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="weight_decimal" label="Cân nặng (kg)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="blood_pressure" label="Huyết áp" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="medical_history" label="Tiền sử bệnh" rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="latest_donate" label="Lần hiến gần nhất" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status_health" label="Tình trạng sức khỏe" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Tốt">Tốt</Select.Option>
              <Select.Option value="Khá">Khá</Select.Option>
              <Select.Option value="Yếu">Yếu</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="img_health" label="Ảnh sức khỏe">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
