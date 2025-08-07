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
  // try {
  //   const response = await axiosClient.post(
  //     endpoints.good.uploadExcel,
  //     formData,
  //     { headers: { "Content-Type": "multipart/form-data" } }
  //   );
  //   return response;
  // } catch (error) {
  //   if (error.response) {
  //     // پاسخ از سمت سرور (۴xx یا ۵xx)
  //     throw new Error(error.response.data?.message || "خطای سرور");
  //   } else if (error.request) {
  //     // درخواست فرستاده شده ولی پاسخی نیومده
  //     throw new Error("پاسخی از سرور دریافت نشد");
  //   } else {
  //     // خطای دیگر (مثلاً در خود کد)
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد-s${error.message}`);
  //   }
  // }
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

export const ShowAllGoods = async (page = 1, limit = 10, search = "") => {
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
