import api from '@/config/axiosInstance';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuthContext';

const API_URL = 'api/v1/donate-bloods';

interface CentralBlood {
  centralBlood_id: number;
  centralBlood_name: string;
  centralBlood_address: string;
  position?: {
    type: string;
    coordinates: [number, number];
  };
}

interface BloodInfo {
  blood_id: string;
}

interface InforHealth {
  user_id: {
    email: string;
    fullname: string;
    gender: string;
    user_id: string;
  };
  blood_id: string;
  height: number;
  weight_decimal: number;
  blood_pressure: number;
  medical_history: string;
  latest_donate: string;
  status_health: string;
  img_health: string;
}

interface DonateBlood {
  donate_id: string;
  date_donate: string;
  date_register: string;
  centralBlood_id: CentralBlood;
  blood_id: BloodInfo;
  status_regist: string;
  status_donate: string;
  infor_health?: InforHealth | null;
  ml: number;
  unit: number;
  updated_at: string;
}

interface DonateBloodPayload {
  date_donate: string;
  centralBlood_id: number;
}

interface DonateBloodContextType {
  allDonateBloods: DonateBlood[] | null;
  donateHistory: DonateBlood[] | null;
  getAllDonateBloods: (current?: number, pageSize?: number, qs?: string) => Promise<void>;
  getDonateHistoryByUser: () => Promise<void>;
  getDonateBloodById: (id: string) => Promise<DonateBlood>;
  createDonateBlood: (payload: DonateBloodPayload) => Promise<any>;
  updateDonateBlood: (id: string, payload: Partial<DonateBloodPayload>) => Promise<any>;
  deleteDonateBlood: (id: string) => Promise<any>;
  loading: boolean;
  error: any;
}

const DonateBloodContext = createContext<DonateBloodContextType | undefined>(undefined);

export const DonateBloodProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [allDonateBloods, setAllDonateBloods] = useState<DonateBlood[] | null>(null);
  const [donateHistory, setDonateHistory] = useState<DonateBlood[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

const getAllDonateBloods = async (current = 1, pageSize = 10, qs?: string) => {
  try {
    setLoading(true);
    const url = `${API_URL}?current=${current}&pageSize=${pageSize}${qs ? `&qs=${qs}` : ''}`;
    const res = await api.get(url, authHeaders);

    const results = res.data?.data?.results || [];
    setAllDonateBloods(results);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách hiến máu:', err);
    setError(err);
  } finally {
    setLoading(false);
  }
};


  const getDonateHistoryByUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}/history/user`, authHeaders);
      const history = res.data?.data || [];
      setDonateHistory(history);
    } catch (err) {
      console.error('❌ Lỗi lấy lịch sử hiến máu:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getDonateBloodById = async (id: string) => {
    const res = await api.get(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  const createDonateBlood = async (payload: DonateBloodPayload) => {
    const res = await api.post(API_URL, payload, authHeaders);
    return res.data;
  };

  const updateDonateBlood = async (id: string, payload: Partial<DonateBloodPayload>) => {
    const res = await api.patch(`${API_URL}/${id}`, payload, authHeaders);
    return res.data;
  };

  const deleteDonateBlood = async (id: string) => {
    const res = await api.delete(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  useEffect(() => {
    if (token) {
        getAllDonateBloods()
        getDonateHistoryByUser();
    }
  }, [token]);

  return (
    <DonateBloodContext.Provider
      value={{
        allDonateBloods,
        donateHistory,
        getAllDonateBloods,
        getDonateHistoryByUser,
        getDonateBloodById,
        createDonateBlood,
        updateDonateBlood,
        deleteDonateBlood,
        loading,
        error,
      }}
    >
      {children}
    </DonateBloodContext.Provider>
  );
};

export const useDonateBlood = () => {
  const context = useContext(DonateBloodContext);
  if (!context) throw new Error('useDonateBlood must be used within DonateBloodProvider');
  return context;
};
