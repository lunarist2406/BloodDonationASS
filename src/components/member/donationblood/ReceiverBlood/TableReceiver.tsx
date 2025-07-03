import {
  Form,
  Input,
  Row,
  Col,
  Typography,
  Button,
  Spin,
} from "antd";
import {
  IconMail,
  IconActivityHeartbeat,
  IconBuildingHospital,
  IconStar,
  IconWeight,
  IconHistory,
  IconDroplet,
  IconHeart,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useReceiverService from "../../../../hooks/Receiver/useReceiverService";
import useBloodService from "../../../../hooks/Blood/useBloodService";

const { Title } = Typography;

export default function TableReceiverBlood() {
  const { getReceiverHistoryById } = useReceiverService();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {getBloodById} = useBloodService();

  const fetchData = async () => {
  setLoading(true);
  try {
    const res = await getReceiverHistoryById();
    const all = res?.data|| [];

    const pendingList = all
      .filter((item: any) => item.status_donate === "PENDING")
      .sort(
        (a: any, b: any) =>
          new Date(b.date_register).getTime() - new Date(a.date_register).getTime()
      );
      console.log("Data pending",pendingList)
    if (!pendingList.length) {
      setData([]);
      return;
    }

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
          id: item.receiver_id,
          fullName: item.user_id?.fullname || "Chưa có tên",
          dob: item.user_id?.dob || "Không rõ",
          phone: item.user_id?.phone || "Không rõ",
          email: item.user_id?.email || "Không rõ",
          gender: item.user_id?.gender || "Không rõ",
          roleDonation: item.role || "Không rõ",
          bloodType: bloodDisplay,
          location: item.centralBlood_id?.centralBlood_name || "Không rõ",
          status: item.status_donate || "Không rõ",
          hospital: item.centralBlood_id?.centralBlood_name || "Không rõ",
          level: item.level || "Không rõ",
          cccd: item.user_id?.cccd_img || "",
          type: item.type || "Không rõ",
          ml: item.ml || 0,
          unit: item.unit || 0,
          dateRegister: item.date_register,
          dateDonate: item.date_receiver,
          statusHealth: {
            height: item.infor_health?.height || "",
            weight: item.infor_health?.weight_decimal || "",
            bloodPressure: item.infor_health?.blood_pressure || "",
            currentCondition: item.infor_health?.status_health || "",
            medicalHistory: item.infor_health?.medical_history || "",
            medication: item.infor_health?.medication || "",
            lastDonationDate: item.infor_health?.latest_donate
              ? new Date(item.infor_health.latest_donate).toLocaleDateString("vi-VN")
              : "",
            diseases: item.infor_health?.diseases || [],
            imgHealth: item.infor_health?.img_health || "",
          },
        };

      })
    );

    console.log("Lịch sử nhận máu:", mappedData);

    // ✅ Chỉ lấy đơn gần nhất (mới nhất)
    setData(mappedData.slice(0, 1));
  } catch (err) {
    console.error("Lỗi fetch lịch sử nhận máu:", err);
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
  console.log(data)
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
            Không có đơn đăng ký nhận máu nào
          </h5>
        </motion.div>
        <p className="text-gray-500 mb-4 text-center">
          Bạn chưa có đơn đăng ký nhận máu nào trong hệ thống.
          <br />
          Hãy đăng ký để được hỗ trợ khi cần!
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
        Đơn Gần Nhất đang chờ duyệt
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
                <Form.Item label="Loại hiến máu">
                  <Input
                    value={item.type}
                    readOnly
                    prefix={<IconStar size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Thể tích (ml)">
                  <Input
                    value={`${item.ml} ml`}
                    readOnly
                    prefix={<IconWeight size={16} color="#f87171" />}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Số đơn vị">
                  <Input
                    value={`${item.unit} đơn vị`}
                    readOnly
                    prefix={<IconHeart size={16} color="#f87171" />}
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
