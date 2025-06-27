import { useEffect, useState } from "react";
import { Card, Col, Form, Input, Row, Button, message, Select } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import useUser from "../../../hooks/User/useUser";
import useUserService from "../../../hooks/User/useUserService";
import dayjs from "dayjs";

const { Option } = Select;

export default function ProfileAccount() {
  const { userData, setUserData } = useUser();
  const { updateUser, getUserById } = useUserService(); // 👈 nhớ thêm hàm fetch
  const [form] = Form.useForm();
  const [donationCount, setDonationCount] = useState<number>(0);

  useEffect(() => {
    if (userData?.data) {
      const location = userData.data.location_id || {};
      const dobValue = userData.data.dob
        ? dayjs(userData.data.dob).format("YYYY-MM-DD")
        : "";

      form.setFieldsValue({
        fullname: userData.data.fullname,
        email: userData.data.email,
        phone: userData.data.phone,
        dob: dobValue,
        gender: userData.data.gender,
        house_number: location.house_number,
        road: location.road,
        ward: location.ward,
        district: location.district,
        city: location.city,
        role_name: userData.data.role_id?.[0]?.role_name || "MEMBER",
      });

      setDonationCount(5);
    }
  }, [userData, form]);

  const onFinish = async (values: any) => {
    const payload = {
      email: values.email,
      fullname: values.fullname,
      phone: values.phone,
      dob: values.dob,
      gender: values.gender,
      role_name:
        values.role_name || userData?.data.role_id?.[0]?.role_name || "MEMBER",
    };

    console.log("🚀 Payload gửi lên:", payload);

    try {
      await updateUser(userData?.data.user_id, payload);
      message.success("✅ Cập nhật thành công!");

      // ⏬ Fetch lại user mới nhất
      const updatedUser = await getUserById(userData?.data.user_id);
      setUserData(updatedUser);
    } catch (error: any) {
      console.error("❌ Lỗi cập nhật:", error);
      const errMessage =
        error?.response?.data?.message?.join?.(", ") ||
        error?.response?.data?.message ||
        "Cập nhật thất bại!";
      message.error(`❌ ${errMessage}`);
    }
  };

  return (
    <Row gutter={24}>
      {/* LEFT FORM */}
      <Col xs={24} md={24}>
        <Card title="Thông tin tài khoản" className="shadow-md">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Họ tên" name="fullname">
                  <Input prefix={<UserOutlined />} placeholder="Họ tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input prefix={<PhoneOutlined />} placeholder="SĐT" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input prefix={<MailOutlined />} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày sinh" name="dob">
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Option value="Male">Nam</Option>
                    <Option value="Female">Nữ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số nhà" name="house_number">
                  <Input placeholder="VD: 86" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Đường" name="road">
                  <Input placeholder="VD: Nguyễn Huệ" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phường / Xã" name="ward">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Quận / Huyện" name="district">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thành phố / Tỉnh" name="city">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="role_name" hidden>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      {/* RIGHT AVATAR */}
    </Row>
  );
}
