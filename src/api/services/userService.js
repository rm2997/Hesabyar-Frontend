import axiosClient, { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";
import { sendForgetPassSms, sendLocationSms } from "../smsUtils";

export const login = async (data) => {
  try {
    return axiosClient.post(endpoints.auth.login, data);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const register = async (data) => {
  try {
    return axiosClient.post(endpoints.auth.register, data);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const logout = async () => {
  try {
    return await axiosClient.post(endpoints.auth.logout);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const GetAllUsers = async (page = 1, limit = 10, search = "") => {
  try {
    return await axiosClient.get(endpoints.user.listAll(page, limit, search));
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const GetUserByToken = async (token) => {
  try {
    const response = await axiosClient.get(endpoints.user.findByToken(token));
    if (!response) throw new Error(response.statusText);
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
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const GetUserByMobileNumber = async (mobile) => {
  try {
    return await axiosClient.get(endpoints.user.findByMobile(mobile));
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const CreateUser = async (userData) => {
  try {
    return await axiosClient.post(endpoints.user.create, userData);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const RemoveUser = async (id) => {
  try {
    return await axiosClient.delete(endpoints.user.update(id));
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const UpdateUser = async (id, userData) => {
  try {
    return await axiosClient.put(endpoints.user.update(id), userData);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

// export const ChangePassFromOut = async (passwordData) => {
//   try {
//     const response = await axiosClient.put(
//       endpoints.user.changePassExternal,
//       passwordData
//     );
//     return response;
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       console.log(error);
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };

export const ChangePassFromOut = async (passwordData) => {
  const result = await apiRequest({
    method: "PUT",
    url: endpoints.user.changePassExternal,
    data: passwordData,
  });
  return result;
};

export const ChangePass = async (id, userData) => {
  try {
    return await axiosClient.put(endpoints.user.changePass(id), userData);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const UpdateUserLocation = async (location) => {
  try {
    return await axiosClient.put(endpoints.user.setLocation, location);
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error.response.data?.message || "خطای سرور");
    } else if (error.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const SendLocationSms = async (mobileNumber, userName) => {
  try {
    const resp = await sendLocationSms(mobileNumber, userName);
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
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const SendForgetPassSms = async (userInfo, mobileNumber, token) => {
  try {
    const resp = await sendForgetPassSms(userInfo, mobileNumber, token);
    if (!resp) throw new Error();
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
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};
