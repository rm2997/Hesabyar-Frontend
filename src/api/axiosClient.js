import axios from "axios";
import { clearTokens, loadTokens } from "./tokenUtils";

//const BASE_URL = "http://localhost:3001";
const BASE_URL =
  process.env.NODE_ENV == "production"
    ? "https://api.hesab-yaar.ir"
    : "http://localhost:3001";
const axiosClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const { accessToken } = loadTokens();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err.response.status === 401) {
      clearTokens();

      if (window.location.href.endsWith("/login") === false)
        window.location.href = "/login";

      return Promise.reject(err);
    }
  }
);

export const apiRequest = async ({
  method,
  url,
  data = {},
  params = {},
  headers = {},
}) => {
  try {
    const response = await axiosClient({
      method,
      url,
      data,
      params,
      headers,
    });
    console.log(response);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log("error", error);
    let errorMessage = "خطای ناشناخته‌ای رخ داده است.";
    let statusCode = null;
    let serverErrorData = null;

    if (error.response) {
      // سرور پاسخ داده ولی با وضعیت خطا
      statusCode = error.response.status;
      serverErrorData = error.response.data;
      errorMessage = serverErrorData?.message || `خطا با کد ${statusCode}`;
    } else if (error.request) {
      // درخواست ارسال شده ولی پاسخی دریافت نشده
      errorMessage =
        "پاسخی از سرور دریافت نشد. ممکن است اتصال اینترنت شما مشکل داشته باشد.";
    } else {
      // خطا در تنظیمات Axios
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      status: statusCode,
      data: serverErrorData, // اینجا هم می‌تونیم محتوای خطای سرور رو برگردونیم
    };
  }
};

// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // اگر 401 خطا گرفتیم و هنوز توکن رفرش داریم
//     if (
//       error.response.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       console.log("401 response recieved");
//       const { refreshToken } = loadTokens(); // توکن رفرش از localStorage
//       try {
//         const { access_token } = await refreshTokens(refreshToken);
//         saveTokens(access_token);

//         // تنظیم هدر با accessToken جدید
//         axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

//         // مجدداً درخواست اصلی را ارسال می‌کنیم
//         return axiosClient(originalRequest);
//       } catch (error) {
//         // اگه توکن رفرش هم معتبر نباشه یا درخواست رفرش توکن شکست خورد
//         // باید لاگ‌اوت کنیم
//         console.error("Error refreshing token:", error);
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosClient;
