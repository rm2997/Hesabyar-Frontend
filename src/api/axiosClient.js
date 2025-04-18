import axios from "axios";
import { loadTokens, saveTokens } from "./tokenUtils";
import { refreshTokens } from "./services/authService";

const BASE_URL = "http://localhost:3001";
const axiosClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor برای اضافه کردن Authorization Header
axiosClient.interceptors.request.use((config) => {
  const { access_token } = loadTokens();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // اگر 401 خطا گرفتیم و هنوز توکن رفرش داریم
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const { refreshToken } = loadTokens(); // توکن رفرش از localStorage
      try {
        const { access_token } = await refreshTokens(refreshToken);
        saveTokens(access_token);

        // تنظیم هدر با accessToken جدید
        axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

        // مجدداً درخواست اصلی را ارسال می‌کنیم
        return axiosClient(originalRequest);
      } catch (error) {
        // اگه توکن رفرش هم معتبر نباشه یا درخواست رفرش توکن شکست خورد
        // باید لاگ‌اوت کنیم
        console.error("Error refreshing token:", error);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
