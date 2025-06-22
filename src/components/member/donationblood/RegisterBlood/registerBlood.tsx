import {
  IconUser,
  IconCalendar,
  IconPhone,
  IconMapPin,
  IconDroplet,
  IconClock,
  IconUserCircle,
  IconChevronRight,
  IconChevronLeft,
  IconUserCheck,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterBlood } from "../../../../hooks/RegistrationForm/useRegisterBlood";
import FormRegisterBlood from "./FormRegisterBlood";
import FormHealth from "../FormHealth";
import { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Descriptions, Pagination } from "antd";
import useDonateBloodService from "../../../../hooks/RegistrationForm/useDonateBloodService";

export default function RegisterBlood() {
  interface MyProps {
    label: string;
    icon: React.ElementType;
    delay?: number;
  }
  const { waitingList, setWaitingList } = useRegisterBlood();
  const [currentStep, setCurrentStep] = useState<"health" | "register">(
    "health"
  );
  const [loading, setLoading] = useState(false);
  const { getAllDonateBloods } = useDonateBloodService();

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const res = await getAllDonateBloods(page, pageSize);
      // Map API response to table data
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
          raw: item, // giữ data gốc để mở chi tiết
        })
      );

      setWaitingList(formattedList);
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

  // Handle pagination change
  const handleTableChange = (paginationData: any) => {
    fetchData(paginationData.current, paginationData.pageSize);
  };

  // Mở modal chi tiết
  const showDetailModal = (record: any) => {
    setSelectedRecord(record.raw);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  // Antd Table columns
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
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <motion.h4
        initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
        whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 ml-5 pt-5"
      >
        <IconDroplet size={20} className="text-red-500" />
        Đăng Ký Hiến Máu
      </motion.h4>
      <div className="grid grid-cols-20 gap-4 px-5 mb-10">
        {/* Form */}
        <div className="col-span-7">
          <AnimatePresence mode="wait">
            {currentStep === "health" ? (
              <motion.div
                key="form-health"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setCurrentStep("register")}
                  className="mb-5 px-41 py-2 bg-red-500 text-white rounded items-center gap-2 flex"
                >
                  <span className="text-white">Đăng ký hiến máu</span>
                  <IconChevronRight
                    size={20}
                    stroke={2}
                    className="cursor-pointer"
                    color="white"
                  />
                </button>
                <FormHealth />
              </motion.div>
            ) : (
              <motion.div
                key="form-register"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setCurrentStep("health")}
                  className="mb-5 px-34 py-2 bg-red-500 text-white rounded items-center gap-2 flex"
                >
                  <IconChevronLeft
                    size={20}
                    stroke={2}
                    className="cursor-pointer"
                    color="white"
                  />
                  <span className="text-white">Điền Thông Tin Sức Khỏe</span>
                </button>
                <FormRegisterBlood />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bảng dữ liệu */}
        <motion.div
          className="col-span-13"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-red-700 flex items-center gap-2">
              <IconClock size={24} className="text-red-700" />
              Thông Tin Đã Đăng Ký
            </h2>

            {/* Table scrollable và tự co chiều cao */}
            <div className="flex-grow overflow-auto">
              <Table
                columns={columns}
                dataSource={waitingList}
                loading={loading}
                pagination={false}
                rowClassName={() => "hover:bg-red-50"}
                size="small"
                bordered
                scroll={{ x: "max-content" }}
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
          </div>
        </motion.div>
      </div>

      {/* Modal chi tiết */}
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
