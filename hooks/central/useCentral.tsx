import { useEffect, useState } from "react";
import useCentralService from "./useCentralService";

// ---- Pagination meta ----
export interface PaginationMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

// ---- Working schedule ----
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface WorkingInfo {
  working_id: string;
  day_of_week: DayOfWeek;
  open_time: string; // ISO 8601
  close_time: string; // ISO 8601
  is_open: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Central blood‑center ----
export interface CentralBlood {
  centralBlood_id: number;
  centralBlood_name: string;
  centralBlood_address: string;
  working_id: WorkingInfo;
}

// ---- Full API response ----
export interface CentralBloodApiResponse {
  meta: PaginationMeta;
  result: CentralBlood[];
}

export default function useCentral() {
  const [central, setCentral] = useState<CentralBlood[]>([]);
  const { getAllCentral } = useCentralService();

  const fetchCentral = async () => {
    const response = (await getAllCentral()) as {
      data: CentralBloodApiResponse;
    };
    setCentral(response.data.result || []);
  };

  useEffect(() => {
    fetchCentral();
  }, []);

  return { central, setCentral, fetchCentral }; // 🟢 export fetchCentral đúng cách
}
