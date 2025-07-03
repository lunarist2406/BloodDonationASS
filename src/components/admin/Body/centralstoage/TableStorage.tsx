import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Input,
  Modal,
  message,
  Tooltip,
  Card,
} from "antd";
import { IconEye, IconTrash, IconRefresh } from "@tabler/icons-react";

import dayjs from "dayjs";
import useStorage from "../../../../hooks/storage/useStorage";
import useBloodService from "../../../../hooks/Blood/useBloodService";

export default function TableStorage() {
  const [storages, setStorages] = useState([]);
  const [allStorages, setAllStorages] = useState([]);
  const [bloods, setBloods] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewing, setViewing] = useState(null);

  const { getStorages, deleteStorage } = useStorage();
  const { getAllBloods } = useBloodService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [res, bloodRes] = await Promise.all([
        getStorages(),
        getAllBloods(),
      ]);
      const data = res.data.result;
      const bloodData = bloodRes.data.result;
      setAllStorages(data);
      setBloods(bloodData);
      applyFilter(data, searchText, pagination.current, pagination.pageSize);
    } catch (err) {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, search, current, size) => {
    const filtered = data.filter((item) =>
      item.donate_id?.infor_health?.user_id?.fullname
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
    const start = (current - 1) * size;
    const sliced = filtered.slice(start, start + size);
    setStorages(sliced);
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize: size,
      total: filtered.length,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteStorage(id);
      message.success("Xoá thành công");
      fetchData();
    } catch {
      message.error("Xoá thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_, __, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Donor Name",
      key: "donor",
      render: (_, record) =>
        record?.donate_id?.infor_health?.user_id?.fullname || "Unknown",
    },
    {
      title: "Blood Type",
      key: "blood",
      render: (_, record) => {
        const b = bloods.find((b) => b.blood_id === record.blood_id);
        return b
          ? `${b.blood_type_id?.blood_name || ""} ${b.rh_id?.blood_Rh || ""}`
          : "Unknown";
      },
    },
    {
      title: "Date",
      key: "date",
      render: (r) => dayjs(r.date).format("YYYY-MM-DD"),
    },
    {
      title: "ML",
      dataIndex: "ml",
      key: "ml",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Status",
      dataIndex: "current_status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem">
            <Button
              icon={<IconEye size={16} />}
              onClick={() => setViewing(record)}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              icon={<IconTrash size={16} />}
              danger
              onClick={() => handleDelete(record.storage_id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      title="Danh sách kho máu"
      extra={
        <div className="flex gap-2">
          <Input.Search
            placeholder="Tìm theo tên người hiến"
            allowClear
            value={searchText}
            onChange={(e) => {
              const v = e.target.value;
              setSearchText(v);
              applyFilter(allStorages, v, 1, pagination.pageSize);
            }}
          />
          <Button icon={<IconRefresh size={16} />} onClick={fetchData}>
            Reload
          </Button>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={storages}
        rowKey="storage_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          pageSizeOptions: ["5", "10"],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            applyFilter(allStorages, searchText, page, pageSize);
          },
        }}
        scroll={{ x: "max-content" }}
        style={{ minHeight: 500 }}
      />

      <Modal
        open={!!viewing}
        onCancel={() => setViewing(null)}
        footer={null}
        title="Chi tiết kho"
      >
        {viewing && (
          <div className="space-y-1">
            <p>
              <b>ID:</b> {viewing.storage_id}
            </p>
            <p>
              <b>Donor:</b> {viewing.donate_id?.infor_health?.user_id?.fullname}
            </p>
            <p>
              <b>ML:</b> {viewing.ml}
            </p>
            <p>
              <b>Unit:</b> {viewing.unit}
            </p>
            <p>
              <b>Status:</b> {viewing.current_status}
            </p>
            <p>
              <b>Date:</b> {dayjs(viewing.date).format("YYYY-MM-DD")}
            </p>
          </div>
        )}
      </Modal>
    </Card>
  );
}
