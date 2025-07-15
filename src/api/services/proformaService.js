import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateProforma = async (proformaData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.proforma.create,
    data: proformaData,
  });
};

export const ConvertProformaToInvoice = async (id) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.proforma.convert(id),
  });
};

export const UpdateProforma = async (id, proformaData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.proforma.update(id),
    data: proformaData,
  });
};

export const SetProformaIsSent = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.proforma.setProformaIsSent(id),
  });
};

export const SetProformaIsAccepted = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.proforma.setProformaIsAccepted(id),
  });
};

export const RemoveProforma = async (id) => {
  return apiRequest({ method: "DELETE", url: endpoints.proforma.delete(id) });
};

export const ShowUserAllProformas = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.proforma.listAll(page, limit, search),
  });
};

export const ShowProformasByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.proforma.listOne(id),
  });
};

export const ShowProformasByToken = async (token) => {
  return apiRequest({
    method: "GET",
    url: endpoints.proforma.listByToken(token),
  });
};

export const UpdateProformCustomerFile = async (token, data) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.proforma.updateProformCustomerFile(token),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });

  // try {
  //   const response = await axiosClient.patch(
  //     endpoints.proforma.updateProformCustomerFile(token),
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

export const GenerateNewToken = async (id) => {
  return apiRequest({
    method: "POST",
    url: endpoints.proforma.generateNewToken(id),
  });
};

// export const SendUpdateProformaSms = async (customer, mobileNumber, link) => {
//   try {
//     const resp = await sendUpdateProformaSms(customer, mobileNumber, link);
//     return resp;
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
//     }
//   }
// };

export const ShowProformaApprovedFile = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.proforma.getApprovedFile(id),
    responseType: "blob",
  });
};
