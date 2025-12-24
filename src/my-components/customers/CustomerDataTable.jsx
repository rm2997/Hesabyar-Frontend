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
import { MyLoading } from "../MyLoading";

export const CustomerDataTable = ({ isDesktop }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);

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

  const handleDeleteCustomer = async (id) => {
    if (id === 0) return;
    setLoading(true);
    const res = await RemoveCustomer(id);
    if (!res.success) {
      toast({
        title: "خطایی رخ داد",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    await deleteCustomerFromList(id);
    toast({
      title: "توجه",
      description: `اطلاعات مشتری حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const updateCustomerInList = (id, updatedCustomer) => {
    setCustomersData((prev) =>
      prev.map((c) => (c.id == id ? { ...updatedCustomer } : c))
    );
  };

  const deleteCustomerFromList = async (id) => {
    const customers = customersData.filter((customer) => customer.id !== id);
    setCustomersData(customers);
  };

  const findCustomerFromList = (id) => {
    return customersData.find((c) => c.id == id);
  };

  const handleEditCustomer = (id) => {
    if (id === 0) return;
  };

  const loadData = async (resetPage = false) => {
    if (!currentPage || !itemsPerPage) return;
    setLoading(true);

    const res = await ShowAllCustomers(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      resetPage ? "" : search
    );

    if (!res.success) {
      toast({
        title: "خطا در دریافت داده‌ها",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    setCustomersData(res?.data?.items);
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setLoading(false);
  };

  const handleResetSearch = (reset = true) => {
    if (reset) {
      setSearch("");
      loadData(true);
    }
  };

  return (
    <Box>
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleResetSearch={handleResetSearch}
        loadData={loadData}
        userInfo="جستجوی مشتری"
      />
      <Flex
        filter={loading ? "blur(10px)" : ""}
        direction="column"
        minH={isDesktop ? "85vh" : "80vh"}
      >
        <Box flex="1" overflowY="auto" p={1}>
          <Flex direction="column" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {customersData.map((row) => (
                <Card
                  borderTopRadius={5}
                  borderWidth={1}
                  _hover={{ borderColor: "orange" }}
                >
                  <CardHeader
                    maxH={"60px"}
                    bg="green.500"
                    borderTopRadius={5}
                    color="white"
                    _hover={{ cursor: "pointer" }}
                    onClick={(e) => {
                      setSelectedID(row?.id);
                      onOpen();
                    }}
                  >
                    <Flex justify="space-between" columnGap={3}>
                      <UsersRound color="purple" />
                      <Flex flex={3} direction={"row"} gap={3}>
                        <Tooltip
                          label={
                            row?.customerGender +
                            " " +
                            row?.customerFName +
                            " " +
                            row?.customerLName
                          }
                        >
                          <Flex direction={"row"} gap={3}>
                            <Text>کد :</Text>
                            <Text>{row?.sepidarDlId}</Text>
                          </Flex>
                        </Tooltip>
                      </Flex>
                    </Flex>
                  </CardHeader>
                  <CardBody p={2}>
                    <VStack align={"stretch"} spacing={2}>
                      <HStack>
                        <Text fontFamily="iransans">نام :</Text>
                        <Tooltip
                          label={
                            row?.customerGender +
                            " " +
                            row?.customerFName +
                            " " +
                            row?.customerLName
                          }
                        >
                          <Text mr={"auto"} fontFamily="iransans">
                            {row?.customerGender?.length +
                              row?.customerFName?.length +
                              row?.customerLName.length >
                            30
                              ? (
                                  row?.customerGender +
                                  " " +
                                  row?.customerFName +
                                  " " +
                                  row?.customerLName
                                ).substring(0, 30) + "..."
                              : row?.customerGender +
                                " " +
                                row?.customerFName +
                                " " +
                                row?.customerLName}
                          </Text>
                        </Tooltip>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text fontFamily="iransans">نوع :</Text>
                        <Text fontFamily="iransans" mr="auto">
                          {row?.customerType}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text fontFamily="iransans"> شماره موبایل :</Text>
                        <Text fontFamily="iransans" mr="auto">
                          {row?.phoneNumbers[0]?.phoneNumber}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text fontFamily="iransans"> شماره ملی :</Text>
                        <Text fontFamily="iransans" mr="auto">
                          {row?.customerNationalCode}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                  <CardFooter p={2} borderBottomRadius={5} bg="gray.200">
                    <Stack
                      direction={["row"]}
                      spacing={2}
                      align={"stretch"}
                      mr="auto"
                    >
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
                    </Stack>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Flex>
      <MyAlert
        onClose={handleDialogClose}
        isOpen={isDialogOpen}
        AlertHeader={dialogGears.title}
        AlertMessage={dialogGears.text}
      />
      <MyModal
        size="full"
        modalHeader={"مشاهده و ویرایش مشتری"}
        onClose={onClose}
        isOpen={isOpen}
      >
        <EditCustomer
          id={selectedID}
          isDesktop={isDesktop}
          customer={findCustomerFromList(selectedID)}
          onClose={onClose}
          onUpdate={updateCustomerInList}
        />
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
