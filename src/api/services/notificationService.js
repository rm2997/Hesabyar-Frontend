import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const ShowUserSndNotifications = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.notifications.listSent(page, limit, search),
  });
  // try {
  //   const response = await axiosClient.get(
  //     endpoints.notifications.listSent(page, limit, search)
  //   );
  //   console.log(response);
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

export const ShowUserRcvAllNotifications = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.notifications.listReceived(page, limit, search),
  });
  // try {
  //   const response = await axiosClient.get(
  //     endpoints.notifications.listReceived(page, limit, search)
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

export const ShowNotificationByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.notifications.listOne(id),
  });

  // try {
  //   const response = await axiosClient.get(endpoints.notifications.listOne(id));
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

export const ShowUnreadNotificationsCount = async () => {
  return apiRequest({
    method: "GET",
    url: endpoints.notifications.unreadCount,
  });
  // try {
  //   const response = await axiosClient.get(endpoints.notifications.unreadCount);
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

export const MarkNotificationAsUnread = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.notifications.markAsunread(id),
  });
  // try {
  //   const response = await axiosClient.patch(
  //     endpoints.notifications.markAsunread(id)
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

export const MarkNotificationAsRead = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.notifications.markAsRead(id),
  });
  // try {
  //   const response = await axiosClient.patch(
  //     endpoints.notifications.markAsRead(id)
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

export const ShowNotifictionById = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.notifications.listOne(id),
  });

  // try {
  //   const response = await axiosClient.get(endpoints.notifications.listOne(id));
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

export const CreateNotification = async (notifData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.notifications.create,
    data: notifData,
  });

  // try {
  //   const response = await axiosClient.post(
  //     endpoints.notifications.create,
  //     notifData
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

export const UpdateNotification = async (id, notifData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.notifications.update(id),
    data: notifData,
  });
  // try {
  //   const response = await axiosClient.put(
  //     endpoints.notifications.update(id),
  //     notifData
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

export const RemoveNotification = async (id) => {
  return apiRequest({
    method: "DELETE",
    url: endpoints.notifications.delete(id),
  });

  // try {
  //   console.log(id);

  //   const response = await axiosClient.delete(
  //     endpoints.notifications.delete(id)
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
