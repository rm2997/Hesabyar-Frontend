import endpoints from "../endpoints";
import axiosClient from "../axiosClient";
import { clearTokens, saveTokens } from "../tokenUtils";

export const login = async (data) => {
  try {
    clearTokens();
    const response = await axiosClient.post(endpoints.auth.login, data);
    saveTokens(response.data.access_token, null);
    return response;
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-s${error.message}`);
    }
  }
};

export const sendResetLink = async (mobile) => {
  try {
    if (!mobile) return;
    const response = await axiosClient.post(
      endpoints.auth.forgetPassword,
      mobile
    );
    return response;
  } catch (error) {}
};
