import  { useEffect, useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Steps,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  message
} from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  SendOutlined
} from "@ant-design/icons";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/background.png";
import { api } from "../../../components/config/axios/axiosInstance";

const { Title, Text } = Typography;

interface ForgotPasswordResponse {
  statusCode: number;
  message: string;
  data?: any;
}

interface VerifyCodeResponse {
  statusCode: number;
  message: string;
  data?: any;
}

interface ResetPasswordResponse {
  statusCode: number;
  message: string;
  data?: any;
}
type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};
// Component nhập 6 số xác thực
function VerificationCodeInput({ value = "", onChange, disabled = false }: Props) {
  const inputs = Array(6).fill(0);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "");
    let newValue = value;

    if (val) {
      newValue = value.substring(0, idx) + val[0] + value.substring(idx + 1);
      onChange(newValue);
      if (idx < 5 && val) refs[idx + 1]?.current?.focus();
    } else {
      newValue = value.substring(0, idx) + "" + value.substring(idx + 1);
      onChange(newValue);
    }
  };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === "Backspace" && !value[idx] && idx > 0) {
        refs[idx - 1]?.current?.focus();
      }
    };


  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {inputs.map((_, idx) => (
        <Input
          key={idx}
          ref={refs[idx]}
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, idx)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, idx)}
          style={{ width: 40, textAlign: "center", fontSize: 20 }}
          disabled={disabled}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      ))}
    </div>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Toast khi có success
  useEffect(() => {
    if (success) {
      message.success(success);
    }
  }, [success]);

  useEffect(() => {
  if (error) {
    message.error(error);
  }
}, [error]);

  // Countdown
  useEffect(() => {
    if (currentStep !== 1) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep]);

  // Format time function
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Step 1: Send email
  const handleSendEmail = async (values: { email: string }) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post<ForgotPasswordResponse>(
        "/api/v1/auth/send-reset-code",
        { email: values.email.trim() }
      );

      if (response.data?.statusCode === 201) {
        setEmail(values.email);
        setSuccess("Mã xác thực đã được gửi đến email của bạn");
        setCurrentStep(1);
      } else {
        setError(response.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (err: any) {
      console.error("Send email error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Email không tồn tại trong hệ thống");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (values: { code: string }) => {
    if (isExpired) {
      setError("Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post<VerifyCodeResponse>(
        "/api/v1/auth/verify-reset-code",
        {
          email: email,
          digit: Number(values.code)
        }
      );

      if (response.data?.statusCode === 201) {
        setVerificationCode(Number(values.code));
        setSuccess("Mã xác thực hợp lệ");
        setCurrentStep(2);
      } else {
        setError(response.data?.message || "Mã xác thực không hợp lệ");
      }
    } catch (err: any) {
      console.error("Verify code error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Mã xác thực không hợp lệ hoặc đã hết hạn");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<ResetPasswordResponse>(
        "/api/v1/auth/reset-password",
        {
          email: email,
          newPassword: values.password
        }
      );

      if (response.data?.statusCode === 201) {
        setSuccess("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(response.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể đặt lại mật khẩu, vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
    setSuccess("");
  };

  const handleResendCode = async () => {
    setTimeLeft(300);
    setIsExpired(false);
    form.submit();
  };

  const steps = [
    {
      title: "Nhập Email",
      icon: <MailOutlined />
    },
    {
      title: "Xác Thực",
      icon: <SafetyOutlined />
    },
    {
      title: "Đặt Lại Mật Khẩu",
      icon: <LockOutlined />
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSendEmail}
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email của bạn"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                icon={<SendOutlined />}
                className="bg-gradient-to-r from-red-500 to-red-900 border-none h-12"
              >
                Gửi Mã Xác Thực
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleVerifyCode}
            size="large"
            initialValues={{ code: "" }}
          >
            <div className="text-center mb-6">
              <Text type="secondary">
                Mã xác thực đã được gửi đến: <strong>{email}</strong>
              </Text>
              <div
                className={`mt-2 font-medium ${
                  isExpired ? "text-red-600" : "text-gray-600"
                }`}
              >
                {isExpired ? (
                  <span>Mã xác thực đã hết hạn</span>
                ) : (
                  <span>Mã có hiệu lực trong: {formatTime(timeLeft)}</span>
                )}
              </div>
            </div>

            <Form.Item
              name="code"
              label="Mã Xác Thực"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác thực!" },
                { len: 6 },
                { pattern: /^\d{6}$/, message: "Mã xác thực chỉ gồm 6 chữ số!" }
              ]}
            >
              <VerificationCodeInput
                value={form.getFieldValue("code") || ""}
                onChange={val => form.setFieldsValue({ code: val })}
                disabled={isExpired}
              />
            </Form.Item>

            <Form.Item>
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  disabled={isExpired}
                  className="bg-gradient-to-r from-red-500 to-red-900 border-none h-12"
                >
                  Xác Thực
                </Button>

                <div className="text-center">
                  <Text type="secondary">Không nhận được mã? </Text>
                  <Button
                    type="link"
                    onClick={handleResendCode}
                    className="p-0 text-red-600"
                    disabled={!isExpired && timeLeft > 0}
                  >
                    Gửi lại
                  </Button>
                </div>
              </Space>
            </Form.Item>
          </Form>
        );

      case 2:
        return (
          <Form
            layout="vertical"
            onFinish={handleResetPassword}
            size="large"
          >
            <Form.Item
              name="password"
              label="Mật Khẩu Mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác Nhận Mật Khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="bg-gradient-to-r from-red-500 to-red-900 border-none h-12"
              >
                Đặt Lại Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <img
          src={backgroundImage}
          alt="Forgot Password"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-8 mx-4 rounded-2xl shadow-2xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <img src={logo} alt="logo" className="w-16 h-20" />
          </motion.div>

          {/* Title */}
          <Title level={2} className="text-center mb-2 text-gray-800">
            Quên Mật Khẩu
          </Title>

          {/* Steps */}
          <div className="mb-8">
            <Steps current={currentStep} items={steps} size="small" />
          </div>         

          {/* Step Content */}
          <div className="mb-6">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <Divider />

          <div className="flex justify-between">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevStep}
                icon={<ArrowLeftOutlined />}
                className="flex items-center justify-center px-6 py-2 text-gray-600 hover:text-red-600 transition-colors duration-300 rounded-lg hover:bg-red-50 border border-gray-200 hover:border-red-200"
              >
                <span className="ml-2">Quay Lại</span>
              </Button>
            )}

            <Button
              onClick={handleBackToLogin}
              icon={<ArrowLeftOutlined />}
              className="flex items-center justify-center px-6 py-2 text-red-600 transition-all duration-300 rounded-lg hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 ml-auto"
            >
              <span className="ml-2">Về Trang Đăng Nhập</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}