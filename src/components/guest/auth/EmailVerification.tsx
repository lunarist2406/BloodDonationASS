import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Spin, Button, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { api } from '../../config/axios/axiosInstance';

const { Title} = Typography;

type VerificationStatus = 'loading' | 'success' | 'error' | 'invalid' | 'already-verified';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setStatus('invalid');
      setMessage('Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại đường dẫn.');
      return;
    }

    verifyEmail(token, email);
  }, []);

  const verifyEmail = async (token: string, email: string) => {
    try {
      setStatus('loading');
      const res = await api.get('/api/v1/auth/verify-email', {
        params: { email, token },
      });

      setStatus('success');
      setMessage(res.data || 'Xác thực thành công. Vui lòng đăng nhập.');

      setTimeout(() => {
        navigate('/', {
          state: { message: 'Tài khoản đã được xác thực. Vui lòng đăng nhập.', type: 'success' },
        });
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.status;
        const msg = error.response?.data?.message || 'Có lỗi xảy ra khi xác thực.';

        if (code === 409) {
          setStatus('already-verified');
          setMessage('Tài khoản đã được xác thực trước đó.');
          setTimeout(() => {
            navigate('/', {
              state: { message: 'Tài khoản đã được xác thực. Vui lòng đăng nhập.', type: 'info' },
            });
          }, 3000);
        } else if (code === 400 || code === 404) {
          setStatus('error');
          setMessage(msg);
        } else {
          setStatus('error');
          setMessage('Lỗi không xác định xảy ra.');
        }
      } else {
        setStatus('error');
        setMessage('Không thể kết nối đến máy chủ.');
      }
    }
  };

  const renderResult = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-12 px-6">
            <Spin size="large" />
            <Title level={4} className="mt-6 text-white">Đang xác thực email...</Title>
          </div>
        );

      case 'success':
        return (
          <Result
            icon={<CheckCircleOutlined className="text-green-500 text-5xl" />}
            title="Xác thực thành công!"
            subTitle={message}
          />
        );

      case 'already-verified':
        return (
          <Result
            status="info"
            title="Tài khoản đã được xác thực"
            subTitle={message}
          />
        );

      case 'error':
      case 'invalid':
        return (
          <Result
            status="error"
            icon={<CloseCircleOutlined className="text-red-500 text-5xl" />}
            title="Xác thực thất bại"
            subTitle={message}
            extra={
              <Button type="primary" onClick={() => navigate('/')}>
                Quay lại đăng nhập
              </Button>
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-8">
        {renderResult()}
      </div>
    </div>
  );
};

export default EmailVerification;
