export interface News {
  news_id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  link: string;
}

export interface NewsListResponse {
  statusCode: number;
  message: string;
  data: {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: News[];
  };
}

export interface SingleNewsResponse {
  statusCode: number;
  message: string;
  data: News;
}

export interface CreateOrUpdateNewsPayload {
  title: string;
  description: string;
  date: string;
  image: string;
  link: string;
}
