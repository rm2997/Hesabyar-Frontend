import { useEffect, useState } from "react";
import { MyLoading } from "../my-components/MyLoading";
import { ShowAllCustomers } from "../api/services/customerService";
import { CustomerDataTable } from "../my-components/CustomerDataTable";

const data = {
  Headers: [
    "ردیف",
    "نام مشتری",
    "نام خانوادگی",
    "شماره ملی",
    "تلفن",
    "آدرس",
    "عملیات",
  ],
  Rows: [],
};
export const Customers = () => {
  const [userData, setUserData] = useState(data);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      const response = await ShowAllCustomers();
      data.Rows = response.data;
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  if (userData)
    return (
      <>
        <CustomerDataTable
          HeadLables={userData.Headers}
          DataRows={userData.Rows}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
