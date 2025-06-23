import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Typography, Button, Spin } from "antd";
import {

  IconMail,
  IconMapPin,
  IconActivityHeartbeat,
  IconBuildingHospital,
  IconDroplet,
  IconHistory,

} from "@tabler/icons-react";
import { motion } from "framer-motion";
import useDonateBloodService from "../../../../hooks/RegistrationForm/useDonateBloodService";
import useBloodService from "../../../../hooks/Blood/useBloodService";

const { Title } = Typography;

export default function TableDonateBlood() {
  const { getDonateHistoryByUser } = useDonateBloodService();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getBloodById } = useBloodService();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDonateHistoryByUser();

      // lọc đơn trạng thái PENDING (dựa vào status_regist)
      const pendingList = res.data
        .filter((item: any) => item.status_regist === "PENDING")
        .sort(
          (a: any, b: any) =>
            new Date(b.date_register).getTime() -
            new Date(a.date_register).getTime()
        );

      // map dữ liệu đúng structure hiện tại của API
      const mappedData = await Promise.all(
        pendingList.map(async (item: any) => {
          let bloodDisplay = "Chưa có nhóm máu";

          if (item.blood_id?.blood_id) {
            try {
              const res = await getBloodById(item.blood_id.blood_id);
              const blood = res.data;
              if (blood?.blood_type_id?.blood_name && blood?.rh_id?.blood_Rh) {
                bloodDisplay =
                  blood.blood_type_id.blood_name + blood.rh_id.blood_Rh;
              }
            } catch (err) {
              console.error("Lỗi lấy nhóm máu:", err);
            }
          }

          return {
            id: item.donate_id,
            dateRegister: item.date_register,
            fullName: item.infor_health?.user_id?.fullname || "Chưa có tên",
            gender: item.infor_health?.user_id?.gender || "Chưa có giới tính",
            email: item.infor_health?.user_id?.email || "Chưa có email",
            bloodType: bloodDisplay,
            location:
              item.centralBlood_id?.centralBlood_name || "Chưa có khu vực",
            status: item.status_regist || "Chưa có trạng thái",
            hospital:
              item.centralBlood_id?.centralBlood_name || "Chưa xác định",
            level: item.level || "Chưa phân loại",
            dateDonate: item.date_donate,
            cccd: item.infor_health?.user_id?.cccd || "",
            statusHealth: {
              height: item.infor_health?.height || "",
              weight: item.infor_health?.weight_decimal || "",
              bloodPressure: item.infor_health?.blood_pressure || "",
              currentCondition: item.infor_health?.status_health || "",
              medicalHistory: item.infor_health?.medical_history || "",
              medication: item.infor_health?.medication || "",
              lastDonationDate: item.infor_health?.latest_donate
                ? new Date(item.infor_health.latest_donate).toLocaleDateString(
                    "vi-VN"
                  )
                : "",
              diseases: item.infor_health?.diseases || [],
              imgHealth: item.infor_health?.img_health || "",
            },
          };
        })
      );

      console.log("Lịch sử hiến máu:", mappedData);
      setData(mappedData.slice(0, 1));
    } catch (error) {
      console.error("Lấy lịch sử hiến máu lỗi:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <Spin size="large" />
      </div>
    );

  if (data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg">
        <IconHistory size={48} color="#f87171" className="mb-4" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <h5 className="text-[#d32f2f] text-base font-semibold mb-2 text-center">
            Không có đơn đăng ký hiến máu đang chờ duyệt
          </h5>
        </motion.div>
        <p className="text-gray-500 mb-4 text-center">
          Bạn chưa có đơn đăng ký hiến máu nào ở trạng thái <b>PENDING</b>.
          <br />
          Hãy đăng ký để tham gia hiến máu và giúp đỡ cộng đồng!
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <Title level={3} style={{ color: "#d32f2f", marginBottom: 24 }}>
        Đơn đăng ký hiến máu gần nhất đang chờ duyệt
      </Title>

      {data.map((item, index) => (
        <div
          key={item.id}
          className="mb-8 border border-gray-200 rounded-lg p-4"
        >
          <Title level={4} style={{ color: "#d32f2f" }}>
            Họ tên: {item.fullName}
          </Title>
          <div className="grid grid-cols-1 gap-2 mb-4">
            <div>
              <span className="text-red-300 font-medium">
                Thời gian đăng ký:
              </span>{" "}
              <span className="text-red-700">
                {new Date(item.dateRegister).toLocaleString("vi-VN")}
              </span>
            </div>
            <div>
              <span className="text-red-300 font-medium">Giới tính:</span>{" "}
              <span className="text-red-700">
                {item.gender === "male"
                  ? "Nam"
                  : item.gender === "female"
                  ? "Nữ"
                  : item.gender}
              </span>
            </div>
            <div>
              <span className="text-red-300 font-medium">Ngày hiến máu:</span>{" "}
              <span className="text-red-700">
                {item.dateDonate
                  ? new Date(item.dateDonate).toLocaleDateString("vi-VN")
                  : "Chưa xác định"}
              </span>
            </div>
          </div>

          <Form layout="vertical">
            <Row gutter={16}>
              {/* Xóa ngày sinh và số điện thoại */}
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
              <Col span={24}>
                <Form.Item label="Bệnh viện tiếp nhận">
                  <Input
                    value={item.hospital || "Chưa xác định"}
                    readOnly
                    prefix={<IconBuildingHospital size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </div>
      ))}

      <Button onClick={fetchData} className="mt-4" type="primary" danger block>
        Reload Đơn Đăng Ký
      </Button>
    </motion.div>
  );
}
