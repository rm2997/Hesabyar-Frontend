// components/MainContent.jsx
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
} from "@chakra-ui/react";

import { NewProforma } from "../pages/proformas/NewProforma";
import { useEffect, useState } from "react";

import { NewInvoice } from "../pages/invoices/NewInvoice";
import { UserReceivedNotifications } from "../pages/notifications/UserReceivedNotifications";
import { UserSentdNotifications } from "../pages/notifications/UserSentNotifications";
import { NewNotification } from "../pages/notifications/NewNotification";
import { NewCustomer } from "../pages/customers/NewCustomer";
import { Customers } from "../pages/customers/Customers";
import { Goods } from "../pages/goods/Goods";
import { NewGood } from "../pages/goods/NewGood";
import { Units } from "../pages/units/Units";
import { NewUnit } from "../pages/units/NewUnit";
import { ProformaDataTable } from "./proformas/ProformaDataTable";
import { InvoiceDataTable } from "./invoices/InvoiceDataTable";

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
  { name: "newGood", value: "ثبت کالای جدید" },
  { name: "goods", value: "لیست کالاها" },
  { name: "newUnit", value: "ثبت واحد جدید" },
  { name: "units", value: "لیست واحدها" },
  { name: "newNotification", value: "ارسال پیام " },
  { name: "incomeNotifications", value: "پیام های دریافتی" },
  { name: "outgoNotifications", value: "پیام های ارسالی" },
  { name: "userSettings", value: "تنظیمات کاربر" },
  { name: "userUnreadMessages", value: "پیام های خوانده نشده" },
  { name: "logout", value: "خروج" },
];

export const MainContents = ({ activeContent, isDesktop }) => {
  const [pageTitle, setPageTitle] = useState("");
  const [shouldRender, setShouldRender] = useState(null);

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
          return <UserReceivedNotifications isDesktop={isDesktop} />;
        case "outgoNotifications":
          return <UserSentdNotifications isDesktop={isDesktop} />;
        case "newNotification":
          return <NewNotification isDesktop={isDesktop} />;
        case "newCustomer":
          return <NewCustomer isDesktop={isDesktop} />;
        case "customers":
          return <Customers isDesktop={isDesktop} />;
        case "newGood":
          return <NewGood isDesktop={isDesktop} />;
        case "goods":
          return <Goods isDesktop={isDesktop} />;
        case "newUnit":
          return <NewUnit isDesktop={isDesktop} />;
        case "units":
          return <Units isDesktop={isDesktop} />;
        default:
          break;
      }
    };

    findActiveContent(activeContent);
  }, [activeContent]);

  return (
    <Card w="98%" m={1} bg="#efefef">
      <CardHeader
        bg="#0A9DBB"
        borderBottomColor="gray.100"
        borderBottomWidth="1px"
        color="white"
      >
        <Text fontSize={"2xl"}>{pageTitle}</Text>
      </CardHeader>
      <CardBody overflow="scroll" color="gray.200">
        <Box>{shouldRender}</Box>
      </CardBody>
      <CardFooter bg="#dedcdd"></CardFooter>
    </Card>
  );
};
