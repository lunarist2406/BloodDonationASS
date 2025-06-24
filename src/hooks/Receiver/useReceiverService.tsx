import { useAuth } from "../User/useAuth";
import { api } from "../../components/config/axios/axiosInstance";

const BASE_URL = "/api/v1/receiver-bloods";

export default function useReceiverService() {
  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // GET: all with pagination & filter
  const getAllReceiverBloods = async ({
    current = 1,
    pageSize = 10,
    qs = "",
  }) => {
    const res = await api.get(
      `${BASE_URL}?current=${current}&pageSize=${pageSize}&qs=${qs}`,
      authHeaders
    );
    return res.data;
  };

  // GET: by receiver_id
  const getReceiverById = async (receiver_id: string) => {
    const res = await api.get(`${BASE_URL}/${receiver_id}`, authHeaders);
    return res.data;
  };

  // ✅ NEW: GET history
  const getReceiverHistoryById = async () => {
    const res = await api.get(`${BASE_URL}/history`, authHeaders);
    return res.data;
  };

  // GET: by centralBlood_id
  const getByCentralBlood = async (centralBlood_id: string) => {
    const res = await api.get(
      `${BASE_URL}/central-blood/${centralBlood_id}`,
      authHeaders
    );
    return res.data;
  };

  // GET: by email
  const getByEmail = async (email: string) => {
    const res = await api.get(`${BASE_URL}/${email}`, authHeaders);
    return res.data;
  };

  // POST: create
  const createReceiver = async (data: any) => {
    const res = await api.post(BASE_URL, data, authHeaders);
    return res.data;
  };

  // PATCH: update
  const updateReceiver = async (receiver_id: string, data: any) => {
    const res = await api.patch(
      `${BASE_URL}/${receiver_id}`,
      data,
      authHeaders
    );
    return res.data;
  };

  // DELETE
  const deleteReceiver = async (receiver_id: string) => {
    const res = await api.delete(`${BASE_URL}/${receiver_id}`, authHeaders);
    return res.data;
  };

  return {
    getAllReceiverBloods,
    getReceiverById,
    getReceiverHistoryById, // ✅ return new method
    getByCentralBlood,
    getByEmail,
    createReceiver,
    updateReceiver,
    deleteReceiver,
  };
}
