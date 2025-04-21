// components/MainContent.jsx
import { Box, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

import { UserProformas } from "../pages/UserProfomas";
import { useEffect, useState } from "react";

const validContents = [
  { name: "newProforma", value: "بیش فاکتور جدید" },
  { name: "proformaStat", value: "بیش فاکتور ها" },
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
      console.log("hi");
    };

    const SetActiveElement = (index) => {
      switch (index) {
        case "newProforma":
          break;
        case "proformaStat":
          return <UserProformas />;
        case "newInvoice":
          return <>Hi1</>;
        case "invoiceStat":
          return <>Hi2</>;
        case "newSale":
          return <>Hi3</>;
        case "saleStat":
          return <>Hi4</>;
        default:
          break;
      }
    };

    findActiveContent(activeContent);
  }, [activeContent]);

  return (
    <Box overflow="scroll" width="full">
      <Heading bg="gray.600" color="gray.200" mt={5}>
        {pageTitle}
      </Heading>

      <Card
        borderColor="gray.600"
        variant="outline"
        bg="gray.700"
        width="full"
        color="gray.400"
      >
        <CardHeader></CardHeader>
        <CardBody color="gray.100">{shouldRender}</CardBody>
      </Card>
    </Box>
  );
};
