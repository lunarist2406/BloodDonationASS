import { api } from "../../components/config/axios/axiosInstance";
import type { CreateOrUpdateNewsPayload, NewsListResponse, SingleNewsResponse } from "../../constraint/news";
import { useAuth } from "../User/useAuth";


const NEWS_API = "/api/v1/news";

export default function useNewsService() {

  const { token } = useAuth();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getNewsList = async (
    current: number = 1,
    pageSize: number = 10,
    qs: string = ""
  ): Promise<NewsListResponse> => {
    const res = await api.get<NewsListResponse>(
      `${NEWS_API}?current=${current}&pageSize=${pageSize}${qs && `&qs=${qs}`}`,
      authHeaders
    ) ;
    return res.data;
  };

  const getNewsById = async (id: number): Promise<SingleNewsResponse> => {
    const res = await api.get<SingleNewsResponse>(`${NEWS_API}/${id}`, authHeaders);
    return res.data;
  };

  const createNews = async (
    payload: CreateOrUpdateNewsPayload
  ): Promise<SingleNewsResponse> => {
    const res = await api.post<SingleNewsResponse>(NEWS_API, payload, authHeaders);
    return res.data;
  };

  const updateNews = async (
    id: number,
    payload: CreateOrUpdateNewsPayload
  ): Promise<SingleNewsResponse> => {
    const res = await api.patch<SingleNewsResponse>(`${NEWS_API}/${id}`, payload, authHeaders);
    return res.data;
  };

  const deleteNews = async (
    id: number
  ): Promise<{ statusCode: number; message: string; data: { deleted: number } }> => {
    const res = await api.delete<{ statusCode: number; message: string; data: { deleted: number } }>(`${NEWS_API}/${id}`, authHeaders);
    return res.data;
  };

  return {
    getNewsList,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
  };
}
