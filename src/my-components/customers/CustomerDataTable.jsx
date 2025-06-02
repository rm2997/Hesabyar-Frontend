import {
  AbsoluteCenter,
  Box,
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
  Spinner,
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
import {
  RemoveCustomer,
  ShowAllCustomers,
} from "../../api/services/customerService";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";

export const CustomerDataTable = ({ isDesktop }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
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

  useEffect(() => {
    loadData();
  }, [currentPage]);

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

  const updateCustomerInList = (id, updatedCustomer) => {
    setCustomersData((prev) =>
      prev.map((c) => (c.id == id ? { ...updatedCustomer } : c))
    );
  };

  const deleteCustomerFromList = (id) => {
    const customers = customersData.filter((customer) => customer.id !== id);
    setCustomersData(customers);
  };

  const findCustomerFromList = (id) => {
    customersData.find((c) => (c.id == id ? c : null));
  };

  const handleEditCustomer = (id) => {
    if (id === 0) return;
  };

  const loadData = async (resetPage = false) => {
    if (!currentPage || !itemsPerPage) return;
    setLoading(true);
    try {
      await ShowAllCustomers(
        resetPage ? 1 : currentPage,
        itemsPerPage,
        resetPage ? "" : search
      )
        .then((res) => {
          if (!res.data) return;

          setCustomersData(res?.data?.items);
          setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
        })
        .catch((error) => {
          toast({
            title: "خطا در دریافت داده‌ها",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        })
        .finally(setLoading(false));
    } catch (err) {
      toast({
        title: "خطا در دریافت داده‌ها",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };

  if (loading)
    return (
      <AbsoluteCenter>
        <Spinner size="xl" color="red.500" />
      </AbsoluteCenter>
    );

  return (
    <Flex direction="column" height="100vh">
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleResetSearch={handleResetSearch}
        loadData={loadData}
        userInfo="جستجوی مشتری"
      />

      <Box flex="1" overflowY="auto" p={5}>
        <Flex direction="column" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
            {customersData.map((row) => (
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
                          callBack: () => handleEditCustomer(row.id),
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
                          callBack: () => handleDeleteCustomer(row.id),
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
              onClose={onClose}
              onUpdate={updateCustomerInList}
            />
          </MyModal>
        </Flex>
      </Box>
      <Box
        position="sticky"
        bottom="68px"
        bg="#efefef"
        p={1}
        zIndex="1"
        borderTopColor="gray.400"
        borderTopWidth="1px"
      >
        <Flex justify="center" align="center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
