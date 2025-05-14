import { useEffect, useState } from "react";
import { ProformaDataTable } from "../../my-components/proformas/ProformaDataTable";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowUserAllProformas } from "../../api/services/proformaService";

const data = {
  Headers: [
    "کد",
    "تاریخ",
    "نام مشتری",
    "نوع پرداخت",
    "فایل تاییدیه مشتری",
    "جمع مبلغ",
    "تایید شده",
    "عملیات",
  ],
  Rows: [],
};
export const UserProformas = () => {
  const [userData, setUserData] = useState(data);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      const response = await ShowUserAllProformas();
      data.Rows = response.data;
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  if (userData)
    return (
      <>
        <ProformaDataTable
          HeadLables={userData.Headers}
          DataRows={userData.Rows}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
