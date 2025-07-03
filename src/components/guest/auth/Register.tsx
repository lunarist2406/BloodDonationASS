import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Input, Select, DatePicker, Button, Modal } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/background.png";
import { useNavigate } from "react-router-dom";
import { api } from "../../../components/config/axios/axiosInstance";
import axios from "axios";
import moment from "moment";
import { getProvinces, getDistricts, getWards,District, Ward } from "vietnam-provinces";


const { Option } = Select;

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provinces] = useState(getProvinces());
const [districts, setDistricts] = useState<District[]>([]);
const [wards, setWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    dob: "",
    role_name: "MEMBER",
    location: {
      ipAddress: "",
      city: "TP.HCM",
      district: "",
      ward: "",
      road: "",
      house_number: ""
    },
  });

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            ipAddress: data.ip,
          },
        }));
        form.setFieldsValue({ "location.ipAddress": data.ip });
      } catch (error) {
        console.error("Không thể lấy IP address:", error);
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            ipAddress: "127.0.0.1",
          },
        }));
        form.setFieldsValue({ "location.ipAddress": "127.0.0.1" });
      }
    };

    fetchIP();
  }, [form]);

  const handleProvinceChange = (value:any) => {
  const selectedProvince = provinces.find((p) => p.code === value);
  if (selectedProvince) {
    const provinceDistricts = getDistricts(selectedProvince.code);
    setDistricts(provinceDistricts);
    setWards([]);
    form.setFieldsValue({
      'location.district': undefined,
      'location.ward': undefined
    });
  }
};

const handleDistrictChange = (value:any) => {
  const selectedDistrict = districts.find((d) => d.code === value);
  if (selectedDistrict) {
    const districtWards = getWards(selectedDistrict.code);
    setWards(districtWards);
    form.setFieldsValue({
      'location.ward': undefined
    });
  }
};

const handleSubmit = async (values:any) => {
  setError("");
  setIsLoading(true);

  const selectedProvince = provinces.find(p => p.code === values.location.city);
  const selectedDistrict = districts.find(d => d.code === values.location.district);
  const selectedWard = wards.find(w => w.code === values.location.ward);

  try {
    // await api.post("/api/v1/auth/register", {
    //   email: values.email,
    //   password: values.password,
    //   fullname: values.fullName,
    //   role_name: formData.role_name,
    //   gender: values.gender,
    //   phone: values.phone,
    //   dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : "",
    //   location: {
    //     ipAddress: formData.location.ipAddress,
    //     city: selectedProvince?.name || "",
    //     district: selectedDistrict?.name || "",
    //     ward: selectedWard?.name || "",
    //     road: values.location.road || "",
    //     house_number: values.location.house_number || ""
    //   }
    // });
    const registerData = {
      email: values.email,
      password: values.password,
      fullname: values.fullName,
      role_name: formData.role_name,
      gender: values.gender,
      phone: values.phone,
      dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : "",
      location: {
        ipAddress: formData.location.ipAddress,
        city: selectedProvince?.name || "",
        district: selectedDistrict?.name || "",
        ward: selectedWard?.name || "",
        road: values.location.road || "",
        house_number: values.location.house_number || ""
      }
  };

  console.log("registerData gửi lên:", registerData);
console.log("Địa chỉ đầy đủ:", [
  registerData.location.house_number,
  registerData.location.road,
  registerData.location.ward,
  registerData.location.district,
  registerData.location.city
].filter(Boolean).join(', '));

    await api.post("/api/v1/auth/register", registerData);
    Modal.success({
      title: 'Đăng ký thành công!',
      content: 'Vui lòng kiểm tra email của bạn để xác thực tài khoản.',
      onOk: () => {
        navigate('/verify-notice', {
          state: {
            email: values.email,
            message: 'Vui lòng kiểm tra email để hoàn tất quá trình đăng ký.'
          }
        });
      }
    });


  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNABORTED") {
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } else {
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
        if (Array.isArray(err.response?.data?.message)) {
          setError(err.response?.data?.message.join(", "));
        } else {
          setError(err.response?.data?.message || "Đăng ký thất bại");
        }
      }
    } else {
      setError("Có lỗi xảy ra khi đăng ký");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <img
          src={backgroundImage}
          alt="Register"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative min-h-screen flex items-center justify-end">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-6 m-4 rounded-xl shadow-xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <img src={logo} alt="logo" className="w-12 h-16" />
          </motion.div>
          <h4 className="text-2xl font-bold text-center  text-gray-800">
            Đăng Ký Tài Khoản
          </h4>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Họ và tên"
                  size="middle"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="middle"
                />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Giới tính" size="middle">
                  <Option value="Male">Nam</Option>
                  <Option value="Female">Nữ</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  size="middle"
                />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="dob"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Ngày sinh"
                  size="middle"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  size="middle"
                />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                  size="middle"
                />
              </Form.Item>
              <Form.Item
  label="Tỉnh/Thành phố"
  name={['location', 'city']}
  rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
>
  <Select
    placeholder="Chọn tỉnh/thành phố"
    onChange={handleProvinceChange}
    size="middle"
  >
    {provinces.map(province => (
      <Option key={province.code} value={province.code}>
        {province.name}
      </Option>
    ))}
  </Select>
</Form.Item>

<Form.Item
  label="Quận/Huyện"
  name={['location', 'district']}
  rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
>
  <Select
    placeholder="Chọn quận/huyện"
    onChange={handleDistrictChange}
    size="middle"
    disabled={!form.getFieldValue(['location', 'city'])}
  >
    {districts.map(district => (
      <Option key={district.code} value={district.code}>
        {district.name}
      </Option>
    ))}
  </Select>
</Form.Item>

<Form.Item
  label="Phường/Xã"
  name={['location', 'ward']}
  rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
>
  <Select
    placeholder="Chọn phường/xã"
    size="middle"
    disabled={!form.getFieldValue(['location', 'district'])}
  >
    {wards.map(ward => (
      <Option key={ward.code} value={ward.code}>
        {ward.name}
      </Option>
    ))}
  </Select>
</Form.Item>

<Form.Item
  label="Số nhà"
  name={['location', 'house_number']}
>
  <Input
    prefix={<EnvironmentOutlined />}
    placeholder="Số nhà"
    size="middle"
  />
</Form.Item>
<Form.Item
  label="Tên đường"
  name={['location', 'road']}
>
  <Input
    prefix={<EnvironmentOutlined />}
    placeholder="Tên đường"
    size="middle"
  />
</Form.Item>
            </div>

            {error && (
              <div className="text-red-600 text-xs text-center">{error}</div>
            )}

            <Form.Item>
              <motion.div
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg font-medium border-0"
                  style={{
                  background: "linear-gradient(90deg, #ef4444 0%, #7f1d1d 100%)",
                  color: "#fff",
                  }}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
                </Button>
              </motion.div>
            </Form.Item>

            <div className="text-center text-xs text-red-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
