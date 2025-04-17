import axios from "axios";

// 取得 CSRF Token (通常會存放在 meta 標籤中)
const getCsrfToken = () => {
  const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
  return csrfToken ? csrfToken.content : "";
};

// 創建 axios 實例
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": getCsrfToken(),
  },
});

api.interceptors.request.use(
  (config) => {
    // 每次請求動態設定 CSRF Token
    const token = getCsrfToken();
    if (token) {
      config.headers["X-XSRF-TOKEN"] = token;
    }
    // 每次請求動態設定 Authorization Token
    const authToken = localStorage.getItem("token");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
