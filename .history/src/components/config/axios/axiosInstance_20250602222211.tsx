import axios from 'axios';

const config = {
  baseURL: "https://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
};

const api = axios.create(config);

export default api;
