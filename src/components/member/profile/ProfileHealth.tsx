import { useEffect, useState } from "react";
import { Card, Descriptions, Spin } from "antd";
import {
  IconHeartbeat,
  IconArrowBigDownLines,
  IconWeight,
  IconActivityHeartbeat,
  IconNotes,
  IconCalendarTime,
  IconStatusChange,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { api } from "../../config/axios/axiosInstance";
import { useAuth } from "../../../hooks/User/useAuth";
import useBloodService from "../../../hooks/Blood/useBloodService";

export default function ProfileHealth() {
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [bloodDetail, setBloodDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { getBloodById } = useBloodService(); // <-- hook lấy chi tiết máu

  const fetchHealthInfo = async () => {
    try {
      const res = await api.get(
        "http://localhost:3000/api/v1/infor-health/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const info = res.data.data;
      setHealthInfo(info);

      if (info?.blood_id?.blood_id) {
        const bloodRes = await getBloodById(info.blood_id.blood_id);
        setBloodDetail(bloodRes?.data);
      }

      console.log("Thông tin sức khỏe:", res);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin sức khỏe", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthInfo();
  }, []);

  if (loading) return <Spin tip="Đang tải thông tin..." />;

  const bloodDisplay =
    bloodDetail?.blood_type_id?.blood_name && bloodDetail?.rh_id?.blood_Rh
      ? `${bloodDetail.blood_type_id.blood_name}${bloodDetail.rh_id.blood_Rh}`
      : "Chưa rõ";

  return (
    <Card
      title="Thông Tin Sức Khỏe Cá Nhân"
      className="shadow-lg rounded-lg"
      bordered={false}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconHeartbeat size={18} /> Nhóm Máu
            </span>
          }
        >
          {bloodDisplay}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconArrowBigDownLines size={18} /> Chiều cao
            </span>
          }
        >
          {healthInfo?.height} cm
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconWeight size={18} /> Cân nặng
            </span>
          }
        >
          {healthInfo?.weight_decimal} kg
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconActivityHeartbeat size={18} /> Huyết áp
            </span>
          }
        >
          {healthInfo?.blood_pressure} mmHg
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconNotes size={18} /> Tiền sử bệnh
            </span>
          }
        >
          {healthInfo?.medical_history}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconCalendarTime size={18} /> Lần hiến gần nhất
            </span>
          }
        >
          {dayjs(healthInfo?.latest_donate).format("DD/MM/YYYY")}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <IconStatusChange size={18} /> Tình trạng sức khỏe
            </span>
          }
        >
          {healthInfo?.status_health}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
