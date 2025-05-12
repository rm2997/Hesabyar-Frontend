import { useEffect, useState } from "react";
import { MyLoading } from "../../my-components/MyLoading";
import { GoodsDataTable } from "../../my-components/goods/GoodsDataTable";
import { ShowAllGoods } from "../../api/services/goodsService";

const data = {
  Headers: ["کد", "نام کالا", "واحد", "قیمت", "توضیحات", "عملیات"],
  Rows: [],
};
export const Goods = () => {
  const [userData, setUserData] = useState(data);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const response = await ShowAllGoods();
      data.Rows = response.data;
      setUserData(data);
      setShowLoading(false);
    };

    loadData();
  }, []);

  if (userData)
    return (
      <>
        <GoodsDataTable
          HeadLables={userData.Headers}
          DataRows={userData.Rows}
        />
        <MyLoading showLoading={showLoading} />
      </>
    );
};
