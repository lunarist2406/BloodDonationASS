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
  Dropdown,
  Menu,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import useReceiverService from "../../../hooks/Receiver/useReceiverService";
import { IconHeartbeat } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function ControllingReceiver() {
  const { getAllReceiverBloods, deleteReceiver, updateReceiver } = useReceiverService();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [allData, setAllData] = useState<any[]>([]);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const res = await getAllReceiverBloods(page, pageSize, "");
      const formatted = res.data.results.map((item: any, index: number) => ({
        key: item.receiver_id,
        stt: (page - 1) * pageSize + index + 1,
        fullName: item.user_id?.fullname || "Không có tên",
        bloodType:
          item.blood_id?.blood_type_id?.blood_name +
            " (" +
            item.blood_id?.rh_id?.blood_Rh +
            ")" || "Không rõ",
        center: item.centralBlood_id?.centralBlood_name || "Không rõ",
        status: item.status || "Chưa rõ",
        raw: item,
      }));

      setAllData(formatted);
      setData(formatted);
      setPagination({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        total: res.data.meta.total,
      });
    } catch (err) {
      console.error("Lỗi tải danh sách nhận máu:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteReceiver(id);
      message.success("Xóa thành công");
      fetchData(pagination.current, pagination.pageSize);
    } catch {
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
        ...record,
        status,
      };
      await updateReceiver(record.receiver_id, payload);
      message.success("Cập nhật trạng thái thành công");
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
      message.error("Cập nhật thất bại");
    }
  };

  const statusMenu = (record: any) => (
    <Menu>
      <Menu.Item onClick={() => handleStatusUpdate(record.raw, "PENDING")}>
        <ClockCircleOutlined /> Đang chờ
      </Menu.Item>
      <Menu.Item onClick={() => handleStatusUpdate(record.raw, "COMPLETED")}>
        <CheckCircleOutlined /> Đã nhận
      </Menu.Item>
      <Menu.Item onClick={() => handleStatusUpdate(record.raw, "CANCELLED")}>
        <CloseCircleOutlined /> Hủy
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
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
      title: "Trung tâm",
      dataIndex: "center",
      key: "center",
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string, record: any) => {
        let color = "gold";
        if (status === "COMPLETED") color = "green";
        else if (status === "PENDING") color = "orange";
        else if (status === "CANCELLED") color = "red";
        return (
          <Dropdown overlay={statusMenu(record)}>
            <Tag color={color} style={{ cursor: "pointer" }}>
              {status}
            </Tag>
          </Dropdown>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex justify-center gap-2">
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedRecord(record.raw);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xoá?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <motion.h2
          initial={{ x: 0, color: "#000" }}
          whileHover={{ x: 8, color: "#f43f5e" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="self-start text-base font-bold flex items-center gap-2"
        >
          <IconHeartbeat size={20} className="text-red-500" />
          Quản Lý Đơn Nhận Máu Khẩn Cấp
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
              fetchData(pagination.current, pagination.pageSize)
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
          scroll={{ x: "max-content" }}
          style={{minHeight:500}}
        />
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, size) => fetchData(page, size)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`
          }
        />
      </div>

      <Modal
        title={`Chi tiết đơn nhận máu`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={<Button onClick={() => setIsModalOpen(false)}>Đóng</Button>}
        width={700}
      >
        {selectedRecord ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Họ tên">
              {selectedRecord.user_id?.fullname || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRecord.user_id?.email || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày nhận">
              {selectedRecord.date_receiver
                ? new Date(selectedRecord.date_receiver).toLocaleString("vi-VN")
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng (ml)">
              {selectedRecord.ml || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Đơn vị máu">
              {selectedRecord.unit || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trung tâm">
              {selectedRecord.centralBlood_id?.centralBlood_name || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ trung tâm">
              {selectedRecord.centralBlood_id?.centralBlood_address || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {selectedRecord.status || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu chi tiết</p>
        )}
      </Modal>
    </div>
  );
}
