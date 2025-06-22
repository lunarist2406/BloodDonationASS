import {
  Table,
  Button,
  Tag,
  Modal,
  Descriptions,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import useCentralService from "../../../../hooks/CentralBlood/useCentralService";
import { useAuth } from "../../../../hooks/User/useAuth";
import { getAllWorkingHours } from "../../../../hooks/workinghours/WorkingHourService";
import { IconMapPinFilled, IconBuildingBank } from "@tabler/icons-react";

export default function TableCentral({ onSelectCentral }) {
  const { getAllCentral, createCentral, updateCentral, deleteCentral } =
    useCentralService();
  const { token } = useAuth();

  const [central, setCentral] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWorkingIds, setSelectedWorkingIds] = useState([]);

  const [form] = Form.useForm();

  const fetchCentral = async () => {
    setLoading(true);
    try {
      const res = await getAllCentral(1, 100);
      setCentral(res.data.result);
    } catch {
      message.error("Lỗi khi load danh sách trung tâm");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkingHours = async () => {
    try {
      const res = await getAllWorkingHours(token);
      setWorkingHours(res.data.result);
    } catch {
      message.error("Lỗi khi lấy giờ làm việc");
    }
  };

  useEffect(() => {
    fetchCentral();
    fetchWorkingHours();
  }, []);

  const openCreateModal = () => {
    form.resetFields();
    setSelectedWorkingIds([]);
    setIsEditMode(false);
    setIsFormModalVisible(true);
  };

  const openEditModal = (record) => {
    const ids = record.working_id?.map((id) => id.working_id || id._id || id);
    form.setFieldsValue({
      ...record,
      working_id: ids,
    });
    setSelectedWorkingIds(ids);
    setSelectedItem(record);
    setIsEditMode(true);
    setIsFormModalVisible(true);
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá trung tâm này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await deleteCentral(record.centralBlood_id);
          message.success("Xoá thành công");
          fetchCentral();
        } catch {
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.working_id = values.working_id.map((id) =>
        typeof id === "string" ? id : id?.working_id || id?._id || String(id)
      );

      if (isEditMode && selectedItem) {
        await updateCentral(selectedItem.centralBlood_id, values);
        message.success("Cập nhật thành công");
      } else {
        await createCentral(values);
        message.success("Tạo mới thành công");
      }

      setIsFormModalVisible(false);
      fetchCentral();
    } catch (err) {
      console.error(err);
      message.error("Lỗi xử lý dữ liệu");
    }
  };

  const showDetail = (record) => {
    setSelectedItem(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Tên Trung Tâm",
      dataIndex: "centralBlood_name",
      key: "centralBlood_name",
      render: (_, record) => (
        <button
          onClick={() => onSelectCentral(record)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
        >
          <IconMapPinFilled size={18} />
          <span className="underline underline-offset-2">
            {record.centralBlood_name}
          </span>
        </button>
      ),
    },
    {
      title: "Trạng Thái",
      key: "is_open",
      render: (_, record) => {
        const anyOpen = record.working_id?.some((item) => item.is_open);
        return anyOpen ? (
          <Tag color="green">Hoạt Động</Tag>
        ) : (
          <Tag color="red">Ngưng</Tag>
        );
      },
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            type="link"
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            type="link"
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className="rounded-xl shadow p-4"
      style={{
        background: "linear-gradient(to right, #f43f5e, #991b1b)",
        color: "white",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconBuildingBank size={22} /> Danh Sách Trung Tâm
        </h2>
        <div className="flex gap-2">
          <Button icon={<ReloadOutlined />} onClick={fetchCentral}>
            Reload
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={openCreateModal}
          >
            Thêm Trung Tâm
          </Button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-md">
        <Table
          columns={columns}
          dataSource={central}
          rowKey={(record) => record.centralBlood_id}
          pagination={{ pageSize: 5 }}
          loading={loading}
          style={{ minHeight: 300 }}
        />
      </div>

      {/* Modal chi tiết */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-red-600">
            <IconBuildingBank size={20} />
            Chi Tiết Trung Tâm
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedItem && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tên Trung Tâm">
              {selectedItem.centralBlood_name}
            </Descriptions.Item>
            <Descriptions.Item label="Địa Chỉ">
              {selectedItem.centralBlood_address}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ Làm Việc">
              {selectedItem.working_id && selectedItem.working_id.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedItem.working_id.map((item) => (
                    <li key={item.working_id}>
                      {item.day_of_week}: {item.open_time?.slice(11, 16)} -{" "}
                      {item.close_time?.slice(11, 16)} (
                      {item.is_open ? "Mở" : "Đóng"})
                    </li>
                  ))}
                </ul>
              ) : (
                "Không có giờ làm việc"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal form */}
      <Modal
        title={isEditMode ? "Cập Nhật Trung Tâm" : "Thêm Trung Tâm"}
        open={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onOk={handleFormSubmit}
        okText={isEditMode ? "Cập Nhật" : "Tạo"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên Trung Tâm"
            name="centralBlood_name"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa Chỉ"
            name="centralBlood_address"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chọn Working ID"
            name="working_id"
            rules={[{ required: true, message: "Chọn ít nhất 1 Working ID" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn Working IDs"
              onChange={(value) => setSelectedWorkingIds(value)}
            >
              {workingHours.map((item) => (
                <Select.Option key={item.working_id} value={item.working_id}>
                  {`${item.day_of_week} - ${item.open_time.slice(
                    11,
                    16
                  )} đến ${item.close_time.slice(11, 16)}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedWorkingIds.length > 0 && (
            <div className="text-sm text-gray-700 mt-2 bg-gray-100 p-2 rounded">
              <strong>Giờ làm việc đã chọn:</strong>
              <ul className="list-disc list-inside">
                {workingHours
                  .filter((item) =>
                    selectedWorkingIds.includes(item.working_id)
                  )
                  .map((item) => (
                    <li key={item.working_id}>
                      {item.day_of_week}: {item.open_time.slice(11, 16)} -{" "}
                      {item.close_time.slice(11, 16)} (
                      {item.is_open ? "Mở" : "Đóng"})
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
