import { useState, useCallback } from "react";
import type { BloodDonationData } from "./useBloodDonationFilter";

const mockData: BloodDonationData[] = [
  { id: 1, type: "hien", name: "Nguyễn Văn A - Đăng ký hiến máu", distance: 3 },
  { id: 2, type: "can", name: "Trần Thị B - Cần máu khẩn cấp", distance: 8 },
  { id: 3, type: "lichsu", name: "Lê Văn C - Đã hiến và cần máu", distance: 12 },
  { id: 4, type: "hien", name: "Phạm Thị D - Đăng ký hiến máu", distance: 5 },
];

export const useBloodDonationData = () => {
  const [data, setData] = useState<BloodDonationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
      return mockData;
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getData };
};