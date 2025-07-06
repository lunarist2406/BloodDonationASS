import { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Input,
  Modal,
  message,
  Tooltip,
  Card,
  Tag,
} from "antd";
import { IconEye, IconTrash, IconRefresh } from "@tabler/icons-react";

import dayjs from "dayjs";
import useStorage from "../../../../hooks/storage/useStorage";
import useBloodService from "../../../../hooks/Blood/useBloodService";

export default function TableStorage() {
  const [storages, setStorages] = useState<any>([]);
  const [allStorages, setAllStorages] = useState<any>([]);
  const [bloods, setBloods] = useState<any>([]);
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<any>("");
  const [viewing, setViewing] = useState<any>(null);

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

  const applyFilter = (data:any, search:any, current:any, size:any) => {
    const filtered = data.filter((item:any) =>
      item.donate_id?.infor_health?.user_id?.fullname
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
    const start = (current - 1) * size;
    const sliced = filtered.slice(start, start + size);
    setStorages(sliced);
    setPagination((prev:any) => ({
      ...prev,
      current,
      pageSize: size,
      total: filtered.length,
    }));
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa kho máu của người hiến này?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteStorage(id);
          message.success("Xóa thành công");
          fetchData();
        } catch {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_:any, __:any, index:any) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Tên người hiến",
      key: "donor",
      render: (_:any, record:any) =>
        record?.donate_id?.infor_health?.user_id?.fullname || "Không xác định",
    },
    {
      title: "Nhóm máu",
      key: "blood",
      render: (_:any, record:any) => {
        const b = bloods.find((b:any) => b.blood_id === record.blood_id);
        return b
          ? `${b.blood_type_id?.blood_name || ""} ${b.rh_id?.blood_Rh || ""}`
          : "Không xác định";
      },
    },
    {
      title: "Ngày",
      key: "date",
      render: (r:any) => dayjs(r.date).format("DD/MM/YYYY"),
    },
    {
      title: "ML",
      dataIndex: "ml",
      key: "ml",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Trạng thái",
      dataIndex: "current_status",
      key: "status",
      render: (status: string) => {
        let color = "";
        let label = "";

        switch (status) {
          case "EXPIRED":
            color = "red";
            label = "EXPIRED";
            break;
          case "EXPORTED":
            color = "volcano";
            label = "EXPORTED";
            break;
          case "USED":
            color = "geekblue";
            label = "USED";
            break;
          case "STORAGE":
            color = "green";
            label = "STORAGE";
            break;
          default:
            color = "default";
            label = status;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_:any, record:any) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<IconEye size={16} />}
              onClick={() => setViewing(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
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
            onChange={(e:any) => {
              const v = e.target.value;
              setSearchText(v);
              applyFilter(allStorages, v, 1, pagination.pageSize);
            }}
          />
          <Button icon={<IconRefresh size={16} />} onClick={fetchData}>
            Tải lại
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
          // showSizeChanger: true,
          // showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
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
        title="Chi tiết kho máu"
        width={600}
      >
        {viewing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-600">Mã kho:</p>
                <p>{viewing.storage_id}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Người hiến:</p>
                <p>{viewing.donate_id?.infor_health?.user_id?.fullname || "Không xác định"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Thể tích (ML):</p>
                <p>{viewing.ml}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Đơn vị:</p>
                <p>{viewing.unit}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Trạng thái:</p>
                <p>{viewing.current_status}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Ngày:</p>
                <p>{dayjs(viewing.date).format("DD/MM/YYYY")}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}