import { useLocation, useNavigate } from 'react-router-dom';
import { Result,  Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import backgroundImage from '../../../assets/background.png';
import { motion } from 'framer-motion';
const { Title, Text } = Typography;

const VerifyNotice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; message?: string };

  const handleGoToLogin = (): void => {
    navigate('/');
  };

 return (
  <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-r from-black/70 to-black/30">
    
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <img
          src={backgroundImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </motion.div>

    {/* Overlay Content */}
    <div className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-8">
      <Result
        icon={<MailOutlined className="text-blue-500 text-6xl" />}
        title={
          <Title level={3} className="text-gray-800">
            Vui lòng kiểm tra email
          </Title>
        }
        subTitle={
          <Text className="text-gray-600 text-base">
            {state?.message || 'Chúng tôi đã gửi một email xác thực đến địa chỉ của bạn. Hãy kiểm tra hộp thư để hoàn tất đăng ký.'}
          </Text>
        }
        extra={
          <button
            onClick={handleGoToLogin}
            className="h-12 px-8 text-base font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-900 text-white hover:from-red-600 hover:to-red-800 transition-colors duration-300 shadow-lg cursor-pointer"
            style={{ color: 'white' , stroke: '2'}}
          >
            Quay lại đăng nhập
          </button>
        }
      />
    </div>
  </div>
);

};

export default VerifyNotice;
