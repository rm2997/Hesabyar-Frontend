import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const ShowUserSndNotifications = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.notifications.listSent(page, limit, search),
  });
};

export const ShowUserRcvAllNotifications = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.notifications.listReceived(page, limit, search),
  });
};

export const ShowNotificationByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.notifications.listOne(id),
  });
};

export const ShowUnreadNotificationsCount = async () => {
  return await apiRequest({
    method: "GET",
    url: endpoints.notifications.unreadCount,
  });
};

export const MarkNotificationAsUnread = async (id) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.notifications.markAsunread(id),
  });
};

export const MarkNotificationAsRead = async (id) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.notifications.markAsRead(id),
  });
};

export const ShowNotifictionById = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.notifications.listOne(id),
  });
};

export const CreateNotification = async (notifData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.notifications.create,
    data: notifData,
  });
};

export const UpdateNotification = async (id, notifData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.notifications.update(id),
    data: notifData,
  });
};

export const RemoveNotification = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.notifications.delete(id),
  });
};
