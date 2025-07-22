import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";
import { sendUpdateInvoiceSms } from "../smsUtils";

export const CreateInvoice = async (invoiceData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.invoice.create,
    data: invoiceData,
  });
};

export const UpdateInvoice = async (id, invoiceData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.invoice.update(id),
    data: invoiceData,
  });
};

export const RemoveInvoice = async (id) => {
  return apiRequest({
    method: "DELETE",
    url: endpoints.invoice.delete(id),
  });
};

export const ShowAllInvoices = async (page = 1, limit = 10, search = "") => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listAll(page, limit, search),
  });
};

export const ShowUserAllInvoices = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listMy(page, limit, search),
  });
};

export const ShowInvoicesByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listOne(id),
  });
};

export const SetInvoiceIsAccepted = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsAccepted(id),
  });
};

export const ShowInvoiceApprovedFile = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.getApprovedFile(id),
    responseType: "blob",
  });
};

export const GenerateNewToken = async (id) => {
  return apiRequest({
    method: "POST",
    url: endpoints.invoice.generateNewToken(id),
  });
};

// export const SendUpdateInvoiceSms = async (customer, mobileNumber, link) => {
//   try {
//     const resp = await sendUpdateInvoiceSms(customer, mobileNumber, link);
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

export const ShowInvoiceByToken = async (token) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listByToken(token),
  });
};

export const UpdateInvoiceCustomerFile = async (token, data) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.updateProformCustomerFile(token),
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
  // try {
  //   const response = await axiosClient.patch(
  //     endpoints.invoice.updateProformCustomerFile(token),
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

export const SetInvoiceIsSent = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsSent(id),
  });
};
