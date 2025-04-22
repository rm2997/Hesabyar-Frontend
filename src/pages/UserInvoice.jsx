import { useEffect, useState } from "react";
import { ProformaDataTable } from "../my-components/ProformaDataTable";
import { MyLoading } from "../my-components/MyLoading";
import { InvoiceDataTable } from "../my-components/InvoiceDataTable";

const data = {
  Headers: ["ردیف", "تاریخ", "مشتری", "نوع فروش", "جمع اقلام"],
  Rows: [
    {
      id: "1",
      Date: "1404/01/30",
      Customer: "Mohamadi",
      SaleTaype: "Cash",
      GoodsCount: "5",
    },
    {
      id: "2",
      Date: "1404/01/31",
      Customer: "Hasani",
      SaleTaype: "Cash",
      GoodsCount: "1",
    },
  ],
};
export const UserInvoices = () => {
  const [userData, setUserData] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = () => {
      for (let index = 3; index < 100; index++) {
        data.Rows.push({
          id: index,
          Customer: "Reza" + index,
          Date: "1404/01/01",
          GoodsCount: index,
          SaleTaype: "Cash",
        });
      }
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  if (userData)
    return (
      <>
        <InvoiceDataTable
          HeadLables={userData.Headers}
          DataRows={userData.Rows}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
