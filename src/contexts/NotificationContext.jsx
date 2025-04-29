// context/NotificationContext.jsx
import { createContext, useContext, useState } from "react";
import { ShowUnreadNotificationsCount } from "../api/services/notificationService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const loadUnreadeNotif = async () => {
    console.log("Notification context loaded.");
    const response = await ShowUnreadNotificationsCount();
    if (!response) setNotificationCount(0);
    else setNotificationCount(response.data.length);
  };

  return (
    <NotificationContext.Provider
      value={{ notificationCount, setNotificationCount, loadUnreadeNotif }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
