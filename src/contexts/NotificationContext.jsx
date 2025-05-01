// context/NotificationContext.jsx
import { createContext, useContext, useState } from "react";
import { ShowUnreadNotificationsCount } from "../api/services/notificationService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const loadUnreadeNotif = async () => {
    try {
      const response = await ShowUnreadNotificationsCount();
      setNotificationCount(response.data.length);
    } catch (err) {
      console.log(err);
      setNotificationCount(0);
    }
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
