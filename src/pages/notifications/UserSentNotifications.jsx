import { useEffect, useState } from "react";
import { ShowUserSndNotifications } from "../../api/services/notificationService";
import { NotificationSentDataTable } from "../../my-components/notifications/NotificationSentDataTable";

export const UserSentdNotifications = () => {
  const [userData, setUserData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setShowLoading(true);
      await ShowUserSndNotifications().then((res) => {
        setUserData(res.data);
        setShowLoading(false);
      });
      setShowLoading(false);
    };

    loadData();
  }, []);

  return <NotificationSentDataTable DataRows={userData} />;
};
