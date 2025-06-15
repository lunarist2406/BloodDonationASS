import { Table, Button, Tag, Modal, Descriptions } from "antd";
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import useCentral from "../../../../hooks/CentralBlood/useCentral";
import {
  IconMapPin,
  IconBuildingBank,
  IconClock,
  IconCalendarTime,
  IconPower,
  IconMapPinFilled,
} from "@tabler/icons-react";

export default function TableCentral({
  onSelectCentral,
}: {
  onSelectCentral: (central: any) => void;
}) {
  const { central, fetchCentral } = useCentral();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleReload = () => {
    fetchCentral();
  };

  const showDetail = (record: any) => {
    setSelectedItem(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Tên Trung Tâm",
      dataIndex: "centralBlood_name",
      key: "centralBlood_name",
      render: (_: any, record: any) => (
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
    },
    {
      title: "Trạng Thái",
      key: "is_open",
      render: (_: any, record: any) =>
        record.working_id?.is_open ? (
          <Tag color="green">Đang mở</Tag>
        ) : (
          <Tag color="red">Đang đóng</Tag>
        ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_: any, record: any) => (
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
    <div
      className="rounded-xl shadow p-4"
      style={{
        background: "linear-gradient(to right, #f43f5e, #991b1b)",
        color: "white",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconBuildingBank size={22} /> Danh Sách Trung Tâm
        </h2>
        <Button icon={<ReloadOutlined />} onClick={handleReload}>
          Reload
        </Button>
      </div>

      <div className="bg-white p-2 rounded-md">
        <Table
          columns={columns}
          dataSource={central}
          rowKey={(record) => record.centralBlood_id}
          pagination={{ pageSize: 5 }}
        />
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
                  <IconPower size={18} />
                  Trạng Thái Mở Cửa
                </span>
              }
            >
              {selectedItem.working_id?.is_open ? "Có" : "Không"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IconClock size={18} />
                  Giờ Làm Việc
                </span>
              }
            >
              {`${selectedItem.working_id?.open_time?.slice(
                11,
                16
              )} - ${selectedItem.working_id?.close_time?.slice(11, 16)}`}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IconCalendarTime size={18} />
                  Thứ
                </span>
              }
            >
              {selectedItem.working_id?.day_of_week}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
