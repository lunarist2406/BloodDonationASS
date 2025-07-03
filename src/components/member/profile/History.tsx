import  { useEffect, useState } from "react";
import { Table, Spin, Pagination } from "antd";
import useDonateBloodService from "../../../hooks/RegistrationForm/useDonateBloodService";

export default function History() {
  const { getDonateHistoryByUser } = useDonateBloodService();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Hàm fetchData có nhận page và pageSize để fetch đúng dữ liệu
  const fetchData = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await getDonateHistoryByUser();

      // Lọc những đơn status_donate === "COMPLETED"
      const filtered = res.data.filter(
        (item: any) => item.status_donate === "COMPLETED"
      );

      // Tính total sau khi lọc
      const total = filtered.length;

      // Lọc lại data theo trang hiện tại (pagination thủ công)
      const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

      // Map data để phù hợp với table
      const tableData = pagedData.map((item: any, index: number) => ({
        key: item.donate_id,
        stt: (page - 1) * pageSize + index + 1,
        fullname: item.infor_health.user_id.fullname,
        date_donate: new Date(item.date_donate).toLocaleDateString("vi-VN"),
        status: item.status_donate,
        center: item.centralBlood_id.centralBlood_name,
      }));

      setData(tableData);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: total,
      });
    } catch (error) {
      console.error("Lấy lịch sử hiến máu lỗi:", error);
      setData([]);
      setPagination({
        current: 1,
        pageSize: 5,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center" as const,
    },
    {
      title: "Người hiến",
      dataIndex: "fullname",
      key: "fullname",
      align: "left" as const,
    },
    {
      title: "Ngày hiến",
      dataIndex: "date_donate",
      key: "date_donate",
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
    },
    {
      title: "Trung tâm",
      dataIndex: "center",
      key: "center",
      align: "left" as const,
    },
  ];

  if (loading)
    return (
      <Spin
        tip="Đang tải dữ liệu..."
        style={{ width: "100%", marginTop: 50 }}
      />
    );

  if (data.length === 0) return <p>Không có đơn đã hoàn thành nào.</p>;

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg p-6">
      <h2>Lịch sử đơn đã hoàn thành</h2>
      <div className="flex-grow overflow-auto">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          rowClassName={() => "hover:bg-red-50"}
          size="small"
          bordered
          scroll={{ x: "max-content" }}
          style={{ minHeight: "500px" }}
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
          onShowSizeChange={(size) => fetchData(1, size)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`
          }
        />
      </div>
    </div>
  );
}
