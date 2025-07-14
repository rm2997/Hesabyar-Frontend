import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateDepot = async (DepotData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.depot.create,
    data: DepotData,
  });
};

export const UpdateDepotImageFile = async (id, data) => {
  try {
    const response = await axiosClient.patch(
      endpoints.depot.updateDepotImageFile(id),
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (!response) throw new Error();
    return response;
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error?.response?.data?.message || "خطای سرور");
    } else if (error?.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
    }
  }
};

export const UpdateDepot = async (id, DepotData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.depot.update(id),
    data: DepotData,
  });
};

export const UploadDepotsFile = async (formData) => {
  // return apiRequest({
  //   method: "POST",
  //   url: endpoints.depot.create,
  //   data: formData,
  // });
  try {
    const response = await axiosClient.post(
      endpoints.depot.uploadExcel,
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

export const RemoveDepot = async (id) => {
  return apiRequest({
    method: "DELETE",
    url: endpoints.depot.delete(id),
  });
};

export const ShowDepotByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.depot.listOne(id),
  });
};

export const ShowAllDepots = async (page = 1, limit = 10, search = "") => {
  return apiRequest({
    method: "GET",
    url: endpoints.depot.listAll(page, limit, search),
  });
};
