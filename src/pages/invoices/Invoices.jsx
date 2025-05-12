import { useEffect, useState } from "react";
import { InvoiceDataTable } from "../../my-components/invoices/InvoiceDataTable";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowUserAllInvoices } from "../../api/services/invoiceService";

const data = {
  Headers: [
    "کد",
    "تاریخ",
    "نام مشتری",
    "نوع پرداخت",
    "فایل تاییدیه",
    "جمع مبلغ",
    "عملیات",
  ],
  Rows: [],
};
export const UserInvoices = () => {
  const [userData, setUserData] = useState(data);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      const response = await ShowUserAllInvoices();
      data.Rows = response.data;
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  if (userData?.Rows)
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
