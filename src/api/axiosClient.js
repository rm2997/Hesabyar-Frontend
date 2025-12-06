import axios from "axios";
import { loadTokens } from "./tokenUtils";
const BASE_URL =
  process.env.NODE_ENV == "production"
    ? "https://api.hesab-yaar.ir"
    : "http://localhost:3001";
const axiosClient = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: process.env.NODE_ENV == "production" ? true : false,
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

export const apiRequest = async ({
  method,
  url,
  data = {},
  params = {},
  headers = {},
  responseType = "json",
}) => {
  try {
    const response = await axiosClient({
      method,
      url,
      data,
      params,
      headers,
      responseType: responseType,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    let errorMessage = "خطای ناشناخته‌ای رخ داده است.";
    let statusCode = null;
    let serverErrorData = null;

    if (error.response) {
      // سرور پاسخ داده ولی با وضعیت خطا
      statusCode = error.response.status;

      serverErrorData = error.response.data;

      switch (statusCode) {
        case 401:
          errorMessage = !error?.response?.data
            ? "نشست شما منقضی شده است یا شما دسترسی به این قسمت را ندارید، لطفا مجددا لاگین کنید"
            : error?.response?.data?.message;
          break;
        case 404:
          errorMessage = !error?.response?.data
            ? " اطلاعات مورد نظر موجود نیست "
            : error?.response?.data?.message;

          break;
        default:
          errorMessage = serverErrorData?.message || `خطا با کد ${statusCode}`;
          break;
      }
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
      data: serverErrorData,
    };
  }
};

export default axiosClient;
