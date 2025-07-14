import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateGood = async (GoodData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.good.create,
    data: GoodData,
  });
  // try {
  //   const response = await axiosClient.post(endpoints.good.create, GoodData);
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

export const UpdateGood = async (id, GoodData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.good.update(id),
    data: GoodData,
  });
  // try {
  //   const response = await axiosClient.put(endpoints.good.update(id), GoodData);
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

export const UploadGoodsFile = async (formData) => {
  // return apiRequest({
  //   method: "POST",
  //   url: endpoints.good.create,
  //   data: formData,
  // });
  try {
    const response = await axiosClient.post(
      endpoints.good.uploadExcel,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
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

export const RemoveGood = async (id) => {
  return apiRequest({
    method: "DELETE",
    url: endpoints.good.delete(id),
  });
  // try {
  //   const response = await axiosClient.delete(endpoints.good.delete(id));
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

export const ShowGoodByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.good.listOne(id),
  });
  // try {
  //   const response = await axiosClient.get(endpoints.good.listOne(id));
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

export const ShowAllGoods = async (page = 1, limit = 10, search = "") => {
  return apiRequest({
    method: "GET",
    url: endpoints.good.listAll(page, limit, search),
  });
  // try {
  //   const response = await axiosClient.get(
  //     endpoints.good.listAll(page, limit, search)
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
  //   }
  // }
};

export const ShowGoodsByCount = async (count) => {
  return apiRequest({ method: "GET", url: endpoints.good.listCount(count) });
  // try {
  //   const response = await axiosClient.get(endpoints.good.listCount(count));
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
  //   }
  // }
};
