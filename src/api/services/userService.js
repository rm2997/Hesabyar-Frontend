import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";
import { sendForgetPassSms, sendLocationSms } from "../smsUtils";

export const Login = async (data) => {
  return apiRequest({
    method: "POST",
    url: endpoints.auth.login,
    data: data,
  });
};
// export const Login = async (data) => {
//   try {
//     return axiosClient.post(endpoints.auth.login, data);
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };
export const Register = async (data) => {
  return apiRequest({
    method: "POST",
    url: endpoints.auth.register,
    data: data,
  });
};
// export const Register = async (data) => {
//   try {
//     return axiosClient.post(endpoints.auth.register, data);
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };
export const Logout = async () => {
  return await apiRequest({ method: "POST", url: endpoints.auth.logout });
};

// export const logout = async () => {
//   try {
//     return await axiosClient.post(endpoints.auth.logout);
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };
export const GetAllUsers = async (page = 1, limit = 10, search = "") => {
  return await apiRequest({
    method: "GET",
    url: endpoints.user.listAll(page, limit, search),
  });
};
// export const GetAllUsers = async (page = 1, limit = 10, search = "") => {
//   try {
//     return await axiosClient.get(endpoints.user.listAll(page, limit, search));
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };

export const GetUserByUserid = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.user.findById(id),
  });
};

export const CheckUserPassword = async (id, password) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.user.checkPassword(id),
    data: { password: password },
  });
};

export const GetUserByToken = async (token) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.user.findByToken(token),
  });
};
// export const GetUserByToken = async (token) => {
//   try {
//     const response = await axiosClient.get(endpoints.user.findByToken(token));
//     if (!response) throw new Error(response.statusText);
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
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };

export const GetUserByMobileNumber = async (mobile) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.user.findByMobile(mobile),
  });
};

// export const GetUserByMobileNumber = async (mobile) => {
//   try {
//     return await axiosClient.get(endpoints.user.findByMobile(mobile));
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };

export const CreateUser = async (userData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.user.create,
    data: userData,
  });
};

export const RemoveUser = async (id) => {
  return apiRequest({ method: "DELETE", url: endpoints.user.delete(id) });
};

export const UpdateUser = async (id, userData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.user.update(id),
    data: userData,
  });
};

export const ChangePassFromOut = async (passwordData) => {
  const result = await apiRequest({
    method: "PUT",
    url: endpoints.user.changePassExternal,
    data: passwordData,
  });
  return result;
};

export const ChangePass = async (id, userData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.user.changePass(id),
    data: userData,
  });
};

export const UpdateUserLocation = async (location) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.user.setLocation,
    data: location,
  });
};
// export const UpdateUserLocation = async (location) => {
//   try {
//     return await axiosClient.put(endpoints.user.setLocation, location);
//   } catch (error) {
//     if (error.response) {
//       // پاسخ از سمت سرور (۴xx یا ۵xx)
//       throw new Error(error.response.data?.message || "خطای سرور");
//     } else if (error.request) {
//       // درخواست فرستاده شده ولی پاسخی نیومده
//       throw new Error("پاسخی از سرور دریافت نشد");
//     } else {
//       // خطای دیگر (مثلاً در خود کد)
//       throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
//     }
//   }
// };

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
