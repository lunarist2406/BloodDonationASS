import React from "react";
import { Table, Space, Button } from "antd";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

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
}) {
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_, __, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      sorter: (a, b) => a.index - b.index,
      fixed: "left",
    },
    {
      title: "Donor Name",
      dataIndex: ["donate_id", "infor_health", "user_id", "fullname"],
      key: "donorName",
      sorter: (a, b) => {
        const nameA =
          a.donate_id?.infor_health?.user_id?.fullname?.toLowerCase() || "";
        const nameB =
          b.donate_id?.infor_health?.user_id?.fullname?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      },
      render: (_, record) =>
        record.donate_id?.infor_health?.user_id?.fullname || "Unknown",
    },
    {
      title: "Blood Type",
      key: "bloodType",
      render: (_, record) => {
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => {
        const aTime = a.date ? dayjs(a.date).unix() : 0;
        const bTime = b.date ? dayjs(b.date).unix() : 0;
        return aTime - bTime;
      },
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "ML",
      dataIndex: "ml",
      key: "ml",
      sorter: (a, b) => (a.ml ?? 0) - (b.ml ?? 0),
      render: (ml) => (ml !== undefined && ml !== null ? ml : "N/A"),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      sorter: (a, b) => (a.unit ?? 0) - (b.unit ?? 0),
      render: (unit) => (unit !== undefined && unit !== null ? unit : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "current_status",
      key: "status",
      filters: [
        { text: "STORAGE", value: "STORAGE" },
        { text: "EXPIRED", value: "EXPIRED" },
        { text: "USED", value: "USED" },
      ],
      onFilter: (value, record) => record.current_status === value,
      render: (status) => status || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<IconEye size={16} />} onClick={() => onView(record)} />
          <Button
            icon={<IconEdit size={16} />}
            onClick={() => onEdit(record)}
          />
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
        current: pagination.current, // current page
        pageSize: pagination.pageSize || 5, // ép pageSize, default 5 nếu không có
        total: pagination.total || 5,
        pageSizeOptions: ["5", "10"], // cho chọn 5 hoặc 10
        showSizeChanger: true, // hiện nút chọn size
        onChange: (page, pageSize) => {
          // gọi khi page hoặc size thay đổi
          if (pageSize !== pagination.pageSize) {
            onPageSizeChange(pageSize); // đổi size thì gọi hàm này
          } else {
            onPageChange(page, pageSize); // đổi page thì gọi hàm này
          }
        },
        showQuickJumper: false,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: "max-content" }}
      size="small"
      style={{ minHeight: 455 }}
    />
  );
}
