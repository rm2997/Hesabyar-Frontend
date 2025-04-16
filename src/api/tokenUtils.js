export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const loadTokens = () => {
  const access_token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { access_token, refreshToken };
};
