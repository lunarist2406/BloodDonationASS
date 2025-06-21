import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Pagination,
  Input,
  Popconfirm,
  message,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import useDonateBloodService from "../../../hooks/RegistrationForm/useDonateBloodService";
import { IconUserCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";
export default function ControllingDonate() {
  const { getAllDonateBloods, deleteDonateBlood, updateDonateBlood } =
    useDonateBloodService();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  const [allData, setAllData] = useState<any[]>([]); // giữ full data

  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const res = await getAllDonateBloods(page, pageSize, "");
      const formattedList = res.data.results.map(
        (item: any, index: number) => ({
          key: item.donate_id,
          stt: (page - 1) * pageSize + index + 1,
          fullName: item.infor_health?.user_id?.fullname || "Chưa có tên",
          bloodType: item.blood_id?.blood_id || "Chưa có nhóm máu",
          location:
            item.centralBlood_id?.centralBlood_name || "Chưa có địa điểm",
          status: item.status_donate || "Chưa có trạng thái",
          raw: item,
        })
      );

      setAllData(formattedList); // lưu nguyên bản
      setData(formattedList); // dữ liệu hiện tại hiển thị
      setPagination({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        total: res.data.meta.total,
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hiến máu:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleTableChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize, search);
  };

  const showDetailModal = (record: any) => {
    setSelectedRecord(record.raw);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDonateBlood(id);
      message.success("Xóa đơn đăng ký thành công");
      fetchData(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };
  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = allData.filter((item) =>
      item.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setData(filtered);
  };

  const handleStatusUpdate = async (record: any, status: string) => {
    try {
      const payload = {
        date_donate: record.date_donate,
        centralBlood_id: record.centralBlood_id?.centralBlood_id,
        ml: record.ml || 0,
        unit: record.unit || 0,
        status_regist: record.status_regist,
        status_donate: status,
      };
      await updateDonateBlood(record.donate_id, payload);
      message.success("Cập nhật trạng thái thành công");
      fetchData(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Cập nhật thất bại");
      console.error("Cập nhật trạng thái lỗi:", error);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center" as const,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center" as const,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => {
        let color = "orange";
        if (status === "COMPLETED") color = "green";
        else if (status === "CANCELLED") color = "red";
        else if (status === "PENDING") color = "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-center">
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => showDetailModal(record)}
          />
          <Button
            icon={<ClockCircleOutlined />}
            onClick={() => handleStatusUpdate(record.raw, "PENDING")}
          />
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => handleStatusUpdate(record.raw, "COMPLETED")}
          />
          <Button
            icon={<CloseCircleOutlined />}
            danger
            onClick={() => handleStatusUpdate(record.raw, "CANCELLED")}
          />
          <Popconfirm
            title="Xóa đơn đăng ký này?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
          whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
          transition={{ type: "spring", stiffness: 300 }}
          className="self-start text-base font-bold flex items-center gap-2  pt-5"
        >
          <IconUserCheck size={20} className="text-red-500" />
          Quản Lý Đơn Đăng Ký Hiến Máu
        </motion.h2>
        <div className="flex gap-2">
          <Input
            placeholder="Tìm kiếm theo tên"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              fetchData(pagination.current, pagination.pageSize, search)
            }
          >
            Làm mới
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          rowClassName={() => "hover:bg-red-50"}
          size="small"
          bordered
          scroll={{ y: 400 }}
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
          onShowSizeChange={(current, size) => fetchData(1, size, search)}
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
