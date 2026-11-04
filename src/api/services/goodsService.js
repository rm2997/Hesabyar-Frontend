import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateGood = async (GoodData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.good.create,
    data: GoodData,
  });
};

export const UpdateGood = async (id, GoodData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.good.update(id),
    data: GoodData,
  });
};

export const UploadGoodsFile = async (formData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.good.uploadExcel,
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  });
};

export const RemoveGood = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.good.delete(id),
  });
};

export const ShowGoodByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.good.listOne(id),
  });
};

export const ShowAllGoods = async (page = 1, limit = 12, search = "") => {
  return await apiRequest({
    method: "GET",
    url: endpoints.good.listAll(page, limit, search),
  });
};

export const ShowGoodsByCount = async (count) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.good.listCount(count),
  });
};

export const ShowGoodSaleListByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.good.saleList(id),
  });
};
export const UploadGoodPrices = async (data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.good.uploadPrices,
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
};

export const GetPriceList = async () => {
  return await apiRequest({
    method: "GET",
    url: endpoints.good.getPrices,
    responseType: "blob",
  });
};
