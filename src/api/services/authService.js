import endpoints from "../endpoints";
import { apiRequest } from "../axiosClient";

export const login = async (data) => {
  return apiRequest({ method: "POST", url: endpoints.auth.login, data: data });
};

export const sendValidationKeyAgain = async (data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.auth.resendValidationKey,
    data: data,
  });
};

export const secondLogin = async (data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.auth.secondLogin,
    data: data,
  });
};

export const GetNewCaptcha = async () => {
  return await apiRequest({
    method: "GET",
    url: endpoints.auth.newCaptcha,
  });
};

// export const refreshTokens = async (oldRefreshToken) => {
//   try {
//     if (!oldRefreshToken) return;
//     const data = {
//       refreshToken: oldRefreshToken,
//     };
//     const response = await axiosClient.post(endpoints.auth.refresh, data);
//     return response;
//   } catch (error) {}
//};
