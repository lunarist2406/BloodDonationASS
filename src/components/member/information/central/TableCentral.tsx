import {
  Table,
  Button,
  Tag,
  Modal,
  Descriptions,
  Pagination,
  message,
} from "antd";
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import useCentralService from "../../../../hooks/CentralBlood/useCentralService";
import {
  IconMapPin,
  IconBuildingBank,
  IconClock,
  IconMapPinFilled,
} from "@tabler/icons-react";

export default function TableCentral({
  onSelectCentral,
}: {
  onSelectCentral: (central: any) => void;
}) {
  const { getAllCentral } = useCentralService();
  const [central, setCentral] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 5;

  const fetchCentral = async () => {
    setLoading(true);
    try {
      const res = await getAllCentral(1, 100);
      setCentral(res.data.result);
    } catch {
      message.error("Lỗi khi load danh sách trung tâm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentral();
  }, []);

  const showDetail = (record: any) => {
    setSelectedItem(record);
    setIsModalVisible(true);
  };

  const pagedData = central.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paddedData =
    pagedData.length < pageSize
      ? [
          ...pagedData,
          ...Array(pageSize - pagedData.length)
            .fill(null)
            .map((_, idx) => ({
              isFake: true,
              centralBlood_id: `fake-${idx}`,
            })),
        ]
      : pagedData;

  const columns = [
    {
      title: "Tên Trung Tâm",
      dataIndex: "centralBlood_name",
      key: "centralBlood_name",
      render: (_: any, record: any) =>
        record.isFake ? (
          ""
        ) : (
          <button
            onClick={() => onSelectCentral(record)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <IconMapPinFilled size={18} />
            <span className="underline underline-offset-2">
              {record.centralBlood_name}
            </span>
          </button>
        ),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "centralBlood_address",
      key: "centralBlood_address",
      render: (_: any, record: any) =>
        record.isFake ? "" : record.centralBlood_address,
    },
    {
      title: "Trạng Thái",
      key: "is_open",
      render: (_: any, record: any) => {
        if (record.isFake) return "";
        const anyOpen = record.working_id?.some((item: any) => item.is_open);
        return anyOpen ? (
          <Tag color="green">Hoạt Động</Tag>
        ) : (
          <Tag color="red">Ngưng</Tag>
        );
      },
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_: any, record: any) =>
        record.isFake ? (
          ""
        ) : (
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            type="link"
          >
            Xem
          </Button>
        ),
    },
  ];

  return (
    <div className="rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconBuildingBank size={22} /> Danh Sách Trung Tâm
        </h2>
        <Button icon={<ReloadOutlined />} onClick={fetchCentral}>
          Tải lại
        </Button>
      </div>

      <div
        className="table-wrapper bg-white p-2 rounded-md"
        style={{
          height: 450,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Table
          columns={columns}
          dataSource={paddedData}
          rowKey={(record) => record.centralBlood_id}
          pagination={false}
          loading={loading}
        />

        <div className="flex justify-end mt-2">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={central.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>

      <Modal
        title={
          <span className="flex items-center gap-2 text-red-600">
            <IconBuildingBank size={20} />
            Chi Tiết Trung Tâm
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedItem && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IconBuildingBank size={18} />
                  Tên Trung Tâm
                </span>
              }
            >
              {selectedItem.centralBlood_name}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IconMapPin size={18} />
                  Địa Chỉ
                </span>
              }
            >
              {selectedItem.centralBlood_address}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IconClock size={18} />
                  Giờ Làm Việc
                </span>
              }
            >
              {selectedItem.working_id && selectedItem.working_id.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedItem.working_id.map((item: any) => (
                    <li key={item.working_id}>
                      {item.day_of_week}: {item.open_time?.slice(11, 16)} -{" "}
                      {item.close_time?.slice(11, 16)} (
                      {item.is_open ? "Mở" : "Đóng"})
                    </li>
                  ))}
                </ul>
              ) : (
                "Không có giờ làm việc"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
