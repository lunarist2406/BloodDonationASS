import { Table, Tag, Button, Modal, Descriptions, Pagination, message } from "antd";
import { useEffect, useState } from "react";
import {
  IconClock,
  IconUser,
  IconCalendar,
  IconDroplet,
  IconMapPin,
  IconReload,
} from "@tabler/icons-react";
import useDonateBloodService from "../../../../hooks/RegistrationForm/useDonateBloodService";
import useBloodService from "../../../../hooks/Blood/useBloodService";


export default function RegisterBloodTable({ refresh }: { refresh?: boolean }) {
  const { getDonateHistoryByUser,deleteDonateBlood } = useDonateBloodService();
  const { getBloodById } = useBloodService();

  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [refresh]);

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await getDonateHistoryByUser();
      const pendingList = res.data.filter((item: any) => item.status_regist === "PENDING");

      const paginated = pendingList.slice((page - 1) * pageSize, page * pageSize);

      const formatted = await Promise.all(
        paginated.map(async (item: any, index: number) => {
          let bloodDisplay = "Chưa có nhóm máu";
          if (item.blood_id?.blood_id) {
            try {
              const blood = (await getBloodById(item.blood_id.blood_id)).data;
              if (blood?.blood_type_id?.blood_name && blood?.rh_id?.blood_Rh) {
                bloodDisplay = blood.blood_type_id.blood_name + blood.rh_id.blood_Rh;
              }
            } catch (e) {}
          }

          return {
            key: item.donate_id,
            stt: (page - 1) * pageSize + index + 1,
            fullName: item.infor_health?.user_id?.fullname || "Chưa có tên",
            bloodType: bloodDisplay,
            location: item.centralBlood_id?.centralBlood_name || "Chưa có địa điểm",
            status: item.status_regist || "Chưa có trạng thái",
            registerDate: item.date_register,
            donateDate: item.date_donate,
            raw: item,
          };
        })
      );

      setData(formatted);
      setPagination({ current: page, pageSize, total: pendingList.length });
    } catch (err) {
      console.error("Lỗi fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <span className="flex justify-center gap-1 text-red-800"><IconClock size={16} /> STT</span>,
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
    },
    {
      title: <span className="flex justify-center gap-1 text-red-800"><IconUser size={16} /> Họ tên</span>,
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
    },
    {
      title: <span className="flex justify-center gap-1 text-red-800"><IconCalendar size={16} /> Ngày hiến</span>,
      dataIndex: "donateDate",
      key: "donateDate",
      align: "center" as const,
      render: (date: string) => (date ? new Date(date).toLocaleString("vi-VN") : "Không có"),
    },
    {
      title: <span className="flex justify-center gap-1 text-red-800"><IconDroplet size={16} /> Nhóm máu</span>,
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center" as const,
    },
    {
      title: <span className="flex justify-center gap-1 text-red-800"><IconMapPin size={16} /> Địa điểm</span>,
      dataIndex: "location",
      key: "location",
      align: "center" as const,
    },
    {
      title: <span className="flex justify-center gap-1 text-red-800"><IconClock size={16} /> Trạng thái</span>,
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => {
        let color = "orange";
        if (status === "COMPLETED") color = "green";
        else if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
  title: <span className="text-red-800">Hành động</span>,
  key: "action",
  align: "center" as const,
  render: (_: any, record: any) => (
    <div className="flex gap-2 justify-center">
      <Button type="link" onClick={() => openModal(record)}>Chi tiết</Button>
      {record.status !== "CANCELLED" && (
        <Button
          type="link"
          danger
          disabled={record.raw?.status_donate === "CANCELLED"}
          onClick={() => {
            Modal.confirm({
              title: "Xác nhận huỷ đăng ký?",
              content: "Bạn có chắc chắn muốn huỷ đăng ký hiến máu này không?",
              okText: "Huỷ đăng ký",
              okType: "danger",
              cancelText: "Không",
              onOk: async () => {
                try {
                  await deleteDonateBlood(record.key)
                  message.success("Huỷ đăng ký thành công!");
                  fetchData(pagination.current, pagination.pageSize);
                } catch (err) {
                  message.error("Huỷ đăng ký thất bại!");
                }
              },
            });
          }}
        >
          Huỷ đăng ký
        </Button>
      )}
    </div>
  ),
},
  ];

  const openModal = (record: any) => {
    setSelectedRecord(record.raw);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
          <IconClock size={20} /> Thông Tin Đã Đăng Ký
        </h2>
        <Button
          className="cursor-pointer"
          icon={<IconReload />}
          onClick={() => fetchData(pagination.current, pagination.pageSize)}
          loading={loading}
        >
          Tải lại
        </Button>
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
        />
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => fetchData(page, pageSize)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`
          }
        />
      </div>

      <Modal
        title={`Chi tiết đăng ký`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={<Button onClick={closeModal}>Đóng</Button>}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Họ tên">
              {selectedRecord.infor_health?.user_id?.fullname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRecord.infor_health?.user_id?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {selectedRecord.infor_health?.user_id?.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {new Date(selectedRecord.date_register).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hiến">
              {selectedRecord.date_donate
                ? new Date(selectedRecord.date_donate).toLocaleString("vi-VN")
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đăng ký">
              {selectedRecord.status_regist}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái hiến máu">
              {selectedRecord.status_donate}
            </Descriptions.Item>
            <Descriptions.Item label="Tiền sử bệnh lý">
              {selectedRecord.infor_health?.medical_history}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
