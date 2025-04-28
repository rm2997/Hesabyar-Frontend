import { useEffect, useState } from "react";
import { NotificationDataTable } from "../my-components/NotificationDataTable";
import { ShowUserAllNotifications } from "../api/services/notificationService";

const data = {
  Headers: ["ردیف", "عنوان", "متن", "خوانده شده", "عملیات"],
  Rows: [],
};
export const UserNotifications = () => {
  const [userData, setUserData] = useState(data);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const response = await ShowUserAllNotifications();
      data.Rows = response.data;
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  return (
    <NotificationDataTable
      DataRows={userData.Rows}
      HeadLables={userData.Headers}
    />
  );
};
