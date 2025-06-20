import React, { useEffect, useState } from "react";
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

export default function ProfileHealth() {
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
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
      setHealthInfo(res.data.data);
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
              <IconHeartbeat size={18} /> Mã Nhóm Máu
            </span>
          }
        >
          {healthInfo?.blood_id.blood_id || "Chưa có"}
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
