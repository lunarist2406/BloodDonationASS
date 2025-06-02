import axios from "axios";

const config = {
  baseURL: "https://localhost:3000",
  withCredentials: true
  headers: {
    "Content-Type": "application/json",
  },
};

const api = axios.create(config);

export default api;
