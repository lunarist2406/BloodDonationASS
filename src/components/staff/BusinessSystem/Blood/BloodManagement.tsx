import React from "react";
import { Table } from "antd";
import {
  IconHeart,
  IconBolt,
  IconId,
  IconDatabase,
  IconTestPipe,
} from "@tabler/icons-react";
import useBlood from "../../../../hooks/Blood/useBlood";

export default function BloodManagement() {
  const { blood, bloodTypes, rhs } = useBlood();

  // Columns cho bảng BloodTypes
  const bloodTypeColumns = [
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconId size={18} className="mr-2" />
          ID
        </div>
      ),
      dataIndex: "blood_type_id",
      key: "id",
      width: 100,
    },
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconHeart size={18} className="mr-2" />
          Nhóm máu
        </div>
      ),
      dataIndex: "blood_name",
      key: "name",
    },
  ];

  // Columns cho bảng Rh
  const rhColumns = [
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconBolt size={18} className="mr-2" />
          ID
        </div>
      ),
      dataIndex: "rh_id",
      key: "id",
      width: 100,
    },
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconTestPipe size={18} className="mr-2" />
          Loại Rh
        </div>
      ),
      dataIndex: "blood_Rh",
      key: "rh",
    },
  ];

  // Columns cho bảng Bloods
  const bloodColumns = [
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconDatabase size={18} className="mr-2" />
          Mã máu
        </div>
      ),
      dataIndex: "blood_id",
      key: "blood_id",
      width: 150,
    },
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconHeart size={18} className="mr-2" />
          Nhóm máu
        </div>
      ),
      dataIndex: ["blood_type_id", "blood_name"],
      key: "blood_type",
    },
    {
      title: (
        <div className="flex items-center text-red-600 font-semibold">
          <IconBolt size={18} className="mr-2" />
          Loại Rh
        </div>
      ),
      dataIndex: ["rh_id", "blood_Rh"],
      key: "rh_type",
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="flex gap-10 items-start">
        {/* Left side: Blood Types + Rh */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Nhóm máu
          </h2>
          <div className="bg-gradient-to-r from-red-100 via-red-50 to-red-100 rounded-lg p-4 mb-10 shadow-md">
            <Table
              columns={bloodTypeColumns}
              dataSource={bloodTypes}
              rowKey="blood_type_id"
              pagination={false}
              size="middle"
              bordered
              className="bg-transparent"
            />
          </div>

          <h2 className="text-xl font-semibold text-red-600 mb-4">Loại Rh</h2>
          <div className="bg-gradient-to-r from-red-100 via-red-50 to-red-100 rounded-lg p-4 shadow-md">
            <Table
              columns={rhColumns}
              dataSource={rhs}
              rowKey="rh_id"
              pagination={false}
              size="middle"
              bordered
              className="bg-transparent"
            />
          </div>
        </div>

        {/* Right side: Bloods */}
        <div className="flex-2">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Máu</h2>
          <div className="bg-gradient-to-r from-red-100 via-red-50 to-red-100 rounded-lg p-4 shadow-md">
            <Table
              columns={bloodColumns}
              dataSource={blood?.data.result || []}
              rowKey="blood_id"
              pagination={{ pageSize: 10 }}
              size="middle"
              bordered
              className="bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
