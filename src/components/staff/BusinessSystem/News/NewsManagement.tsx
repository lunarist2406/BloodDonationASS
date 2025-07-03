import { useEffect, useState } from "react";
import useNewsService from "../../../../hooks/News/useNews";
import {
  Input,
  Button,
  Table,
  Modal,
  Form,
  notification,
  DatePicker,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  IconTextCaption,
  IconCalendarEvent,
  IconPhoto,
  IconLink,
} from "@tabler/icons-react";
import dayjs from "dayjs";

export default function NewsManagement() {
  const { getNewsList, getNewsById, createNews, updateNews, deleteNews } =
    useNewsService();

  const [form] = Form.useForm();
  const [newsData, setNewsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [viewNews, setViewNews] = useState<any>(null);

  // 📥 Load News List
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await getNewsList(1, 100, search ? `&qs=${search}` : "");
        setNewsData(res.data?.result || []);
      } catch (err) {
        notification.error({ message: "Failed to fetch news." });
      }
      setLoading(false);
    };
    fetchNews();
  }, [refresh, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (values: any) => {
    const finalValues = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
    };
    try {
      if (editingNewsId) {
        await updateNews(editingNewsId, finalValues);
        notification.success({ message: "Cập nhật thành công!" });
      } else {
        await createNews(finalValues);
        notification.success({ message: "Tạo mới thành công!" });
      }
      form.resetFields();
      setEditingNewsId(null);
      setRefresh(!refresh);
    } catch (err) {
      notification.error({ message: "Lỗi xử lý dữ liệu!" });
      console.error("Error submitting form:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteNews(id);
    notification.success({ message: "Đã xoá tin tức!" });
    setRefresh(!refresh);
  };

  const handleView = async (id: number) => {
    try {
      const res = await getNewsById(id);
      // Check if response has data and result
      setViewNews(res.data || null);
    } catch (err) {
      notification.error({ message: "Không thể lấy chi tiết tin tức!" });
      setViewNews(null);
    }
  };

  const handleEdit = (record: any) => {
    const values = {
      ...record,
      date: dayjs(record.date),
    };
    form.setFieldsValue(values);
    setEditingNewsId(record.news_id);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* 👈 Form Create/Update */}
      <div className="w-1/3 p-4 rounded shadow text-black text-2xl bg-gradient-to-b from-red-200 to-red-500">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {editingNewsId ? (
            <>
              <EditOutlined className="text-blue-500" /> Cập nhật tin tức
            </>
          ) : (
            <>
              <EyeOutlined className="text-red-600" /> Tạo tin tức
            </>
          )}
        </h2>
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            name="title"
            label={
              <span className="flex items-center gap-1">
                <IconTextCaption size={18} /> Tiêu đề
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="date"
            label={
              <span className="flex items-center gap-1">
                <IconCalendarEvent size={18} /> Ngày
              </span>
            }
            rules={[{ required: true, message: "Chọn ngày đăng" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="image"
            label={
              <span className="flex items-center gap-1">
                <IconPhoto size={18} /> Ảnh
              </span>
            }
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="link"
            label={
              <span className="flex items-center gap-1">
                <IconLink size={18} /> Liên kết
              </span>
            }
          >
            <Input />
          </Form.Item>

          <div className="flex gap-2">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full mt-2 !bg-gradient-to-r !from-black !via-red-400 !to-black !border-none !text-white"
              style={{
                background: "linear-gradient(to right, #000, #b91c1c, #000)",
                border: "none",
                color: "#fff",
              }}
            >
              {editingNewsId ? "Cập nhật" : "Tạo mới"}
            </Button>
            {editingNewsId && (
              <Button
                className="w-full mt-2 bg-gradient-to-r from-red-500 to-red-700 border-none text-white"
                onClick={() => {
                  form.resetFields();
                  setEditingNewsId(null);
                }}
              >
                Quay lại tạo mới
              </Button>
            )}
          </div>
        </Form>
      </div>

      {/* 👉 Table + Search */}
      <div className="w-2/3">
        <h2 className="text-black text-3xl flex items-center gap-2">
          Danh Sách Tin Tức
        </h2>
        <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="Tìm kiếm tin tức..."
            allowClear
            onChange={handleSearch}
            className="w-1/2"
            prefix={<IconTextCaption size={18} />}
          />
        </div>
        <Table
          loading={loading}
          rowKey="news_id"
          dataSource={newsData}
          columns={[
            {
              title: "#",
              dataIndex: "index",
              width: 60,
              align: "center",
              render: (_: any, __: any, idx: number) => idx + 1,
            },
            {
              title: (
                <span className="flex items-center gap-1">
                  <IconTextCaption size={18} /> Tiêu đề
                </span>
              ),
              dataIndex: "title",
              render: (text: string) => (
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    verticalAlign: "middle",
                  }}
                  title={text}
                >
                  {text}
                </span>
              ),
            },
            {
              title: (
                <span className="flex items-center gap-1">
                  <IconCalendarEvent size={18} /> Ngày
                </span>
              ),
              dataIndex: "date",
            },
            {
              title: "Hành động",
              render: (_: any, record: any) => (
                <div className="flex gap-2">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleView(record.news_id)}
                  />
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(record.news_id)}
                  />
                </div>
              ),
            },
          ]}
        />
        {/* 👁 Modal View */}
        <Modal
          open={!!viewNews}
          onCancel={() => setViewNews(null)}
          footer={null}
          width={700}
          title={
            <span className="flex items-center gap-2">
              <EyeOutlined /> Chi tiết tin tức
            </span>
          }
        >
          {viewNews && (
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <IconTextCaption size={18} className="mt-1" />
                <div>
                  <strong>Tiêu đề:</strong>
                  <div
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      fontWeight: 500,
                      fontSize: 18,
                      marginTop: 2,
                    }}
                  >
                    {viewNews.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconCalendarEvent size={18} />
                <strong>Ngày:</strong> {viewNews.date}
              </div>
              <div className="flex items-start gap-2">
                <IconTextCaption size={18} className="mt-1" />
                <div>
                  <strong>Mô tả:</strong>
                  <div
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-line",
                      marginTop: 2,
                    }}
                  >
                    {viewNews.description}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 ">
                <IconLink size={18} />
                <strong>Link:</strong>{" "}
                <a
                  href={viewNews.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    marginTop: 2,
                  }}
                >
                  {viewNews.link}
                </a>
              </div>
              {viewNews.image && (
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={viewNews.image}
                    alt="News"
                    className="max-w-full max-h-65 object-contain rounded"
                  />
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
