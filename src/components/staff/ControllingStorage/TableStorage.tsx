import { Table, Space, Button, Tag } from "antd";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

type TableStorageProps = {
  storages: any[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onView: (record: any) => void;
  onEdit: (record: any) => void;
  onDelete: (storageId: string | number) => void;
  bloods: any[];
};

export default function TableStorage({
  storages,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  bloods,
}: TableStorageProps) {
  const columns :any= [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_:any, __:any, index:any) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      sorter: (a:any, b:any) => a.index - b.index,
      fixed: "left",
    },
    {
      title: "Người hiến",
      dataIndex: ["donate_id", "infor_health", "user_id", "fullname"],
      key: "donorName",
      sorter: (a:any, b:any) => {
        const nameA =
          a.donate_id?.infor_health?.user_id?.fullname?.toLowerCase() || "";
        const nameB =
          b.donate_id?.infor_health?.user_id?.fullname?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      },
      render: (_:any, record:any) =>
        record.donate_id?.infor_health?.user_id?.fullname || "Unknown",
    },
    {
      title: "Nhóm máu",
      key: "bloodType",
      render: (_:any, record:any) => {
        if (
          record.blood_id &&
          typeof record.blood_id === "object" &&
          record.blood_id.blood_type_id &&
          record.blood_id.rh_id
        ) {
          return `${record.blood_id.blood_type_id.blood_name || ""} ${
            record.blood_id.rh_id.blood_Rh || ""
          }`;
        }
        const blood = bloods.find((b) => b.blood_id === record.blood_id);
        if (blood) {
          return `${blood.blood_type_id?.blood_name || ""} ${
            blood.rh_id?.blood_Rh || ""
          }`;
        }
        return "Unknown";
      },
    },
    {
      title: "Ngày hiến",
      dataIndex: "date",
      key: "date",
      sorter: (a:any, b:any) => {
        const aTime = a.date ? dayjs(a.date).unix() : 0;
        const bTime = b.date ? dayjs(b.date).unix() : 0;
        return aTime - bTime;
      },
      render: (date:any) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Dung tích (ml)",
      dataIndex: "ml",
      key: "ml",
      sorter: (a:any, b:any) => (a.ml ?? 0) - (b.ml ?? 0),
      render: (ml:any) => (ml !== undefined && ml !== null ? ml : "N/A"),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      sorter: (a:any, b:any) => (a.unit ?? 0) - (b.unit ?? 0),
      render: (unit:any) => (unit !== undefined && unit !== null ? unit : "N/A"),
    },
    {
  title: "Trạng thái",
  dataIndex: "current_status",
  key: "status",
  filters: [
    { text: "STORAGE", value: "STORAGE" },
    { text: "EXPIRED", value: "EXPIRED" },
    { text: "USED", value: "USED" },
    { text: "EXPORTED", value: "EXPORTED" },
  ],
  onFilter: (value:any, record:any) => record.current_status === value,
  render: (status:any) => {
    let color = "default";
    let text = "Unknown";

    switch (status) {
      case "STORAGE":
        color = "blue";
        text = "STORAGE";
        break;
      case "EXPIRED":
        color = "red";
        text = "EXPIRED";
        break;
      case "USED":
        color = "green";
        text = "USED";
        break;
      case "EXPORTED":
        color = "orange";
        text = "EXPORTED";
        break;
    }

    return <Tag color={color}>{text}</Tag>;
  }
  },
    {
      title: "Hành động",
      key: "action",
      render: (_:any, record:any) => (
        <Space>
          <Button icon={<IconEye size={16} />} onClick={() => onView(record)} />
          <Button icon={<IconEdit size={16} />} onClick={() => onEdit(record)} />
          <Button
            icon={<IconTrash size={16} />}
            danger
            onClick={() => onDelete(record.storage_id)}
          />
        </Space>
      ),
      fixed: "right",
      width: 120,
    },
  ];

  return (
    <Table
      dataSource={storages}
      columns={columns}
      rowKey="storage_id"
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize || 5,
        total: pagination.total || 5,
        pageSizeOptions: ["5", "10"],
        showSizeChanger: true,
        onChange: (page, pageSize) => {
          if (pageSize !== pagination.pageSize) {
            onPageSizeChange(pageSize);
          } else {
            onPageChange(page, pageSize);
          }
        },
        showQuickJumper: false,
        showTotal: (total, range) =>
          `${range[0]} - ${range[1]} trong tổng ${total} bản ghi`,
      }}
      scroll={{ x: "max-content" }}
      size="small"
      style={{ minHeight: 455 }}
    />
  );
}
