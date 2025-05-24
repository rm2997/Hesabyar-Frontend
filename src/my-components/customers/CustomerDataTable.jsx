import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FilePenLine, Send, Trash2, UsersRound } from "lucide-react";
import { MyModal } from "../MyModal";
import { useEffect, useState } from "react";
import { EditCustomer } from "./EditCustomer";

import { MyAlert } from "../MyAlert";
import { RemoveCustomer } from "../../api/services/customerService";

export const CustomerDataTable = ({ HeadLables, DataRows, isDesktop }) => {
  const [loading, setLoading] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const handleDeleteCustomer = (id) => {
    if (id === 0) return;
    setLoading(true);
    RemoveCustomer()
      .then((res) => {
        deleteCustomerFromList(id);
        toast({
          title: "توجه",
          description: `اطلاعات مشتری حذف شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(setLoading(false));
  };

  const updateCustomerInList = (updatedCustomer) => {
    setCustomersData((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const deleteCustomerFromList = (id) => {
    setCustomersData((prev) => prev.filter((customer) => customer.id !== id));
  };

  const findCustomerFromList = (id) => {
    customersData.map((customer) => (customer.id === id ? customer : null));
  };

  const handleEditCustomer = (id) => {
    if (id === 0) return;
    console.log("accepted");
  };

  useEffect(() => {
    setCustomersData([...DataRows]);
  }, [DataRows]);

  return (
    <Flex direction="column" gap={4}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 5 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
        spacing={4}
      >
        {DataRows.map((row) => (
          <Card
            borderTopRadius={5}
            borderWidth={1}
            _hover={{ borderColor: "orange" }}
          >
            <CardHeader bg="green.500" borderTopRadius={5} color="white">
              <HStack>
                <UsersRound color="purple" />
                <Text mr="auto">
                  {row.customerFName + " " + row.customerLName}
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align={"stretch"} spacing={2}>
                <HStack>
                  <Text> شماره موبایل :</Text>
                  <Text mr="auto">{row.customerMobile}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text> شماره تلفن :</Text>
                  <Text mr="auto">{row.customerPhone}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text> شماره ملی :</Text>
                  <Text mr="auto">{row.customerNationalCode}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text> کد پستی :</Text>
                  <Text mr="auto">{row.customerPostalCode}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>آدرس :</Text>
                  <Text mr="auto">
                    {row.customerAddress.length > 15
                      ? row.customerAddress.substring(0, 12) + "..."
                      : row.customerAddress}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
            <CardFooter borderBottomRadius={5} bg="gray.200">
              <Stack
                direction={["row"]}
                spacing={2}
                align={"stretch"}
                mr="auto"
              >
                <Link
                  _hover={{
                    color: "orange",
                  }}
                  color="blue.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "ویرایش مشتری",
                      text: "آیا واقعا می خواهید این مشتری ویرایش کنید؟",
                      callBack: handleEditCustomer,
                    });
                    onOpen();
                  }}
                >
                  <Tooltip label="ویرایش">
                    <Icon w={6} h={6} as={FilePenLine} />
                  </Tooltip>
                </Link>
                <Link
                  _disabled={true}
                  _hover={{ color: "#ffd54f" }}
                  color="green.600"
                >
                  <Tooltip label="ارسال تبلیغات به مشتری">
                    <Icon w={6} h={6} as={Send} />
                  </Tooltip>
                </Link>
                <Link
                  _hover={{ color: "#ffd54f" }}
                  color="red.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "حذف پیش فاکتور",
                      text: "آیا واقعا می خواهید این مشتری حذف کنید؟",
                      callBack: handleDeleteCustomer,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="حذف">
                    <Icon w={6} h={6} as={Trash2} />
                  </Tooltip>
                </Link>
              </Stack>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      <MyAlert
        onClose={handleDialogClose}
        isOpen={isDialogOpen}
        AlertHeader={dialogGears.title}
        AlertMessage={dialogGears.text}
      />
      <MyModal
        modalHeader={dialogGears.title}
        onClose={onClose}
        isOpen={isOpen}
      >
        <EditCustomer
          id={selectedID}
          isDesktop={isDesktop}
          onClose={onclose}
          onUpdate={dialogGears.callBack}
          customer={findCustomerFromList(selectedID)}
        />
      </MyModal>
    </Flex>
  );
};
