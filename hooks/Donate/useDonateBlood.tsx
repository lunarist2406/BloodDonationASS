import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuthContext';
import api from '@/config/axiosInstance';

const API_URL = 'api/v1/donate-bloods';

interface DonateBloodPayload {
  date_donate: string;
  centralBlood_id: number;
}

interface DonateBlood {
  _id: string;
  date_donate: string;
  centralBlood_id: number;
  // add more fields if needed
}

interface DonateBloodContextType {
  allDonateBloods: DonateBlood[] | null;
  donateHistory: DonateBlood[] | null;
  getAllDonateBloods: (current: number, pageSize: number, qs?: string) => Promise<void>;
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
      setAllDonateBloods(res.data.data || res.data); // tuỳ vào backend structure
    } catch (err) {
      console.error('Lỗi lấy danh sách hiến máu:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getDonateHistoryByUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}/history/user`, authHeaders);
      setDonateHistory(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi lấy lịch sử hiến máu:', err);
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

  // Auto fetch lịch sử hiến máu của user
  useEffect(() => {
    if (token) {
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
