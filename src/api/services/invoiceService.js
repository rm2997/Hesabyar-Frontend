import axiosClient from "../axiosClient";
import endpoints from "../endpoints";

export const CreateInvoice = async (invoiceData) => {
  try {
    console.log(invoiceData);
    const response = await axiosClient.post(
      endpoints.invoice.create,
      invoiceData
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

export const UpdateInvoice = async (id, invoiceData) => {
  try {
    const response = await axiosClient.put(
      endpoints.invoice.update(id),
      invoiceData
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

export const RemoveInvoice = async (id) => {
  try {
    console.log(id);

    const response = await axiosClient.delete(endpoints.invoice.delete(id));
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

export const ShowUserAllInvoices = async () => {
  try {
    const response = await axiosClient.get(endpoints.invoice.listAll);
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

export const ShowInvoicesByID = async (id) => {
  try {
    const response = await axiosClient.get(endpoints.invoice.listOne(id));
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
