import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuthContext';
import api from '@/config/axiosInstance';

const API_URL = '/api/v1/receiver-bloods';

interface ReceiverBlood {
  receiver_id: string;
  email: string;
  fullName: string;
  phone: string;
  // Add more fields as necessary
}

interface ReceiverContextType {
  allReceivers: ReceiverBlood[] | null;
  receiverHistory: ReceiverBlood[] | null;
  getAllReceiverBloods: (current?: number, pageSize?: number, qs?: string) => Promise<void>;
  getReceiverById: (id: string) => Promise<ReceiverBlood>;
  getReceiverHistoryById: () => Promise<void>;
  getByCentralBlood: (id: string) => Promise<ReceiverBlood[]>;
  getByEmail: (email: string) => Promise<ReceiverBlood>;
  createReceiver: (data: any) => Promise<any>;
  updateReceiver: (id: string, data: any) => Promise<any>;
  deleteReceiver: (id: string) => Promise<any>;
  loading: boolean;
  error: any;
}

const ReceiverContext = createContext<ReceiverContextType | undefined>(undefined);

export const ReceiverProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [allReceivers, setAllReceivers] = useState<ReceiverBlood[] | null>(null);
  const [receiverHistory, setReceiverHistory] = useState<ReceiverBlood[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getAllReceiverBloods = async (current = 1, pageSize = 10, qs = '') => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}?current=${current}&pageSize=${pageSize}&qs=${qs}`, authHeaders);
      const results = res.data?.data?.results || [];
      setAllReceivers(results);
    } catch (err) {
      console.error('❌ Lỗi lấy danh sách người nhận máu:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getReceiverById = async (id: string) => {
    const res = await api.get(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  const getReceiverHistoryById = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_URL}/history`, authHeaders);
      setReceiverHistory(res.data?.data || []);
    } catch (err) {
      console.error('❌ Lỗi lấy lịch sử người nhận máu:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getByCentralBlood = async (centralBlood_id: string) => {
    const res = await api.get(`${API_URL}/central-blood/${centralBlood_id}`, authHeaders);
    return res.data;
  };

  const getByEmail = async (email: string) => {
    const res = await api.get(`${API_URL}/${email}`, authHeaders);
    return res.data;
  };

  const createReceiver = async (data: any) => {
    const res = await api.post(API_URL, data, authHeaders);
    return res.data;
  };

  const updateReceiver = async (id: string, data: any) => {
    const res = await api.patch(`${API_URL}/${id}`, data, authHeaders);
    return res.data;
  };

  const deleteReceiver = async (id: string) => {
    const res = await api.delete(`${API_URL}/${id}`, authHeaders);
    return res.data;
  };

  useEffect(() => {
    if (token) {
      getAllReceiverBloods();
      getReceiverHistoryById();
    }
  }, [token]);

  return (
    <ReceiverContext.Provider
      value={{
        allReceivers,
        receiverHistory,
        getAllReceiverBloods,
        getReceiverById,
        getReceiverHistoryById,
        getByCentralBlood,
        getByEmail,
        createReceiver,
        updateReceiver,
        deleteReceiver,
        loading,
        error,
      }}
    >
      {children}
    </ReceiverContext.Provider>
  );
};

export const useReceiver = () => {
  const context = useContext(ReceiverContext);
  if (!context) throw new Error('useReceiver must be used within ReceiverProvider');
  return context;
};