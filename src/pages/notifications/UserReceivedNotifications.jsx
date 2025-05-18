import { useEffect, useState } from "react";
import { NotificationReceivedDataTable } from "../../my-components/notifications/NotificationReceivedDataTable";
import { ShowUserRcvAllNotifications } from "../../api/services/notificationService";

export const UserReceivedNotifications = () => {
  const [userData, setUserData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await ShowUserRcvAllNotifications().then((res) => {
        setUserData(res.data);
        setShowLoading(false);
      });
    };

    loadData();
  }, []);

  return <NotificationReceivedDataTable DataRows={userData} />;
};
