import React, { useEffect, useState } from "react";
import {
  getAllWorkingHours,
  createWorkingHour,
  updateWorkingHour,
  deleteWorkingHour,
} from "../../../../hooks/workinghours/WorkingHourService";
import {
  Button,
  Switch,
  TimePicker,
  message,
  Table,
  Space,
  Select,
  Popconfirm,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "../../../../hooks/User/useAuth";

// Định nghĩa kiểu dữ liệu cho giờ làm việc
interface WorkingHour {
  working_id: string;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_open: boolean;
}

// Kiểu cho state form
interface FormState {
  day_of_week: string;
  open_time: Dayjs | null;
  close_time: Dayjs | null;
  is_open: boolean;
}

const daysOfWeek: WorkingHour["day_of_week"][] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export default function WorkingTimeManagement() {
  const { token } = useAuth();
  const [hours, setHours] = useState<WorkingHour[]>([]);
  const [form, setForm] = useState<FormState>({
    day_of_week: "",
    open_time: null,
    close_time: null,
    is_open: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const res = await getAllWorkingHours(token);
      const list = res.data?.result ?? [];
      setHours(list as WorkingHour[]);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Xử lý tạo/cập nhật
  const handleSubmit = async () => {
    if (!form.day_of_week || !form.open_time || !form.close_time) {
      message.error("Vui lòng điền đủ thông tin");
      return;
    }

    const payload = {
      day_of_week: form.day_of_week,
      open_time: form.open_time.toISOString(),
      close_time: form.close_time.toISOString(),
      is_open: form.is_open,
    };

    try {
      if (editingId) {
        await updateWorkingHour(editingId, payload, token);
        message.success("Cập nhật thành công");
      } else {
        await createWorkingHour(payload, token);
        message.success("Tạo mới thành công");
      }
      setForm({
        day_of_week: "",
        open_time: null,
        close_time: null,
        is_open: true,
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      message.error("Thao tác thất bại");
    }
  };

  // Bật form sửa
  const handleEdit = (record: WorkingHour) => {
    setForm({
      day_of_week: record.day_of_week,
      open_time: dayjs(record.open_time),
      close_time: dayjs(record.close_time),
      is_open: record.is_open,
    });
    setEditingId(record.working_id);
  };

  // Xác nhận xóa
  const handleDelete = async (id: string) => {
    try {
      await deleteWorkingHour(id, token);
      message.success("Xoá thành công");
      fetchData();
    } catch (err) {
      message.error(`Xoá thất bại ` + err?.message);
    }
  };

  const columns = [
    { title: "Thứ", dataIndex: "day_of_week", key: "day_of_week" },
    {
      title: "Mở cửa",
      dataIndex: "open_time",
      key: "open_time",
      render: (time: string) => dayjs(time).format("HH:mm"),
    },
    {
      title: "Đóng cửa",
      dataIndex: "close_time",
      key: "close_time",
      render: (time: string) => dayjs(time).format("HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_open",
      key: "is_open",
      render: (value: boolean) => (value ? "✔️" : "❌"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: WorkingHour) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            onConfirm={() => handleDelete(record.working_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex gap-6 p-6">
      {/* Form bên trái */}
      <div className="w-1/3 p-8 my-8 rounded-lg shadow-md bg-gradient-to-r from-white/70 to-white/90 flex flex-col justify-center">
        <h2 className="font-bold text-red-600 text-center">
          {editingId ? "Cập nhật giờ làm" : "Tạo mới giờ làm"}
        </h2>

        <div className="mb-5 mt-2 space-y-1.25">
          <Select
            value={form.day_of_week}
            onChange={(val: string) => setForm({ ...form, day_of_week: val })}
            placeholder="Chọn thứ"
            className="w-full"
          >
            {daysOfWeek.map((d) => (
              <Select.Option key={d} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>

          <TimePicker
            value={form.open_time}
            onChange={(val) => setForm({ ...form, open_time: val })}
            className="w-full"
            placeholder="Giờ mở cửa"
          />
          <TimePicker
            value={form.close_time}
            onChange={(val) => setForm({ ...form, close_time: val })}
            className="w-full"
            placeholder="Giờ đóng cửa"
          />

          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_open}
              onChange={(val) => setForm({ ...form, is_open: val })}
            />
            <span>Mở cửa?</span>
          </div>
        </div>

        <Button type="primary" block onClick={handleSubmit}>
          {editingId ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>

      {/* Bảng bên phải */}
      <div className="flex-1 p-4 my-8 rounded-lg shadow-md bg-white">
        <h2 className="font-bold mb-4 text-red-600">Danh sách giờ làm việc</h2>
        <Table<WorkingHour>
          columns={columns}
          dataSource={hours}
          rowKey="working_id"
        />
      </div>
    </div>
  );
}
