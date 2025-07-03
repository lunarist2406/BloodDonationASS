import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Space,
  DatePicker,
} from "antd";

import {
  IconEye,
  IconEdit,
  // IconTrash,  -- sẽ không dùng vì ẩn nút xóa
} from "@tabler/icons-react";

import useUser from "../../../../hooks/User/useUser";
import useUserService from "../../../../hooks/User/useUserService";
import dayjs from "dayjs";

const { Title } = Typography;

export default function TableControlling() {
  const { allUsers, fetchAllUsers } = useUser();
  const { updateUser /*, deleteUser*/ } = useUserService(); // Ẩn deleteUser vì ko dùng

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Thêm state tìm kiếm email
  const [searchEmail, setSearchEmail] = useState<any>("");

  useEffect(() => {
    fetchAllUsers(currentPage, pageSize);
  }, [currentPage, pageSize, fetchAllUsers]);

  // View user info
  const handleDetail = (record:any) => {
    setSelectedUser(record);
    form.setFieldsValue({
      fullname: record.fullname,
      email: record.email,
      gender: record.gender,
      role: record?.role_id?.role_name,
      city: record?.location_id?.city,
      phone: record.phone,
      dob: record.dob ? dayjs(record.dob) : null,
    });
    setViewModalOpen(true);
  };

  // Edit user
  const handleEdit = (record:any) => {
    setSelectedUser(record);
    form.setFieldsValue({
      fullname: record.fullname,
      email: record.email,
      gender: record.gender,
      role: record?.role_id?.role_name,
      phone: record.phone,
      dob: record.dob ? dayjs(record.dob) : null,
    });
    setEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        role_name: values.role,
        phone: String(values.phone),
        dob: values.dob ? values.dob.toISOString() : null,
      };

      await updateUser(selectedUser?.user_id, payload);
      message.success("Cập nhật người dùng thành công");
      setEditModalOpen(false);
      fetchAllUsers(currentPage, pageSize);
    } catch (err:any) {
      message.error("Cập nhật thất bại: " + err.message);
      console.error(err);
    }
  };

  // Không dùng nữa (ẩn nút xóa)
  // const handleDelete = async (userId) => {
  //   try {
  //     await deleteUser(userId);
  //     message.success("Xóa người dùng thành công");
  //     fetchAllUsers(currentPage, pageSize);
  //   } catch (err) {
  //     message.error("Xóa thất bại lí do : " + err.message);
  //     console.error(err);
  //   }
  // };

  // Lọc data theo email search
  const filteredData = allUsers?.data?.result?.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const columns = [
    {
      title: "STT",
      render: (_:any, __:any, index:any) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },

    {
      title: "Vai trò",
      dataIndex: ["role_id", "role_name"],
    },
    {
      title: "Thành phố",
      dataIndex: ["location_id", "city"],
    },
    {
      title: "Hành động",
      render: (_:any, record:any) => (
        <Space>
          <Button
            icon={<IconEye size={18} />}
            onClick={() => handleDetail(record)}
          />
          <Button
            icon={<IconEdit size={18} />}
            onClick={() => handleEdit(record)}
          />
          {/* Nút xóa đã ẩn */}
          {/* <Popconfirm
            title="Bạn chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.user_id)}
          >
            <Button icon={<IconTrash size={18} />} danger />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh Sách Người Dùng
        </Title>
        {/* Ẩn nút Thêm người dùng */}
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedUser(null);
            form.resetFields();
            setEditModalOpen(true);
          }}
        >
          Thêm người dùng
        </Button> */}
      </div>

      {/* Input tìm kiếm */}
      <Input.Search
        placeholder="Tìm kiếm theo email"
        allowClear
        style={{ marginBottom: 16, maxWidth: 300 }}
        onChange={(e:any) => setSearchEmail(e.target.value)}
        value={searchEmail}
      />

      <Table
        rowKey="user_id"
        columns={columns}
        dataSource={filteredData || []}
        pagination={{
          current: currentPage,
          pageSize,
          total: allUsers?.data?.meta?.total || 0,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />

      {/* Modal xem */}
      <Modal
        title="Thông tin chi tiết"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="fullname" label="Họ tên">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select disabled>
              <Select.Option value="Male">Nam</Select.Option>
              <Select.Option value="Female">Nữ</Select.Option>
              <Select.Option value="Other">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input disabled />
          </Form.Item>
          <Form.Item name="dob" label="Ngày sinh">
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Input disabled />
          </Form.Item>
          <Form.Item name="city" label="Thành phố">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title={selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleUpdateUser}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="fullname"
            label="Họ tên"
            rules={[{ required: true, message: "Nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select>
              <Select.Option value="Male">Nam</Select.Option>
              <Select.Option value="Female">Nữ</Select.Option>
              <Select.Option value="Other">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="SĐT"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Ngày sinh"
            rules={[{ required: true, message: "Chọn ngày sinh" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai Trò"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="STAFF">STAFF</Select.Option>
              <Select.Option value="MEMBER">MEMBER</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
