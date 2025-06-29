import { useState, useCallback } from "react";
import useSearchByDistanceService from "./useSearchByDistanceService";
import { BloodDonationData, SearchByDistanceDTO } from "./useSearchByDistanceFilter";

export const useSearchByDistanceData = () => {
  const [data, setData] = useState<BloodDonationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAllSearchByDistance } = useSearchByDistanceService();

  const getData = useCallback(async (searchByDistance: SearchByDistanceDTO) => {
    try {
      setLoading(true);
      setError(null);
      const res = (await getAllSearchByDistance(searchByDistance)) as {data : BloodDonationData[]};
      setData(res.data);
      return res;
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getData, setData };
};