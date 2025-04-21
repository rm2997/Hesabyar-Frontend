import { useEffect, useState } from "react";
import { ProformaDataTable } from "../my-components/ProformaDataTable";
import {
  AbsoluteCenter,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

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
export const UserProformas = () => {
  const [userData, setUserData] = useState(null);

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
    };
    loadData();
  }, []);

  if (userData)
    return (
      <ProformaDataTable
        HeadLables={userData.Headers}
        DataRows={userData.Rows}
      />
    );
  else
    return (
      <AbsoluteCenter>
        <CircularProgress isIndeterminate color="green.300" size="220px">
          <CircularProgressLabel fontSize="md">
            لطفا شکیبا باشید
          </CircularProgressLabel>
        </CircularProgress>
      </AbsoluteCenter>
    );
};
