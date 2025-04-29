// components/MainContent.jsx
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
} from "@chakra-ui/react";

import { UserProformas } from "../pages/UserProfomas";
import { useEffect, useState } from "react";
import { UserInvoices } from "../pages/UserInvoice";
import { NewProForma } from "../pages/NewProforma";
import { NewInvoice } from "../pages/NewInvoice";
import { UserNotifications } from "../pages/UserNotifications";
import { NewNotification } from "../pages/NewNotification";
import { ShowUnreadNotificationsCount } from "../api/services/notificationService";

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
  { name: "newNotification", value: "پیام جدید" },
  { name: "notifications", value: "پیام ها" },
  { name: "userSettings", value: "تنظیمات کاربر" },
  { name: "userUnreadMessages", value: "پیام های خوانده نشده" },
  { name: "logout", value: "خروج" },
];

export const MainContents = ({ activeContent }) => {
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
          return <NewProForma />;
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
        default:
          break;
      }
    };

    findActiveContent(activeContent);
  }, [activeContent]);

  return (
    <Card w="90%" m={1}>
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
