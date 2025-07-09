import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";
import { sendUpdateProformaSms } from "../smsUtils";

export const CreateProforma = async (proformaData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.proforma.create,
    data: proformaData,
  });

  // try {
  //   const response = await axiosClient.post(
  //     endpoints.proforma.create,
  //     proformaData
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const ConvertProformaToInvoice = async (id) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.proforma.convert(id),
  });
  // try {
  //   const response = await axiosClient.put(endpoints.proforma.convert(id));
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const UpdateProforma = async (id, proformaData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.proforma.update(id),
    data: proformaData,
  });

  // try {
  //   const response = await axiosClient.put(
  //     endpoints.proforma.update(id),
  //     proformaData
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const SetProformaIsSent = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.proforma.setProformaIsSent(id),
  });
  // try {
  //   const resp = await axiosClient.patch(
  //     endpoints.proforma.setProformaIsSent(id)
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

export const SetProformaIsAccepted = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.proforma.setProformaIsAccepted(id),
  });

  // try {
  //   const resp = await axiosClient.patch(
  //     endpoints.proforma.setProformaIsAccepted(id)
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

export const RemoveProforma = async (id) => {
  return apiRequest({ method: "DELETE", url: endpoints.proforma.delete(id) });
  // try {
  //   console.log(id);

  //   const response = await axiosClient.delete(endpoints.proforma.delete(id));
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
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

  // try {
  //   const response = await axiosClient.get(
  //     endpoints.proforma.listAll(page, limit, search)
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const ShowProformasByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.proforma.listOne(id),
  });

  // try {
  //   const response = await axiosClient.get(endpoints.proforma.listOne(id));
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
  //     throw new Error(`مشکلی در ارسال درخواست رخ داد : ${error.message}`);
  //   }
  // }
};

export const ShowProformasByToken = async (token) => {
  return apiRequest({
    method: "GET",
    url: endpoints.proforma.listByToken(token),
  });

  // try {
  //   const response = await axiosClient.get(
  //     endpoints.proforma.listByToken(token)
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

export const UpdateProformCustomerFile = async (token, data) => {
  // return apiRequest({
  //   method: "PATCH",
  //   url: endpoints.proforma.updateProformCustomerFile(token),
  //   data: data,
  // });

  try {
    const response = await axiosClient.patch(
      endpoints.proforma.updateProformCustomerFile(token),
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

export const GenerateNewToken = async (id) => {
  return apiRequest({
    method: "POST",
    url: endpoints.proforma.generateNewToken(id),
  });

  // try {
  //   const response = await axiosClient.post(
  //     endpoints.proforma.generateNewToken(id)
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

export const SendUpdateProformaSms = async (customer, mobileNumber, link) => {
  try {
    const resp = await sendUpdateProformaSms(customer, mobileNumber, link);
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

export const ShowProformaApprovedFile = async (id) => {
  // return apiRequest({
  //   method: "GET",
  //   url: endpoints.proforma.getApprovedFile(id),
  // });
  try {
    const resp = await axiosClient.get(endpoints.proforma.getApprovedFile(id), {
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
