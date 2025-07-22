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
  return apiRequest({
    method: "PATCH",
    url: endpoints.depot.updateDepotImageFile(id),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });

  // try {
  //   const response = await axiosClient.patch(
  //     endpoints.depot.updateDepotImageFile(id),
  //     data,
  //     { headers: { "Content-Type": "multipart/form-data" } }
  //   );
  //   if (!response) throw new Error();
  //   return response;
  // } catch (error) {
  //   if (error.response) {
  //     // پاسخ از سمت سرور (۴xx یا ۵xx)
  //     throw new Error(error?.response?.data?.message || "خطای سرور");
  //   } else if (error?.request) {
  //     // درخواست فرستاده شده ولی پاسخی نیومده
  //     throw new Error("پاسخی از سرور دریافت نشد");
  //   } else {
  //     // خطای دیگر (مثلاً در خود کد)
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const UpdateDepot = async (id, depotData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.depot.update(id),
    data: depotData,
  });
};
export const ShowDepotImageFile = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.depot.getDepotImageFile(id),
    responseType: "blob",
  });
};

export const UploadDepotsFile = async (formData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.depot.create,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
  // try {
  //   const response = await axiosClient.post(
  //     endpoints.depot.uploadExcel,
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

export const ShowAllDepots = async (
  page = 1,
  limit = 10,
  type,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.depot.listAll(page, limit, type, search),
  });
};

export const SetDepotIsAccepted = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.depot.setDepotIsAccepted(id),
  });
};
