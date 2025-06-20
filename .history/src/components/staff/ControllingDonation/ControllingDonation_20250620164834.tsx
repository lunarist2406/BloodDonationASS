import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useDonateBloodService, {
  type DonateBloodPayload,
} from "../../../hooks/RegistrationForm/useDonateBloodService";

const { Option } = Select;

export default function ControllingDonate() {
  const { getAllDonateBloods, createDonateBlood, updateDonateBlood } =
    useDonateBloodService();

  const [form] = Form.useForm();
  const [donationList, setDonationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const fetchDonations = async (page = 1, pageSize = 5, status?: string) => {
    setLoading(true);
    try {
      const res = await getAllDonateBloods(page, pageSize);
      const data = res.data.results;

      const filteredData = status
        ? data.filter((item: any) => item.status_regist === status)
        : data;

      setDonationList(filteredData);
      setPagination({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        total: res.data.meta.total,
      });
      console.log("Danh sách đơn đăng ký:", res);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pag: any) => {
    fetchDonations(pag.current, pag.pageSize, filterStatus ?? undefined);
  };

  const handleFilterChange = (value: string | null) => {
    setFilterStatus(value);
    fetchDonations(1, pagination.pageSize, value ?? undefined);
  };

  const handleCreate = async (values: any) => {
    const payload: DonateBloodPayload = {
      blood_id: values.blood_id,
      date_donate: values.date_donate.toISOString(),
      centralBlood_id: Number(values.centralBlood_id),
    };
    try {
      await createDonateBlood(payload);
      message.success("Tạo đơn đăng ký thành công");
      form.resetFields();
      fetchDonations();
    } catch (err) {
      message.error("Tạo đơn đăng ký thất bại");
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedDonation) return;
    try {
      await updateDonateBlood(selectedDonation.donate_id, {
        status_regist: status,
      });
      message.success("Cập nhật trạng thái thành công");
      setViewModal(false);
      fetchDonations();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "donate_id",
      key: "donate_id",
    },
    {
      title: "Mã máu",
      key: "blood_id",
      render: (_: any, record: any) => record.blood_id?.blood_id || "N/A",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "date_register",
      key: "date_register",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status_regist",
      key: "status_regist",
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "Đã duyệt", value: "Đã duyệt" },
        { text: "Từ chối", value: "Từ chối" },
      ],
      onFilter: (value: any, record: any) => record.status_regist === value,
    },
    {
      title: "Trung tâm",
      key: "centralBlood",
      render: (_: any, record: any) =>
        record.centralBlood_id?.centralBlood_name || "N/A",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          onClick={() => {
            setSelectedDonation(record);
            setViewModal(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Tạo đơn đăng ký hiến máu">
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item
              name="blood_id"
              label="Mã máu"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date_donate"
              label="Ngày hiến máu"
              rules={[{ required: true }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="centralBlood_id"
              label="ID trung tâm"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Tạo đơn
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Col span={16}>
        <Card
          title="Danh sách đơn đăng ký"
          extra={
            <Select
              allowClear
              placeholder="Lọc theo trạng thái"
              onChange={handleFilterChange}
              style={{ width: 200 }}
            >
              <Option value="PENDING">PENDING</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Từ chối">Từ chối</Option>
            </Select>
          }
        >
          <Table
            rowKey="donate_id"
            dataSource={donationList}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Card>
      </Col>

      <Modal
        title="Chi tiết đơn đăng ký"
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={[
          <Button onClick={() => handleStatusUpdate("Đã duyệt")} type="primary">
            Duyệt
          </Button>,
          <Button onClick={() => handleStatusUpdate("Từ chối")} danger>
            Hủy
          </Button>,
        ]}
      >
        {selectedDonation && (
          <div>
            <p>
              <strong>Mã máu:</strong>{" "}
              {selectedDonation.blood_id?.blood_id || "N/A"}
            </p>
            <p>
              <strong>Ngày đăng ký:</strong>{" "}
              {dayjs(selectedDonation.date_register).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedDonation.status_regist}
            </p>
            <p>
              <strong>Trung tâm:</strong>{" "}
              {selectedDonation.centralBlood_id?.centralBlood_name || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{" "}
              {selectedDonation.centralBlood_id?.centralBlood_address || "N/A"}
            </p>
          </div>
        )}
      </Modal>
    </Row>
  );
}
