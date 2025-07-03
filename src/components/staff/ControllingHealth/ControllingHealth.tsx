import{ useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Space,
  Image,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Upload,
  DatePicker,
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  IconUser,
  IconMail,
  IconRulerMeasure,
  IconScale,
  IconHeart,
  IconUserCheck,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import useHealthService from "../../../hooks/HealthInfor/useHealthService";
import {motion} from "framer-motion"
const { TextArea } = Input;

export default function ControllingHealth() {
  const {
    getAllHealthInfo,
    deleteHealthInfo,
    updateHealthInfoAdmin,
  } = useHealthService();

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState<any>({ open: false, record: null });
  const [editModal, setEditModal] = useState<any>({ open: false, record: null });
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<any>([]);

  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // NEW: state search fullname
  const [searchName, setSearchName] = useState<any>("");

  // NEW: state sort info (antd passes sorter obj, but here we do local sorting)
  const [sorter, setSorter] = useState<any>({ field: null, order: null });

  const fetchData = async (page = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      console.log("Fetching page:", page, "size:", size);
      const res = await getAllHealthInfo(page, size);
      console.log("API response:", res.data.result);
      setData(res.data.result);
      setPagination({
        current: page,
        pageSize: size,
        total: res.data.meta.total,
      });
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu sức khỏe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id:string) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteHealthInfo(id);
          message.success("Xóa thành công!");
          // Sau khi xóa, reload lại trang hiện tại
          fetchData(pagination.current, pagination.pageSize);
        } catch (err) {
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  const handleEdit = (record:any) => {
    setEditModal({ open: true, record });
    form.setFieldsValue({
      user_id: record.user_id?.user_id || "",
      blood_id: record.blood_id?.blood_id,
      height: record.height,
      weight_decimal: record.weight_decimal,
      blood_pressure: record.blood_pressure,
      medical_history: record.medical_history,
      latest_donate: dayjs(record.latest_donate),
      status_health: record.status_health,
    });

    if (record.img_health) {
      setFileList([
        {
          uid: "-1",
          name: "Ảnh hiện tại",
          status: "done",
          url: record.img_health,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      for (const [key, value] of Object.entries(values)) {
        if (key === "latest_donate") {
          formData.append(key, (value as dayjs.Dayjs).toISOString());
        } else if (key !== "img_health" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }

      fileList.forEach((file:any) => {
        if (file.originFileObj) {
          formData.append("img_health", file.originFileObj);
        }
      });

      await updateHealthInfoAdmin(editModal.record.infor_health, formData);

      message.success("Cập nhật thành công!");
      setEditModal({ open: false, record: null });
      setFileList([]);
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error("❌ Cập nhật thất bại:", err);
      message.error("Cập nhật thất bại!");
    }
  };

  const onUploadChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
  };

  // Handle table change for sorting & pagination
  const handleTableChange = (paginationConfig:any, sorterConfig:any) => {
    console.log("Table change:", paginationConfig, sorterConfig);
    
    // Update sorter state
    setSorter({
      field: sorterConfig.field,
      order: sorterConfig.order,
    });

    // Handle pagination change
    if (paginationConfig.current !== pagination.current || 
        paginationConfig.pageSize !== pagination.pageSize) {
      fetchData(paginationConfig.current, paginationConfig.pageSize);
    }
  };

  // Filter + sort data locally before rendering Table
  const processedData = useMemo(() => {
    let filtered = data;

    if (searchName.trim()) {
      filtered = filtered.filter((item:any) =>
        item.user_id?.fullname
          ?.toLowerCase()
          .includes(searchName.trim().toLowerCase())
      );
    }
    
    if (sorter.field && sorter.order) {
      filtered = filtered.slice().sort((a:any, b:any) => {
        let aVal = a[sorter.field];
        let bVal = b[sorter.field];

        // handle nested user_id.fullname case if needed
        if (sorter.field === "fullname") {
          aVal = a.user_id?.fullname || "";
          bVal = b.user_id?.fullname || "";
        }

        if (aVal === undefined || aVal === null) aVal = "";
        if (bVal === undefined || bVal === null) bVal = "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal > bVal) return sorter.order === "ascend" ? 1 : -1;
        if (aVal < bVal) return sorter.order === "ascend" ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchName, sorter]);

  const columns:any = [
    {
      title: (
        <div className="flex flex-col items-center gap-1 text-sm font-semibold text-gray-800">
          <span>STT</span>
        </div>
      ),
      key: "stt",
      align: "center",
      render: (_text:any, _record:any, index:any) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: (
        <div className="flex flex-col items-center gap-1 text-sm font-semibold text-gray-800">
          <IconUser size={16} stroke={1.5} color="red" />
          <span>Họ tên</span>
        </div>
      ),
      dataIndex: ["user_id", "fullname"],
      key: "fullname",
      align: "center",
    },
    {
      title: (
        <div className="flex flex-col items-center gap-1 text-sm font-semibold text-gray-800">
          <IconMail size={16} stroke={1.5} color="red" />
          <span>Email</span>
        </div>
      ),
      dataIndex: ["user_id", "email"],
      key: "email",
      align: "center",
    },
    {
      title: (
        <div className="flex flex-col items-center gap-1 text-sm font-semibold text-gray-800">
          <IconRulerMeasure size={16} stroke={1.5} color="red" />
          <span>Chiều cao (cm)</span>
        </div>
      ),
      dataIndex: "height",
      key: "height",
      align: "center",
      sorter: true,
    },
    {
      title: (
        <div className="flex flex-col items-center gap-1 text-sm font-semibold text-gray-800">
          <IconScale size={16} stroke={1.5} color="red" />
          <span>Cân nặng (kg)</span>
        </div>
      ),
      dataIndex: "weight_decimal",
      key: "weight_decimal",
      align: "center",
      sorter: true,
    },
    {
      title: (
        <div className="flex flex-col items-center gap-1 text-sm font-semibold text-gray-800">
          <IconHeart size={16} stroke={1.5} color="red" />
          <span>Tình trạng</span>
        </div>
      ),
      dataIndex: "status_health",
      key: "status_health",
      align: "center",
    },
    {
      title: (
        <div className="flex flex-col items-center text-sm font-semibold text-gray-800">
          <span>Ảnh</span>
        </div>
      ),
      dataIndex: "img_health",
      key: "img_health",
      align: "center",
      render: (_:any, record:any) =>
        record.img_health ? (
          <Image width={50} src={record.img_health} />
        ) : (
          "Không có"
        ),
    },
    {
      title: (
        <div className="flex flex-col items-center text-sm font-semibold text-gray-800">
          <span>Hành động</span>
        </div>
      ),
      key: "actions",
      align: "center",
      render: (_:any, record:any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setViewModal({ open: true, record })}
          />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.infor_health)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="p-8 bg-gray-50 rounded-md shadow-sm">
        <div className="mb-6 flex justify-between items-center gap-4">
          <motion.h2
            initial={{ x: 0, color: "#000" }}
            whileHover={{ x: 8, color: "#f43f5e" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="self-start text-base font-bold flex items-center gap-2"
          >
            <IconUserCheck size={20} className="text-red-500" />
            Quản Lý Đơn Thông Tin Sức Khỏe
          </motion.h2>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                placeholder="Tìm theo tên..."
                prefix={<SearchOutlined />}
                value={searchName}
                onChange={(e:any) => setSearchName(e.target.value)}
                style={{ maxWidth: 300 }}
                allowClear
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => fetchData(pagination.current, pagination.pageSize)}
              >

                Tải lại
                </Button>
            </div>
          </div>

        <Table
          columns={columns}
          dataSource={processedData}
          rowKey={(record:any) => record.infor_health}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            // showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} mục`,
          }}
          bordered
          size="middle"
          style={{ minHeight: 500 }}
          onChange={handleTableChange}
        />
      </div>

      {/* Modal View */}
      <Modal
        title="Chi tiết thông tin sức khỏe"
        open={viewModal.open}
        onCancel={() => setViewModal({ open: false, record: null })}
        footer={null}
      >
        {viewModal.record && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên">
              {viewModal.record.user_id?.fullname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {viewModal.record.user_id?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Chiều cao">
              {viewModal.record.height} cm
            </Descriptions.Item>
            <Descriptions.Item label="Cân nặng">
              {viewModal.record.weight_decimal} kg
            </Descriptions.Item>
            <Descriptions.Item label="Huyết áp">
              {viewModal.record.blood_pressure}
            </Descriptions.Item>
            <Descriptions.Item label="Tình trạng">
              {viewModal.record.status_health}
            </Descriptions.Item>
            <Descriptions.Item label="Tiền sử">
              {viewModal.record.medical_history}
            </Descriptions.Item>
            <Descriptions.Item label="Lần hiến gần nhất">
              {dayjs(viewModal.record.latest_donate).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Cập nhật thông tin sức khỏe"
        open={editModal.open}
        onCancel={() => {
          setEditModal({ open: false, record: null });
          setFileList([]);
        }}
        onOk={handleUpdate}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="user_id"
            label="User ID"
            rules={[{ required: true}]}
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item
            name="blood_id"
            label="Blood ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="height"
            label="Chiều cao (cm)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="weight_decimal"
            label="Cân nặng (kg)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="blood_pressure"
            label="Huyết áp"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="medical_history"
            label="Tiền sử bệnh"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="latest_donate"
            label="Lần hiến gần nhất"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="status_health"
            label="Tình trạng sức khỏe"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Tốt">Tốt</Select.Option>
              <Select.Option value="Khá">Khá</Select.Option>
              <Select.Option value="Yếu">Yếu</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="img_health" label="Ảnh sức khỏe">
            <Upload
              beforeUpload={() => false}
              multiple
              fileList={fileList}
              onChange={onUploadChange}
              listType="picture-card"
              onRemove={(file) => {
                setFileList((current:any) =>
                  current.filter((f:any) => f.uid !== file.uid)
                );
              }}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}