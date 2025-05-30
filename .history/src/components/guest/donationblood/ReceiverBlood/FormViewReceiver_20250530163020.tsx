import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";
import {
  IconCalendar,
  IconClock,
  IconDroplet,
  IconMapPin,
  IconPhone,
  IconUser,
  IconUserCircle,
  IconBuildingHospital,
  IconActivityHeartbeat,
} from "@tabler/icons-react";
import type { RegisterBlood } from "../../../../hooks/useRegisterBlood";

interface Props {
  formData: RegisterBlood[];
}

export default function FormViewReceiver({ formData }: Props) {
  const columns: ColumnsType<RegisterBlood & { key: string; index: number }> = [
    {
      title: (
        <div className="flex items-center gap-1">
          <IconClock size={16} /> STT
        </div>
      ),
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
      fixed: "left",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconUser size={16} /> Họ tên
        </div>
      ),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconCalendar size={16} /> Ngày sinh
        </div>
      ),
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconPhone size={16} /> SĐT
        </div>
      ),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconUserCircle size={16} /> Vai trò
        </div>
      ),
      dataIndex: "roleDonation",
      key: "roleDonation",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconDroplet size={16} /> Nhóm máu
        </div>
      ),
      dataIndex: "bloodType",
      key: "bloodType",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconMapPin size={16} /> Địa điểm
        </div>
      ),
      dataIndex: "location",
      key: "location",
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconClock size={16} /> Trạng thái
        </div>
      ),
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className="text-orange-500 font-semibold">{status}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconActivityHeartbeat size={16} /> Cấp độ
        </div>
      ),
      dataIndex: "level",
      key: "level",
      render: (level) => (
        <span className="text-green-600 font-medium">
          {level || "Chưa phân loại"}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <IconBuildingHospital size={16} /> Bệnh viện
        </div>
      ),
      dataIndex: "hospital",
      key: "hospital",
      render: (hospital) => (
        <span className="text-blue-600 font-medium">
          {hospital || "Chưa chọn"}
        </span>
      ),
    },
  ];

  const dataSource = formData.map((item, index) => ({
    ...item,
    key: `${index}`,
    index,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
    <div className="bg-white rounded-xl shadow-lg p-4 h-[90%]">
      <h2 className="text-2xl font-bold mb-4 text-red-700 flex items-center gap-2">
        <IconClock size={24} className="text-red-700" />
        Danh Sách Người Đăng Ký Nhan
      </h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        bordered
        size="middle"
        style={{
        minHeight: "590px",
        }}
        className="text-center"
      />
      <style>
        {`
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
          text-align: center !important;
          vertical-align: middle !important;
        }
        `}
      </style>
    </div>
    </motion.div>
  );
}
