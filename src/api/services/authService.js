import endpoints from "../endpoints";
import axiosClient, { apiRequest } from "../axiosClient";

export const login = async (data) => {
  return apiRequest({ method: "POST", url: endpoints.auth.login, data: data });
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

export const refreshTokens = async (oldRefreshToken) => {
  try {
    if (!oldRefreshToken) return;
    const data = {
      refreshToken: oldRefreshToken,
    };
    const response = await axiosClient.post(endpoints.auth.refresh, data);
    return response;
  } catch (error) {}
};
