import axiosClient from "../axiosClient";
import endpoints from "../endpoints";

export const CreateUnit = async (unitData) => {
  try {
    const response = await axiosClient.post(endpoints.unit.create, unitData);
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

export const UpdateUnit = async (id, unitData) => {
  try {
    const response = await axiosClient.put(endpoints.unit.update(id), unitData);
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

export const RemoveUnit = async (id) => {
  try {
    const response = await axiosClient.delete(endpoints.unit.delete(id));
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

export const ShowUnitByID = async (id) => {
  try {
    const response = await axiosClient.get(endpoints.unit.listOne(id));
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

export const ShowAllUnits = async () => {
  try {
    const response = await axiosClient.get(endpoints.unit.listAll);
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
