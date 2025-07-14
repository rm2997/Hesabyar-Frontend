import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";
import { sendUpdateInvoiceSms } from "../smsUtils";

export const CreateInvoice = async (invoiceData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.invoice.create,
    data: invoiceData,
  });

  // try {
  //   console.log(invoiceData);
  //   const response = await axiosClient.post(
  //     endpoints.invoice.create,
  //     invoiceData
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

export const UpdateInvoice = async (id, invoiceData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.invoice.update(id),
    data: invoiceData,
  });
  // try {
  //   const response = await axiosClient.put(
  //     endpoints.invoice.update(id),
  //     invoiceData
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

export const RemoveInvoice = async (id) => {
  return apiRequest({
    method: "DELETE",
    url: endpoints.invoice.delete(id),
  });

  // try {
  //   console.log(id);

  //   const response = await axiosClient.delete(endpoints.invoice.delete(id));
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

export const ShowUserAllInvoices = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listAll(page, limit, search),
  });

  // try {
  //   const response = await axiosClient.get(
  //     endpoints.invoice.listAll(page, limit, search)
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

export const ShowInvoicesByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listOne(id),
  });

  // try {
  //   const response = await axiosClient.get(endpoints.invoice.listOne(id));
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

export const SetInvoiceIsAccepted = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsAccepted(id),
  });

  // try {
  //   const resp = await axiosClient.patch(
  //     endpoints.invoice.setInvoiceIsAccepted(id)
  //   );
  //   if (!resp) throw new Error();
  //   return resp;
  // } catch (error) {
  //   if (error.response) {
  //     // پاسخ از سمت سرور (۴xx یا ۵xx)
  //     throw new Error(error.response.data?.message || "خطای سرور");
  //   } else if (error.request) {
  //     // درخواست فرستاده شده ولی پاسخی نیومده
  //     throw new Error("پاسخی از سرور دریافت نشد");
  //   } else {
  //     // خطای دیگر (مثلاً در خود کد)
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const ShowInvoiceApprovedFile = async (id) => {
  // return apiRequest({
  //   method: "GET",
  //   url: endpoints.invoice.getApprovedFile(id),
  //   headers: { responseType: "blob" },
  // });

  try {
    const resp = await axiosClient.get(endpoints.invoice.getApprovedFile(id), {
      responseType: "blob",
    });
    return resp;
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
    }
  }
};

export const GenerateNewToken = async (id) => {
  return apiRequest({
    method: "POST",
    url: endpoints.invoice.generateNewToken(id),
  });

  // try {
  //   const response = await axiosClient.post(
  //     endpoints.invoice.generateNewToken(id)
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

export const SendUpdateInvoiceSms = async (customer, mobileNumber, link) => {
  try {
    const resp = await sendUpdateInvoiceSms(customer, mobileNumber, link);
    return resp;
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
    }
  }
};

export const ShowInvoiceByToken = async (token) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listByToken(token),
  });
  // try {

  //   const response = await axiosClient.get(
  //     endpoints.invoice.listByToken(token)
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

export const UpdateInvoiceCustomerFile = async (token, data) => {
  // return apiRequest({
  //   method: "PATCH",
  //   url: endpoints.invoice.updateProformCustomerFile(token),
  //   data: data,
  // });
  try {
    const response = await axiosClient.patch(
      endpoints.invoice.updateProformCustomerFile(token),
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

export const SetInvoiceIsSent = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsSent(id),
  });
  // try {
  //   const resp = await axiosClient.patch(
  //     endpoints.invoice.setInvoiceIsSent(id)
  //   );
  //   if (!resp) throw new Error();
  //   return resp;
  // } catch (error) {
  //   if (error.response) {
  //     // پاسخ از سمت سرور (۴xx یا ۵xx)
  //     throw new Error(error.response.data?.message || "خطای سرور");
  //   } else if (error.request) {
  //     // درخواست فرستاده شده ولی پاسخی نیومده
  //     throw new Error("پاسخی از سرور دریافت نشد");
  //   } else {
  //     // خطای دیگر (مثلاً در خود کد)
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};
