import { useEffect, useState } from "react";
import { ProformaDataTable } from "../../my-components/proformas/ProformaDataTable";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowUserAllProformas } from "../../api/services/proformaService";

export const UserProformas = ({ isDesktop }) => {
  const [proformas, setProformas] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      setShowLoading(true);
      await ShowUserAllProformas()
        .then((res) => {
          setProformas(res.data);
        })
        .finally(setShowLoading(false));
    };

    loadData();
  }, []);

  if (proformas)
    return (
      <>
        <ProformaDataTable
          isDesktop={isDesktop}
          proformas={proformas}
          setProformas={setProformas}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
