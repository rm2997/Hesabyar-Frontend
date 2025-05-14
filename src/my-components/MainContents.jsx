// components/MainContent.jsx
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
} from "@chakra-ui/react";

import { UserProformas } from "../pages/proformas/Profomas";
import { NewProForma, NewProforma } from "../pages/proformas/NewProforma";
import { useEffect, useState } from "react";
import { UserInvoices } from "../pages/invoices/Invoices";
import { NewInvoice } from "../pages/invoices/NewInvoice";
import { UserNotifications } from "../pages/notifications/UserNotifications";
import { NewNotification } from "../pages/notifications/NewNotification";
import { NewCustomer } from "../pages/customers/NewCustomer";
import { Customers } from "../pages/customers/Customers";
import { Goods } from "../pages/goods/Goods";
import { NewGood } from "../pages/goods/NewGood";
import { Units } from "../pages/units/Units";
import { NewUnit } from "../pages/units/NewUnit";

const validContents = [
  { name: "newProforma", value: "پیش فاکتور جدید" },
  { name: "proformaStat", value: "لیست پیش فاکتور ها" },
  { name: "newInvoice", value: "فاکتور جدید" },
  { name: "invoiceStat", value: "لیست فاکتور ها" },
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
  { name: "newNotification", value: "پیام جدید" },
  { name: "notifications", value: "پیام ها" },
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
        case "proformaStat":
          return <UserProformas />;
        case "newInvoice":
          return <NewInvoice />;
        case "invoiceStat":
          return <UserInvoices />;
        case "newSale":
          return;
        case "saleStat":
          return <>Hi4</>;
        case "user":
          return <>User</>;
        case "notifications":
          return <UserNotifications />;
        case "newNotification":
          return <NewNotification />;
        case "newCustomer":
          return <NewCustomer />;
        case "customers":
          return <Customers />;
        case "newGood":
          return <NewGood />;
        case "goods":
          return <Goods />;
        case "newUnit":
          return <NewUnit />;
        case "units":
          return <Units />;
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
