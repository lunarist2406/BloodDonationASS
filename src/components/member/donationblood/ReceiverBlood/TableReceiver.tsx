import {
  Form,
  Input,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Modal,
} from "antd";
import {
  IconUser,
  IconCalendar,
  IconPhone,
  IconMail,
  // IconHandHeart,
  // IconDropletBlood,
  IconMapPin,
  IconActivityHeartbeat,
  IconBuildingHospital,
  IconStar,
  IconArrowBigUpLine,
  IconWeight,
  IconHeartRateMonitor,
  IconHeartbeat,
  IconHistory,
  IconPill,
  IconCalendarTime,
  IconVirus,
  IconDroplet,
  IconHeart,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { RegisterBlood } from "../../../../hooks/RegistrationForm/useRegisterBlood";

const { Title } = Typography;

interface Props {
  data: RegisterBlood[];
}

export default function TableReceiverBlood({ data }: Props) {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <Title level={3} style={{ color: "#d32f2f", marginBottom: 24 }}>
        Thông tin đã đăng ký Nhận Máu
      </Title>

      {data.map((item, index) => (
        <div
          key={item.id}
          className="mb-8 border border-gray-200 rounded-lg p-4"
        >
          <Title level={4}>Người đăng ký #{index + 1}</Title>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Họ tên">
                  <Input
                    value={item.fullName}
                    readOnly
                    prefix={<IconUser size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày sinh">
                  <Input
                    value={item.dob}
                    readOnly
                    prefix={<IconCalendar size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số điện thoại">
                  <Input
                    value={item.phone}
                    readOnly
                    prefix={<IconPhone size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email">
                  <Input
                    value={item.email}
                    readOnly
                    prefix={<IconMail size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Vai trò Nhận Máu">
                  <Input
                    value={item.roleDonation}
                    readOnly
                    prefix={<IconHeart size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nhóm máu">
                  <Input
                    value={item.bloodType}
                    readOnly
                    prefix={<IconDroplet size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Khu vực">
                  <Input
                    value={item.location}
                    readOnly
                    prefix={<IconMapPin size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Trạng thái">
                  <Input
                    value={item.status}
                    readOnly
                    prefix={<IconActivityHeartbeat size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Bệnh viện tiếp nhận">
                  <Input
                    value={item.hospital || "Chưa xác định"}
                    readOnly
                    prefix={<IconBuildingHospital size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Cấp độ">
                  <Input
                    value={item.level || "Chưa phân loại"}
                    readOnly
                    prefix={<IconStar size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              danger
              onClick={() => setVisibleIndex(index)}
            >
              Xem thông tin sức khỏe
            </Button>

            <Modal
              title="Thông tin sức khỏe"
              open={visibleIndex === index}
              onCancel={() => setVisibleIndex(null)}
              footer={null}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Chiều cao">
                    <Input
                      value={item.statusHealth.height}
                      readOnly
                      prefix={<IconArrowBigUpLine size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Cân nặng">
                    <Input
                      value={item.statusHealth.weight}
                      readOnly
                      prefix={<IconWeight size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Huyết áp">
                    <Input
                      value={item.statusHealth.bloodPressure}
                      readOnly
                      prefix={
                        <IconHeartRateMonitor size={16} color="#f87171" />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tình trạng hiện tại">
                    <Input
                      value={item.statusHealth.currentCondition}
                      readOnly
                      prefix={<IconHeartbeat size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Lịch sử bệnh">
                    <Input
                      value={item.statusHealth.medicalHistory}
                      readOnly
                      prefix={<IconHistory size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thuốc đang dùng">
                    <Input
                      value={item.statusHealth.medication}
                      readOnly
                      prefix={<IconPill size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày hiến gần nhất">
                    <Input
                      value={item.statusHealth.lastDonationDate}
                      readOnly
                      prefix={<IconCalendarTime size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Các bệnh mắc phải">
                    <Input
                      value={item.statusHealth.diseases.join(", ")}
                      readOnly
                      prefix={<IconVirus size={16} color="#f87171" />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Ảnh giấy khám sức khỏe">
                    <img
                      src={item.statusHealth.imgHealth}
                      alt="Giấy khám sức khỏe"
                      style={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ảnh CCCD">
                    <img
                      src={item.cccd}
                      alt="Ảnh CCCD"
                      style={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Modal>
          </Form>
        </div>
      ))}
    </motion.div>
  );
}
