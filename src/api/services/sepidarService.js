import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const sepidarTest = async () => {
  return await apiRequest({
    method: "GET",
    url: endpoints.sepidar.test,
  });
};

export const getSepidarConnectionData = async () => {
  return await apiRequest({
    method: "GET",
    url: endpoints.sepidar.connectionData,
  });
};

export const syncSepidarGoods = async () => {
  return await apiRequest({
    method: "POST",
    url: endpoints.sepidar.syncGoods,
  });
};

export const syncSepidarUnits = async () => {
  return await apiRequest({
    method: "POST",
    url: endpoints.sepidar.syncUnits,
  });
};
