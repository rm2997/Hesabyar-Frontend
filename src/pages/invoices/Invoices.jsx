import { useEffect, useState } from "react";
import { InvoiceDataTable } from "../../my-components/invoices/InvoiceDataTable";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowUserAllInvoices } from "../../api/services/invoiceService";

export const UserInvoices = ({ isDesktop }) => {
  const [invoices, setInvoices] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      setShowLoading(true);
      await ShowUserAllInvoices()
        .then((res) => {
          setInvoices(res.data);
        })
        .finally(setShowLoading(false));
    };

    loadData();
  }, []);

  if (invoices)
    return (
      <>
        <InvoiceDataTable
          isDesktop={isDesktop}
          invoices={invoices}
          setInvoices={setInvoices}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
