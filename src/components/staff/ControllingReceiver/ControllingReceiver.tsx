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
import { IconUserCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";
import useReceiverService from "../../../hooks/Receiver/useReceiverService";
import useBloodService from "../../../hooks/Blood/useBloodService";

export default function ControllingReceiver() {
  const { getAllReceiverBloods, deleteReceiver, updateReceiver } =
    useReceiverService();
  const {getBloodById} = useBloodService();
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

  const [allData, setAllData] = useState<any[]>([]);

const bloodCache = new Map();

const getBloodLabel = async (bloodId: string) => {
  if (bloodCache.has(bloodId)) return bloodCache.get(bloodId);

  try {
    const res = await getBloodById(bloodId);
    const label = `${res.data.blood_type_id.blood_name} (${res.data.rh_id.blood_Rh})`;
    bloodCache.set(bloodId, label);
    return label;
  } catch (err) {
    console.error("Lỗi khi lấy thông tin nhóm máu:", err);
    return "Chưa rõ";
  }
};

async function fetchData(page: number, pageSize: number) {
  setLoading(true);
  try {
    const res = await getAllReceiverBloods(page, pageSize, "");
    const rawList = res.data.results;

    const formattedList = await Promise.all(
      rawList.map(async (item: any, index: number) => {
        const bloodId = item.blood_id?.blood_id;
        const bloodLabel = bloodId ? await getBloodLabel(bloodId) : "Chưa rõ";
        
        return {
          key: item.receiver_id,
          stt: (page - 1) * pageSize + index + 1,
          fullName: item.user_id?.fullname || "Chưa có tên",
          bloodType: bloodLabel,
          location: item.centralBlood_id?.centralBlood_name || "Chưa rõ",
          status_receiver: item.status_receiver || "Chưa rõ",
          status_regist: item.status_regist || "Chưa rõ",
          raw: item,
          type: item.type || "Không có",
        };
      })
    );

    setAllData(formattedList);
    setData(formattedList);
    setPagination({
      current: res.data.meta.current,
      pageSize: res.data.meta.pageSize,
      total: res.data.meta.total,
    });
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu nhận máu:", error);
    message.error("Không thể tải danh sách nhận máu");
  } finally {
    setLoading(false);
  }
}




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
      await deleteReceiver(id);
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

  // Hàm cập nhật trạng thái, type = 'donate' hoặc 'regist' để phân biệt
const handleStatusUpdate = async (
  record: any,
  status: string,
  type: "receiver" | "regist"
) => {
  try {
    const payload = {
      blood_id: record.blood_id?.blood_id || "",
      date_receiver: record.date_receiver || new Date().toISOString(),
      ml: record.ml || 0,
      unit: record.unit || 0,
      type: record.type || "DEFAULT",
      centralBlood_id: String(record.centralBlood_id?.centralBlood_id || ""),
      status_regist: type === "regist" ? status : record.status_regist,
      status_receiver: type === "receiver" ? status : record.status_receiver,
    };
    console.log("DATA TRƯỚC KHI GỌI UPDATE: ", record);
    console.log("PAYLOAD:", payload);
    await updateReceiver(record.receiver_id, payload);
    message.success("Cập nhật trạng thái thành công");
    fetchData(pagination.current, pagination.pageSize, search);
  } catch (error) {
    message.error("Cập nhật thất bại");
    console.error("Cập nhật trạng thái lỗi:", error);
  }
};



  // Menu cho dropdown trạng thái hiến máu
  const ReceiverStatusMenu = (record: any) => (
    <Menu>
      <Menu.Item
        key="COMPLETED"
        onClick={() => handleStatusUpdate(record.raw, "COMPLETED", "receiver")}
      >
        <CheckCircleOutlined /> Hoàn thành
      </Menu.Item>
      <Menu.Item
        key="PENDING"
        onClick={() => handleStatusUpdate(record.raw, "PENDING", "receiver")}
      >
        <ClockCircleOutlined /> Đang chờ
      </Menu.Item>
      <Menu.Item
        key="CANCELLED"
        onClick={() => handleStatusUpdate(record.raw, "CANCELLED", "receiver")}
      >
        <CloseCircleOutlined /> Hủy
      </Menu.Item>
    </Menu>
  );

  // Menu cho dropdown trạng thái đăng ký
  const registStatusMenu = (record: any) => (
    <Menu>
      <Menu.Item
        key="APPROVED"
        onClick={() => handleStatusUpdate(record.raw, "APPROVED", "regist")}
      >
        <CheckCircleOutlined /> Phê duyệt
      </Menu.Item>
      <Menu.Item
        key="PENDING"
        onClick={() => handleStatusUpdate(record.raw, "PENDING", "regist")}
      >
        <ClockCircleOutlined /> Đang chờ
      </Menu.Item>
    </Menu>
  );

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
      title: "Loại",
      dataIndex: "type",
      key: "type",
      align: "center" as const,
      render: (type: string) => {
        let color = "geekblue";
        let label = type;
        if (type === "DEFAULT") {
          color = "geekblue";
          label = "Thông thường";
        } else if (type === "EMERGENCY") {
          color = "volcano";
          label = "Khẩn cấp";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      align: "center" as const,
    },
    {
      title: "Trạng thái đăng ký",
      dataIndex: "status_regist",
      key: "status_regist",
      align: "center" as const,
      render: (status: string, record: any) => {
        let color = "gold";
        if (status === "APPROVED") color = "green";
        else if (status === "PENDING") color = "orange";

        return (
          <Dropdown overlay={registStatusMenu(record)}>
            <Tag color={color} style={{ cursor: "pointer" }}>
              {status}
            </Tag>
          </Dropdown>
        );
      },
    },
    {
      title: "Trạng thái nhận máu",
      dataIndex: "status_receiver",
      key: "status_receiver",
      align: "center" as const,
      render: (status: string, record: any) => {
        let color = "gold";
        if (status === "COMPLETED") color = "green";
        else if (status === "PENDING") color = "orange";
        else if (status === "CANCELLED") color = "red";

        // Nếu trạng thái đăng ký không phải APPROVED thì chỉ hiện tag bình thường
        if (record.status_regist !== "APPROVED") {
          return <Tag color={color}>{status}</Tag>;
        }

        // Nếu đã APPROVED mới bật dropdown
        return (
          <Dropdown overlay={ReceiverStatusMenu(record)}>
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
        <div className="flex gap-2 justify-center">
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => showDetailModal(record)}
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
    <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <motion.h2
          initial={{ x: 0, color: "#000" }}
          whileHover={{ x: 8, color: "#f43f5e" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="self-start text-base font-bold flex items-center gap-2"
        >
          <IconUserCheck size={20} className="text-red-500" />
          Quản Lý Đơn Đăng Ký Nhận Máu
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
          scroll={{ x: "max-content" }}
          style={{ minHeight: "400px" }}
        />
      </div>

      {/* Pagination dính đáy luôn nè */}
      <div className="mt-auto pt-4 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => fetchData(page, pageSize)}
          onShowSizeChange={(current, size) => fetchData(1, size)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`
          }
        />
      </div>

<Modal
  title={`Chi tiết đăng ký của ${selectedRecord?.user_id?.fullname || ""}`}
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
      <Descriptions.Item label="Mã đơn nhận">
        {selectedRecord.receiver_id || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Họ tên">
        {selectedRecord.user_id?.fullname || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Email">
        {selectedRecord.user_id?.email || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Giới tính">
        {selectedRecord.user_id?.gender || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày đăng ký">
        {selectedRecord.date_register
          ? new Date(selectedRecord.date_register).toLocaleString("vi-VN")
          : "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày nhận máu">
        {selectedRecord.date_receiver
          ? new Date(selectedRecord.date_receiver).toLocaleString("vi-VN")
          : "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Trạng thái đăng ký">
        {selectedRecord.status_regist || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Trạng thái nhận máu">
        {selectedRecord.status_receiver || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Số ml máu">
        {selectedRecord.ml ?? "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Số đơn vị máu">
        {selectedRecord.unit ?? "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Loại">
        {selectedRecord.type || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Trung tâm nhận máu">
        {selectedRecord.centralBlood_id?.centralBlood_name || "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ trung tâm">
        {selectedRecord.centralBlood_id?.centralBlood_address || "Không có"}
      </Descriptions.Item>
    </Descriptions>
  ) : (
    <p>Không có dữ liệu chi tiết</p>
  )}
</Modal>

    </div>
  );
}
