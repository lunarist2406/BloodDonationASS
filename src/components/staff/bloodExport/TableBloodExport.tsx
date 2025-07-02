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
  Select,
  Tag,
} from "antd";
import {
  IconEye,
  IconTrash,
  IconRefresh,
  IconEdit,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import useBloodExportService from "../../../hooks/BloodExport/useBloodExportService";

export default function TableExportBlood() {
  const [exports, setExports] = useState([]);
  const [allExports, setAllExports] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [storages, setStorages] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const statusOptions = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];


  const {
    getExportBloods,
    deleteExportBlood,
    getUserById,
    getBloodById,
    getStorageById,
    updateExportBlood,
    getAllStorages,
    getAllReceivers,
  } = useBloodExportService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getExportBloods(1, 100);
      const rawData = res?.data?.results || [];

      const enrichedData = await Promise.all(
        rawData.map(async (item) => {
          let userName = "Không rõ";
          let bloodLabel = "Không rõ";
          let storageName = "Không rõ";

          try {
            const userRes = await getUserById(item.receiver_id?.user_id);
            userName = userRes?.data?.fullname || userName;
          } catch {}

          try {
            const bloodRes = await getBloodById(item.receiver_id?.blood_id);
            const blood = bloodRes?.data;
            bloodLabel = `${blood.blood_type_id?.blood_name || ""}${blood.rh_id?.blood_Rh || ""}`;
          } catch {}

          try {
            const storageRes = await getStorageById(item.storage_id?.storage_id);
            storageName = storageRes?.data?.centralBlood_id?.centralBlood_name || storageName;
          } catch {}

          return {
            ...item,
            receiver_name: userName,
            blood_type: bloodLabel,
            storage_name: storageName,
          };
        })
      );

      setAllExports(enrichedData);
      applyFilter(enrichedData, searchText, pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu xuất máu");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [storageRes, receiverRes] = await Promise.all([
        getAllStorages(),
        getAllReceivers(),
      ]);
      
      setStorages(storageRes || []);
      setReceivers(receiverRes?.data?.results || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách kho và người nhận");
    }
  };

  const applyFilter = (data, search, current, size) => {
    const filtered = data.filter((item) =>
      item.receiver_name?.toLowerCase().includes(search.toLowerCase())
    );
    const start = (current - 1) * size;
    const sliced = filtered.slice(start, start + size);
    setExports(sliced);
    setPagination({
      current,
      pageSize: size,
      total: filtered.length,
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá bản ghi xuất máu này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await deleteExportBlood(id);
          message.success("Xoá thành công");
          fetchData();
        } catch {
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Người nhận",
      dataIndex: "receiver_name",
    },
    {
      title: "Loại máu",
      dataIndex: "blood_type",
    },
    {
      title: "Kho lưu",
      dataIndex: "storage_name",
    },
    {
      title: "Ngày xuất",
      render: (record) =>
        dayjs(record.export_date).format("YYYY-MM-DD HH:mm"),
    },
    {
  title: "Trạng thái",
  dataIndex: "status",
  render: (status) => {
    const colorMap = {
      PENDING: "gold",
      APPROVED: "green",
      REJECTED: "red",
      CANCELLED: "volcano",
      COMPLETED: "blue",
    };

    return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
  },
},

    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<IconEye size={16} />} onClick={() => setViewing(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<IconEdit size={16} />} onClick={() => { setEditing(record); fetchDropdowns(); }} />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              icon={<IconTrash size={16} />}
              danger
              onClick={() => handleDelete(record.export_id)}
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
      title="Danh sách xuất máu"
      extra={
        <div className="flex gap-2">
          <Input.Search
            placeholder="Tìm theo người nhận"
            value={searchText}
            onChange={(e) => {
              const v = e.target.value;
              setSearchText(v);
              applyFilter(allExports, v, 1, pagination.pageSize);
            }}
            allowClear
          />
          <Button icon={<IconRefresh size={16} />} onClick={fetchData}>
            Tải lại
          </Button>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={exports}
        rowKey={(record) => record.export_id}
        loading={loading}
        pagination={{
          ...pagination,
          pageSizeOptions: ["5", "10"],
          showSizeChanger: true,
          onChange: (page, size) =>
            applyFilter(allExports, searchText, page, size),
        }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        open={!!viewing}
        onCancel={() => setViewing(null)}
        footer={null}
        title="Chi tiết xuất máu"
      >
        {viewing && (
          <div className="space-y-2">
            <p><b>ID:</b> {viewing.export_id}</p>
            <p><b>Người nhận:</b> {viewing.receiver_name}</p>
            <p><b>Loại máu:</b> {viewing.blood_type}</p>
            <p><b>Kho lưu:</b> {viewing.storage_name}</p>
            <p><b>Trạng thái:</b> {viewing.status}</p>
            <p><b>Ngày xuất:</b> {dayjs(viewing.export_date).format("YYYY-MM-DD HH:mm")}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!editing}
        onCancel={() => setEditing(null)}
        title="Chỉnh sửa xuất máu"
        onOk={async () => {
          try {
            await updateExportBlood(editing.export_id, {
              storage_id: editing.storage_id?.storage_id,
              receiver_id: editing.receiver_id?.receiver_id,
              status: editing.status,
            });
            message.success("Cập nhật thành công");
            setEditing(null);
            fetchData();
          } catch (err) {
            message.error("Cập nhật thất bại");
          }
        }}
      >
        {editing && (
          <div className="space-y-3">
            <label>Kho lưu:</label>
            <Select
              className="w-full"
              value={editing.storage_id?.storage_id}
              onChange={(value) => setEditing({ ...editing, storage_id: { storage_id: value } })}
            >
              {storages.map((s) => (
                <Select.Option key={s.storage_id} value={s.storage_id}>
                  {s.centralBlood_id?.centralBlood_name || "Không rõ"}
                </Select.Option>
              ))}
            </Select>

            <label>Người nhận:</label>
            <Select
              className="w-full"
              value={editing.receiver_id?.receiver_id}
              onChange={(value) => setEditing({ ...editing, receiver_id: { receiver_id: value } })}
            >
              {receivers.map((r) => (
                <Select.Option key={r.receiver_id} value={r.receiver_id}>
                  {r.user_id?.fullname || "Không rõ"}
                </Select.Option>
              ))}
            </Select>
            <label>Trạng thái:</label>
            <Select
              className="w-full"
              value={editing.status}
              onChange={(value) => setEditing({ ...editing, status: value })}
            >
              {statusOptions.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>

          </div>
        )}
      </Modal>
    </Card>
  );
}
