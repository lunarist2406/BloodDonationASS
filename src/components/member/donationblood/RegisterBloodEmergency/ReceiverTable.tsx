import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconDroplet,
  IconClock,
  IconReload,
  IconUserCheck
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Descriptions,
  Pagination,
  Form,
  Select,
  DatePicker,
  Input,
  message
} from "antd";
import useReceiverService from "../../../../hooks/Receiver/useReceiverService";
import useBloodService from "../../../../hooks/Blood/useBloodService";
import dayjs from "dayjs";
import useCentralService from "../../../../hooks/CentralBlood/useCentralService";

export default function ReceiverTable({ refresh }: { refresh?: boolean }) {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
//   const [bloodOptions, setBloodOptions] = useState<any[]>([]);

  const { getReceiverHistoryById, updateReceiver } = useReceiverService();
  const { getBloodById, getAllBloods } = useBloodService();
  const {getAllCentral} = useCentralService();
  const [bloods, setBloods] = useState([]);
const [centers, setCenters] = useState([]);
  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [refresh]);

  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const res = await getReceiverHistoryById();

      const paginated = res.data.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      const formatted = await Promise.all(
        paginated.map(async (item: any, index: number) => {
          let bloodDisplay = "Chưa có nhóm máu";
          if (item.blood_id?.blood_id) {
            try {
              const bloodRes = await getBloodById(item.blood_id.blood_id);
              const blood = bloodRes.data;
              if (blood?.blood_type_id?.blood_name && blood?.rh_id?.blood_Rh) {
                bloodDisplay =
                  blood.blood_type_id.blood_name + blood.rh_id.blood_Rh;
              }
            } catch (err) {
              console.error("Lỗi lấy nhóm máu:", err);
            }
          }

          return {
            key: item.receiver_id,
            stt: (page - 1) * pageSize + index + 1,
            fullName: item.user_id?.fullname || "Không có tên",
            dob: item.user_id?.dob
              ? new Date(item.user_id.dob).toLocaleDateString("vi-VN")
              : "Không có",
            phone: item.user_id?.phone || "Không có",
            bloodType: bloodDisplay,
            location:
              item.centralBlood_id?.centralBlood_name || "Không có địa điểm",
            status: item.status_regist || "Không có",
            raw: item,
          };
        })
      );

      setDataList(formatted);
      setPagination({
        current: page,
        pageSize,
        total: res.data.length,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách nhận máu:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  const fetchOptions = async () => {
    try {
      const [bloodsRes, centersRes] = await Promise.all([
        getAllBloods(1, 100),
        getAllCentral(1, 100),
      ]);
      setBloods(bloodsRes.data.result);
      setCenters(centersRes.data.result);
    } catch (err) {
      console.error("Lỗi lấy danh sách máu hoặc trung tâm:", err);
    }
  };
  fetchOptions();
}, []);


  const showDetailModal = (record: any) => {
    setSelectedRecord(record.raw);
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditData(record.raw);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      const updatedPayload = {
        ...editData,
        ...values,
        user_id: typeof editData.user_id === "object" ? editData.user_id.user_id : editData.user_id,
        centralBlood_id: String(values.centralBlood_id),
        date_receiver: values.date_receiver?.toISOString(),
      };



      await updateReceiver(editData.receiver_id, updatedPayload);
      message.success("Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      message.error("Cập nhật thất bại!");
    }
  };

  const columns = [
    {
      title: <span className="flex items-center gap-1 text-red-800"><IconClock size={16}/> STT</span>,
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
    },
    {
      title: <span className="flex items-center gap-1 text-red-800"><IconUser size={16}/> Họ tên</span>,
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
    },

    {
      title: <span className="flex items-center gap-1 text-red-800"><IconPhone size={16}/>Số điện thoại </span>,
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
    },
    {
      title: <span className="flex items-center gap-1 text-red-800"><IconDroplet size={16}/> Nhóm máu</span>,
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center" as const,
    },
    {
      title: <span className="flex items-center gap-1 text-red-800"><IconMapPin size={16}/> Địa điểm</span>,
      dataIndex: "location",
      key: "location",
      align: "center" as const,
    },
    {
      title: <span className="flex items-center gap-1 text-red-800">Trạng thái</span>,
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => {
        let color = "orange";
        if (status === "APPROVED") color = "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => showDetailModal(record)}>Chi tiết</Button>
          <Button type="link" onClick={() => openEditModal(record)}>Chỉnh sửa</Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
          <IconUserCheck size={22}/> Đơn Nhận Máu Đã Tạo
        </h2>
        <Button icon={<IconReload />} onClick={() => fetchData(pagination.current, pagination.pageSize)} loading={loading}>
          Tải lại
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataList}
        loading={loading}
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
        rowClassName={() => "hover:bg-red-50"}
        size="middle"
      />
      <div className="mt-auto pt-4 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => fetchData(page, pageSize)}
          onShowSizeChange={( size) => fetchData(1, size)}
          showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} bản ghi`}
        />
      </div>
      <Modal
        title={`Chi tiết người nhận: ${selectedRecord?.user_id?.fullname || ""}`}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[<Button key="close" onClick={handleModalClose}>Đóng</Button>]}
        width={700}
      >
        {selectedRecord ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Họ tên">{selectedRecord.user_id?.fullname || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedRecord.user_id?.email || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{selectedRecord.user_id?.gender || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">{selectedRecord.date_register ? new Date(selectedRecord.date_register).toLocaleString("vi-VN") : "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Ngày nhận">{selectedRecord.date_receiver ? new Date(selectedRecord.date_receiver).toLocaleString("vi-VN") : "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái đăng ký">{selectedRecord.status_regist || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái nhận">{selectedRecord.status_receiver || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Số ml">{selectedRecord.ml ?? "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Số đơn vị">{selectedRecord.unit ?? "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Trung tâm">{selectedRecord.centralBlood_id?.centralBlood_name || "Không có"}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedRecord.centralBlood_id?.centralBlood_address || "Không có"}</Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu chi tiết</p>
        )}
      </Modal>

      <Modal
        title="Cập nhật đơn nhận máu"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        {editData && (
          <Form
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              centralBlood_id: editData.centralBlood_id?.centralBlood_id,
              type: editData.type || "DEFAULT",
              date_receiver: editData.date_receiver ? dayjs(editData.date_receiver) : null,
              blood_id: editData.blood_id?.blood_id,
              priority: editData.priority,
              ml: editData.ml,
              unit: editData.unit,
            }}
          >
          <Form.Item name="centralBlood_id" label="Trung Tâm Hiến Máu">
            <Select placeholder="Chọn trung tâm">
              {centers.map((center:any) => (
                <Select.Option key={center.centralBlood_id} value={center.centralBlood_id}>
                  {center.centralBlood_name} - {center.centralBlood_address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="type" label="Mức độ ưu tiên">
            <Select placeholder="Chọn mức độ">
              <Select.Option value="DEFAULT">Bình thường</Select.Option>
              <Select.Option value="EMERGENCY">Khẩn cấp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="blood_id" label="Nhóm máu">
            <Select placeholder="Chọn nhóm máu">
              {bloods.map((blood:any) => (
                <Select.Option key={blood.blood_id} value={blood.blood_id}>
                  {blood.blood_type_id.blood_name} ({blood.rh_id.blood_Rh})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


            <Form.Item name="date_receiver" label="Thời gian nhận máu">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item name="ml" label="Số ml">
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item name="unit" label="Số đơn vị">
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
