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

const validContents = [
  { name: "newProforma", value: "پیش فاکتور جدید" },
  { name: "proformaStat", value: "پیش فاکتور ها" },
  { name: "newInvoice", value: "فاکتور جدید" },
  { name: "invoiceStat", value: "فاکتور ها" },
  { name: "newSale", value: "فروش جدید" },
  { name: "saleStat", value: "آمار فروش" },
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
        default:
          break;
      }
    };

    findActiveContent(activeContent);
  }, [activeContent]);

  return (
    <Card w="90%" m={1}>
      <CardHeader
        bg="blue.400"
        borderBottomColor="gray.100"
        borderBottomWidth="1px"
        color="white"
      >
        <Text fontSize={"2xl"}>{pageTitle}</Text>
      </CardHeader>
      <CardBody bg="#e8e4e5" overflow="scroll" color="gray.200">
        <Box>{shouldRender}</Box>
      </CardBody>
      <CardFooter bg="#dedcdd"></CardFooter>
    </Card>
  );
};
