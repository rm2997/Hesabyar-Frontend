export const getAccessToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("token", accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem("token");
};

export const loadToken = () => {
  return localStorage.getItem("token");
};
