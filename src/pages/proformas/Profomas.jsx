import { useEffect, useState } from "react";
import { ProformaDataTable } from "../../my-components/proformas/ProformaDataTable";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowUserAllProformas } from "../../api/services/proformaService";

export const UserProformas = ({ isDesktop }) => {
  const [userData, setUserData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      setShowLoading(true);
      await ShowUserAllProformas()
        .then((res) => {
          setUserData(res.data);
        })
        .finally(setShowLoading(false));
    };

    loadData();
  }, []);

  if (userData)
    return (
      <>
        <ProformaDataTable isDesktop={isDesktop} DataRows={userData} />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
