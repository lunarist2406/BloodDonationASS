import React, { useEffect, useState } from "react";
import { Table, Tag, Pagination, Input } from "antd";
import {
  IconClock,
  IconUser,
  IconDroplet,
  IconMapPin,
  IconCalendar,
  IconSearch,
  IconReload,
} from "@tabler/icons-react";
import useDonateBloodService from "../../../../hooks/RegistrationForm/useDonateBloodService";
import useBloodService from "../../../../hooks/Blood/useBloodService";

export default function FormViewDonate() {
  const { getAllDonateBloods } = useDonateBloodService();
  const { getBloodById } = useBloodService();

  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);
  async function fetchData(page: number, pageSize: number) {
    setLoading(true);
    try {
      const res = await getAllDonateBloods(1, 10000); // Lấy toàn bộ để xử lý STT dựa theo ngày thực hiện

      const rawList = await Promise.all(
        res.data.results.map(async (item: any) => {
          let bloodDisplay = "Chưa có nhóm máu";
          if (item.blood_id?.blood_id) {
            try {
              const bloodRes = await getBloodById(item.blood_id.blood_id);
              const bloodData = bloodRes.data;
              if (
                bloodData?.blood_type_id?.blood_name &&
                bloodData?.rh_id?.blood_Rh
              ) {
                bloodDisplay =
                  bloodData.blood_type_id.blood_name + bloodData.rh_id.blood_Rh;
              }
            } catch (err) {
              console.error("Lỗi khi lấy nhóm máu:", err);
            }
          }

          return {
            donate_id: item.donate_id,
            fullName: item.infor_health?.user_id?.fullname || "Chưa có tên",
            registerDate: item.date_register || null,
            donateDate: item.date_donate || null,
            bloodType: bloodDisplay,
            location:
              item.centralBlood_id?.centralBlood_name || "Chưa có địa điểm",
            status: item.status_donate || "Chưa có trạng thái",
          };
        })
      );

      // 🔥 Sort theo ngày thực hiện (donateDate)
      const sortedList = rawList.sort(
        (a, b) =>
          new Date(a.donateDate).getTime() - new Date(b.donateDate).getTime()
      );

      // 🧠 Gán STT theo vị trí sau khi sort
      const formattedList = sortedList.map((item, index) => ({
        ...item,
        key: item.donate_id,
        stt: index + 1,
      }));

      // 🪄 Phân trang thủ công
      const startIndex = (page - 1) * pageSize;
      const pagedData = formattedList.slice(startIndex, startIndex + pageSize);

      setData(formattedList); // full data để tìm kiếm
      setFilteredData(pagedData); // hiển thị theo trang
      setPagination({
        current: page,
        pageSize: pageSize,
        total: formattedList.length,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách hiến máu:", error);
    } finally {
      setLoading(false);
    }
  }

  // Tìm kiếm theo tên
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = data
      .filter((item) =>
        item.fullName.toLowerCase().includes(value.toLowerCase())
      )
      .slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
      ); // paged lại sau khi search
    setFilteredData(filtered);
  };

  // Cột table
  const columns = [
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconClock size={16} /> STT
        </span>
      ),
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconUser size={16} /> Họ tên
        </span>
      ),
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconCalendar size={16} /> Ngày đăng ký
        </span>
      ),
      dataIndex: "registerDate",
      key: "registerDate",
      align: "center" as const,
      render: (date: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "Không có",
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconCalendar size={16} /> Ngày thực hiện
        </span>
      ),
      dataIndex: "donateDate",
      key: "donateDate",
      align: "center" as const,
      render: (date: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "Không có",
      sorter: (a: any, b: any) =>
        new Date(a.donateDate).getTime() - new Date(b.donateDate).getTime(),
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconDroplet size={16} /> Nhóm máu
        </span>
      ),
      dataIndex: "bloodType",
      key: "bloodType",
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconMapPin size={16} /> Địa điểm
        </span>
      ),
      dataIndex: "location",
      key: "location",
      align: "center" as const,
    },
    {
      title: (
        <span className="flex items-center justify-center gap-1 text-red-800">
          <IconClock size={16} /> Trạng thái
        </span>
      ),
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => {
        let color = "orange";
        if (status === "COMPLETED") color = "green";
        else if (status === "CANCELLED") color = "red";
        return (
          <Tag color={color} className="font-semibold">
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
          <IconClock size={24} className="text-red-700" />
          Danh Sách Đăng Ký Hiến Máu
        </h2>

        {/* Nút reload */}
        <button
          onClick={() => fetchData(pagination.current, pagination.pageSize)}
          className=" hover:bg-red-400 text-white font-medium px-4 py-1.5 rounded-lg shadow flex items-center gap-2"
        >
          <IconReload /> Tải lại
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex items-center gap-2 mb-4">
        <IconSearch size={20} className="text-gray-500" />
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchText}
          onChange={handleSearch}
          allowClear
          className="w-64"
        />
      </div>

      <div className="flex-grow overflow-auto">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={false}
          rowClassName={() => "hover:bg-red-50"}
          size="small"
          bordered
          scroll={{ x: "max-content" }}
        />
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, size) => fetchData(page, size)}
          onShowSizeChange={(current, size) => fetchData(1, size)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`
          }
        />
      </div>
    </div>
  );
}
