import { api } from "../../components/config/axios/axiosInstance";
import { useAuth } from "../User/useAuth";

const API_URL = "http://localhost:3000/api/v1/donate-bloods";

export interface DonateBloodPayload {
  date_donate: string; // ISO format
  centralBlood_id: number;
}

export default function useDonateBloodService() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // GET all donate blood records
  const getAllDonateBloods = async (
    current: number,
    pageSize: number,
    qs?: string
  ) => {
    const url = `${API_URL}?current=${current}&pageSize=${pageSize}${
      qs ? `&qs=${qs}` : ""
    }`;
    const res = await api.get(url, authHeaders);
    return res.data;
  };

  // POST - create new donate blood record
  const createDonateBlood = async (payload: DonateBloodPayload) => {
    const res = await api.post(API_URL, payload, authHeaders);
    return res.data;
  };

  // GET by ID
  const getDonateBloodById = async (id: string) => {
    const res = await api.get(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  // PATCH by ID
  const updateDonateBlood = async (
    id: string,
    payload: Partial<DonateBloodPayload>
  ) => {
    const res = await api.patch(`${API_URL}/${id}`, payload, authHeaders);
    return res.data;
  };

  // DELETE by ID
  const deleteDonateBlood = async (id: string) => {
    const res = await api.delete(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };
  const getDonateHistoryByUser = async () => {
    const res = await api.get(`${API_URL}/history/user`, authHeaders);
    return res.data;
  };
  return {
    getAllDonateBloods,
    createDonateBlood,
    getDonateBloodById,
    updateDonateBlood,
    deleteDonateBlood,
    getDonateHistoryByUser
  };
}
