import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Descriptions, Pagination } from "antd";
import {
  IconClock,
  IconUser,
  IconDroplet,
  IconMapPin,
  IconActivityHeartbeat,
} from "@tabler/icons-react";
import useDonateBloodService from "../../../../hooks/RegistrationForm/useDonateBloodService";

export default function FormViewDonate() {
  const { getAllDonateBloods } = useDonateBloodService();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const res = await getAllDonateBloods(page, pageSize);
      const formattedList = res.data.results.map(
        (item: any, index: number) => ({
          key: item.donate_id,
          stt: (page - 1) * pageSize + index + 1,
          fullName: item.infor_health?.user_id?.fullname || "Chưa có tên",
          dob: item.infor_health?.user_id?.dob
            ? new Date(item.infor_health.user_id.dob).toLocaleDateString(
                "vi-VN"
              )
            : "Chưa có ngày sinh",
          phone: item.infor_health?.user_id?.phone || "Chưa có số điện thoại",
          roleDonation: item.roleDonation || "Chưa có vai trò",
          bloodType: item.blood_id?.blood_id || "Chưa có nhóm máu",
          location:
            item.centralBlood_id?.centralBlood_name || "Chưa có địa điểm",
          status: item.status_donate || "Chưa có trạng thái",
          raw: item,
        })
      );
      setData(formattedList);
      setPagination({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        total: res.data.meta.total,
      });
    } catch (error) {
      console.error("Lấy dữ liệu đăng ký hiến máu lỗi:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleTableChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  };

  const showDetailModal = (record: any) => {
    setSelectedRecord(record.raw);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconClock size={16} /> STT
        </span>
      ),
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconUser size={16} /> Họ tên
        </span>
      ),
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconDroplet size={16} /> Nhóm máu
        </span>
      ),
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconMapPin size={16} /> Địa điểm
        </span>
      ),
      dataIndex: "location",
      key: "location",
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconClock size={16} /> Trạng thái
        </span>
      ),
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => {
        let color = "orange";
        if (status === "COMPLETED") color = "green";
        else if (status === "CANCELLED") color = "red";
        return (
          <Tag color={color} className="font-semibold">
            {status}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          Hành động
        </span>
      ),
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => showDetailModal(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-red-700 flex items-center gap-2">
        <IconClock size={24} className="text-red-700" />
        Danh Sách Đăng Ký Hiến Máu
      </h2>

      <div className="flex-grow overflow-auto">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          rowClassName={() => "hover:bg-red-50"}
          size="small"
          bordered
          scroll={{ x: "max-content" }}
        />
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handleTableChange}
          onShowSizeChange={(current, size) => fetchData(1, size)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`
          }
        />
      </div>

      <Modal
        title={`Chi tiết đăng ký của ${
          selectedRecord?.infor_health?.user_id?.fullname || ""
        }`}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Họ tên">
              {selectedRecord.infor_health?.user_id?.fullname || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRecord.infor_health?.user_id?.email || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {selectedRecord.infor_health?.user_id?.gender || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {selectedRecord.date_register
                ? new Date(selectedRecord.date_register).toLocaleString("vi-VN")
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hiến">
              {selectedRecord.date_donate
                ? new Date(selectedRecord.date_donate).toLocaleString("vi-VN")
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đăng ký">
              {selectedRecord.status_regist || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái hiến">
              {selectedRecord.status_donate || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Chiều cao (cm)">
              {selectedRecord.infor_health?.height ?? "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Cân nặng (kg)">
              {selectedRecord.infor_health?.weight_decimal ?? "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Huyết áp">
              {selectedRecord.infor_health?.blood_pressure ?? "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Tiền sử bệnh lý">
              {selectedRecord.infor_health?.medical_history || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trung tâm hiến máu">
              {selectedRecord.centralBlood_id?.centralBlood_name || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ trung tâm">
              {selectedRecord.centralBlood_id?.centralBlood_address ||
                "Không có"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu chi tiết</p>
        )}
      </Modal>
    </div>
  );
}
