import { useEffect, useState } from "react";
import { MyLoading } from "../../my-components/MyLoading";
import { UnitsDataTable } from "../../my-components/units/UnitsDataTable";
import { ShowAllUnits } from "../../api/services/unitsService";

const data = {
  Headers: ["کد", "نام واحد", "توضیحات", "عملیات"],
  Rows: [],
};
export const Units = () => {
  const [userData, setUserData] = useState(data);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const response = await ShowAllUnits();
      data.Rows = response.data;
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  if (userData)
    return (
      <>
        <UnitsDataTable
          HeadLables={userData.Headers}
          DataRows={userData.Rows}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
