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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Edit,
  FilePenLine,
  Replace,
  Send,
  Trash2,
  User2,
  UsersRound,
} from "lucide-react";
import { MyModalContainer } from "../MyModalContainer";
import { useEffect, useState } from "react";
import { EditCustomer } from "./EditCustomer";
import { DeleteCustomer } from "./DeleteCustomer";

export const CustomerDataTable = ({ HeadLables, DataRows }) => {
  const [customersData, setCustomersData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteCustomer = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف مشتری زیر اطمینان دارید؟");
    setModalContetnt(
      <DeleteCustomer
        id={id}
        onDelete={deleteCustomerFromList}
        onClose={onClose}
      />
    );
    onOpen();
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

    setSelectedID(id);
    setModalHeader("ویرایش مشخصات مشتری");
    setModalContetnt(
      <EditCustomer
        id={id}
        onClose={onClose}
        onUpdate={updateCustomerInList}
        customer={findCustomerFromList(id)}
      />
    );
    onOpen();
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
                <Link _hover={{ color: "#ffd54f" }} color="red.600">
                  <Tooltip label="حذف">
                    <Icon w={6} h={6} as={Trash2} />
                  </Tooltip>
                </Link>
              </Stack>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
