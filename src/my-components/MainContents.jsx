// components/MainContent.jsx
import { Box, Flex, Text } from "@chakra-ui/react";

import { NewProforma } from "../pages/proformas/NewProforma";
import { useContext, useEffect, useState } from "react";

import { NewInvoice } from "../pages/invoices/NewInvoice";
import { NewNotification } from "../pages/notifications/NewNotification";
import { NewCustomer } from "../pages/customers/NewCustomer";
import { NewGood } from "../pages/goods/NewGood";
import { NewUnit } from "../pages/units/NewUnit";
import { ProformaDataTable } from "./proformas/ProformaDataTable";
import { InvoiceDataTable } from "./invoices/InvoiceDataTable";
import { Users } from "../pages/users/Users";
import { UploadGoods } from "./goods/UploadGoods";
import { GoodsDataTable } from "./goods/GoodsDataTable";
import { CustomerDataTable } from "./customers/CustomerDataTable";
import { UnitsDataTable } from "./units/UnitsDataTable";
import { NotificationSentDataTable } from "./notifications/NotificationSentDataTable";
import { NotificationReceivedDataTable } from "./notifications/NotificationReceivedDataTable";
import { UploadCustomers } from "./customers/UploadCustomers";
import { RequestsDataTable } from "./requests/RequestsDataTable";
import { Logout } from "./Logout";
import { ChangePassword } from "./users/ChangePassword";
import { ChangePasswordByUser } from "./users/ChangePasswordByUser";
import { UserContext } from "../contexts/UserContext";

const validContents = [
  { name: "newProforma", value: "پیش فاکتور جدید" },
  { name: "myProformas", value: " پیش فاکتور های من" },
  { name: "proformaStat", value: "پیش فاکتور ها" },
  { name: "newInvoice", value: "فاکتور جدید" },
  { name: "myInvoices", value: "فاکتور های من" },
  { name: "invoiceStat", value: "فاکتور ها" },
  { name: "newSale", value: "فروش جدید" },
  { name: "saleStat", value: "لیست فروش" },
  { name: "newSendDepot", value: "ثبت ورود" },
  { name: "depotStat", value: "لیست انبار" },
  { name: "user", value: "کاربران" },
  { name: "newCustomer", value: "ثبت مشتری جدید" },
  { name: "customers", value: "لیست مشتریان" },
  { name: "uploadCustomers", value: "آپلود دسته ای مشتریان" },
  { name: "newGood", value: "ثبت کالای جدید" },
  { name: "goods", value: "لیست کالاها" },
  { name: "uploadGoods", value: "آپلود دسته ای کالاها" },
  { name: "newUnit", value: "ثبت واحد جدید" },
  { name: "units", value: "لیست واحدها" },
  { name: "newNotification", value: "ارسال پیام " },
  { name: "incomeNotifications", value: "پیام های دریافتی" },
  { name: "outgoNotifications", value: "پیام های ارسالی" },
  { name: "userSettings", value: "تنظیمات کاربر" },
  { name: "userUnreadMessages", value: "پیام های خوانده نشده" },
  { name: "َchangeUsers", value: "کاربران" },
  { name: "acceptRequest", value: "درخواست های تایید" },
  { name: "logout", value: "خروج" },
  { name: "َchangePassword", value: "تغییر رمز عبور" },
];

export const MainContents = ({ activeContent, isDesktop }) => {
  const [pageTitle, setPageTitle] = useState("");
  const [shouldRender, setShouldRender] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const findActiveContent = (item) => {
      if (!item || item === "") return;
      const valid = validContents.find((i) => i.name === item);
      if (!valid || valid.name === "") return;
      setPageTitle(valid.value);
      const element = SetActiveElement(valid.name);
      setShouldRender(element);
    };

    const SetActiveElement = (index) => {
      switch (index) {
        case "newProforma":
          return <NewProforma isDesktop={isDesktop} />;
        case "myProformas":
          return <ProformaDataTable isDesktop={isDesktop} />;
        case "proformaStat":
          return <></>;
        case "newInvoice":
          return <NewInvoice isDesktop={isDesktop} />;
        case "invoiceStat":
          return <></>;
        case "myInvoices":
          return <InvoiceDataTable isDesktop={isDesktop} />;
        case "newSale":
          return;
        case "saleStat":
          return <>Hi4</>;
        case "user":
          return <>User</>;
        case "incomeNotifications":
        case "userUnreadMessages":
          return <NotificationReceivedDataTable isDesktop={isDesktop} />;
        case "outgoNotifications":
          return <NotificationSentDataTable isDesktop={isDesktop} />;
        case "newNotification":
          return <NewNotification isDesktop={isDesktop} />;
        case "newCustomer":
          return <NewCustomer isDesktop={isDesktop} />;
        case "customers":
          return <CustomerDataTable isDesktop={isDesktop} />;
        case "uploadCustomers":
          return <UploadCustomers isDesktop={isDesktop} />;
        case "newGood":
          return <NewGood isDesktop={isDesktop} />;
        case "goods":
          return <GoodsDataTable isDesktop={isDesktop} />;
        case "uploadGoods":
          return <UploadGoods isDesktop={isDesktop} />;
        case "newUnit":
          return <NewUnit isDesktop={isDesktop} />;
        case "units":
          return <UnitsDataTable isDesktop={isDesktop} />;
        case "َchangeUsers":
          return <Users isDesktop={isDesktop} user={user} />;
        case "َchangePassword":
          return <ChangePasswordByUser isDesktop={isDesktop} />;
        case "acceptRequest":
          return <RequestsDataTable isDesktop={isDesktop} />;
        case "logout":
          return <Logout />;
        default:
          break;
      }
    };

    findActiveContent(activeContent);
  }, [activeContent]);

  return (
    <Flex w="98%" m={1} bg="#efefef" direction="column" height="100vh">
      {/* <Card w="98%" m={1} bg="#efefef"> */}
      {/* <CardHeader
        bg="#0A9DBB"
        borderBottomColor="gray.100"
        borderBottomWidth="1px"
        color="white"
      > */}
      <Box
        borderBottomRadius={5}
        bg="#0A9DBB"
        borderBottomColor="gray.100"
        borderBottomWidth="1px"
        color="white"
        p={2}
      >
        <Text fontSize={"2xl"}>{pageTitle}</Text>
      </Box>
      {/* </CardHeader> */}
      {/* <CardBody overflow="scroll" color="gray.200"> */}
      <Box flex="1" overflowY="auto" p={2}>
        <Box>{shouldRender}</Box>
      </Box>

      {/* <CardFooter bg="#dedcdd"></CardFooter> */}
    </Flex>
  );
};
