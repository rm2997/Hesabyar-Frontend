import endpoints from "../endpoints";
import axios from "axios";

export const login = async (data) => {
  return axios.post(endpoints.auth.login, data);
};

export const register = async (data) => {
  return axios.post(endpoints.auth.register, data);
};

export const logout = async () => {
  return axios.post(endpoints.auth.logout);
};
