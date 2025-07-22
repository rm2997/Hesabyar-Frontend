import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
  Box,
  useToast,
  SimpleGrid,
  Tooltip,
  Icon,
  Flex,
  Center,
  Grid,
  GridItem,
  AbsoluteCenter,
  Spinner,
  Image,
  Heading,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  Trash2,
  CircleFadingArrowUp,
  Replace,
  Handshake,
  UserRoundCheck,
  MailCheck,
  UserLock,
  ShieldUser,
  SquareArrowUp,
  ScanEye,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import { MyAlert } from "../MyAlert";
import { MyModal } from "../MyModal";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";
import {
  RemoveInvoice,
  SetInvoiceIsAccepted,
  ShowInvoiceApprovedFile,
  ShowUserAllInvoices,
} from "../../api/services/invoiceService";
import { MyLoading } from "../MyLoading";
export const InvoiceRequests = ({ isDesktop }) => {
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [totalInvoicePages, setTotalInvoicePages] = useState(0);
  const itemsPerPage = 10;
  const [approvedFile, setApprovedFile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceSelectedID, setInvoiceSelectedID] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });

  const loadInvoiceData = async (resetPage = false) => {
    setLoading(true);
    const res = await ShowUserAllInvoices(
      resetPage ? 1 : currentInvoicePage,
      itemsPerPage,
      resetPage ? "" : invoiceSearch
    );
    if (!res.success) {
      toast({
        title: "خطا در دریافت داده‌ها",
        description: res?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setTotalInvoicePages(Math.ceil(res?.data?.total / itemsPerPage));
    const newInvoices = res.data.items.filter(
      (i) => i.isAccepted == false && i.isSent == true && i.approvedFile
    );
    setInvoices(newInvoices);
    setLoading(false);
  };

  const handleResetInvoiceSearch = () => {
    setInvoiceSearch("");
    loadInvoiceData(true);
  };

  const handleShowInvoicePicture = async (id) => {
    setLoading(true);
    const res = await ShowInvoiceApprovedFile(id);
    if (!res?.success) {
      if (res?.status !== 404)
        toast({
          title: "خطایی رخ داد",
          description: res?.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      setLoading(false);
      return;
    }
    const url = URL.createObjectURL(res.data);
    setApprovedFile(url);
    setShowModal(true);

    setLoading(false);
  };

  useEffect(() => {
    loadInvoiceData();
  }, [currentInvoicePage]);

  dayjs.extend(jalali);

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(invoiceSelectedID);
  };

  const handleDeleteInvoice = async (id) => {
    setInvoiceSelectedID(id);
    setLoading(true);
    const res = await RemoveInvoice(id);
    if (!res?.success) {
      toast({
        title: "خطایی رخ داد",
        description: res?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    const newInvoices = invoices.filter((p) => p.id != id);
    setInvoices(newInvoices);
    toast({
      title: "توجه",
      description: `اطلاعات فاکتور شما حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLoading(false);
  };

  const updateInvoiceList = (id) => {
    const newInvoices = invoices.filter((i) => i.id != id);
    setInvoices(newInvoices);
  };

  const handleAcceptInvoice = async (id) => {
    setLoading(true);
    await SetInvoiceIsAccepted(id)
      .then((res) => {
        updateInvoiceList(id);
        toast({
          title: "توجه",
          description: `فاکتور شما تایید شد`,
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
      });
    setLoading(false);
  };

  return (
    <Box>
      <Flex
        direction="column"
        height="100vh"
        filter={loading ? "blur(10px)" : ""}
      >
        <SearchBar
          zIndex="2"
          yTop="0px"
          search={invoiceSearch}
          setSearch={setInvoiceSearch}
          handleResetSearch={handleResetInvoiceSearch}
          loadData={loadInvoiceData}
          userInfo="جستجوی فاکتور"
        />
        <Box flex="1" overflowY="auto" p={1}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }}>
            {invoices.map((row) => (
              <Card
                _hover={{
                  cursor: "",
                  borderColor: "green.500",
                }}
                borderWidth="1px"
                borderColor="gray.300"
              >
                <CardHeader
                  borderTopRadius={5}
                  bg={
                    !row.isConverted
                      ? row?.isAccepted
                        ? "green.400"
                        : "blue.200"
                      : "gray.400"
                  }
                  _hover={{ cursor: "pointer" }}
                  onClick={(e) => {
                    setInvoiceSelectedID(row.id);
                    handleShowInvoicePicture(row.id);
                  }}
                >
                  <HStack>
                    <Text fontFamily="IranSans" fontSize="md">
                      شماره :{row.id}
                    </Text>
                    <Box mr="auto">
                      <HStack>
                        {row.isAccepted ? (
                          <Tooltip label="تایید کاربر ارشد">
                            <ShieldUser color="green" />
                          </Tooltip>
                        ) : (
                          <Tooltip label="منتظر تایید کاربر ارشد ">
                            <UserLock
                              color="yellow"
                              _hover={{ color: "green" }}
                            />
                          </Tooltip>
                        )}

                        {row.approvedFile ? (
                          <Tooltip label="تایید مشتری">
                            <UserRoundCheck color="green" />
                          </Tooltip>
                        ) : (
                          <Tooltip label="منتظر تایید مشتری">
                            <Handshake color="white" />
                          </Tooltip>
                        )}

                        {row.isSent ? (
                          <Tooltip label="لینک به مشتری ارسال شده است">
                            <MailCheck color="green" />
                          </Tooltip>
                        ) : (
                          <Tooltip label="منتظر ارسال">
                            <CircleFadingArrowUp color="orange" />
                          </Tooltip>
                        )}
                      </HStack>
                    </Box>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={2} align="stretch">
                    <HStack>
                      <Text>عنوان : </Text>
                      <Text fontFamily="IranSans" fontSize="md">
                        {row.title}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text>تاریخ : </Text>
                      <Text fontFamily="IranSans" fontSize="md">
                        {dayjs(row.createdAt).locale("fa").format("YYYY/MM/DD")}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text>نام مشتری : </Text>
                      <Text fontFamily="IranSans" fontSize="md">
                        {row.customer?.customerFName +
                          " " +
                          row.customer?.customerLName}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text>نوع پرداخت : </Text>
                      <Text fontFamily="IranSans" fontSize="md">
                        {row.paymentStatus}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text> تایید مشتری : </Text>
                      <Text fontFamily="IranSans" fontSize="md">
                        {row.approvedFile ? "دارد" : "ندارد"}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text> جمع کل : </Text>
                      <Text fontFamily="IranSans" fontSize={"xl"}>
                        {Number(row.totalAmount).toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
                <CardFooter borderBottomRadius={5} bg="gray.100">
                  <Stack
                    direction={["row"]}
                    spacing={2}
                    align={"stretch"}
                    mr="auto"
                  >
                    {row.approvedFile && (
                      <Link
                        _hover={{ color: "#ffd54f" }}
                        color="orange.300"
                        onClick={(e) => {
                          setInvoiceSelectedID(row.id);
                          setDialogGears({
                            title: "تایید  فاکتور",
                            text: "آیا واقعا این فاکتور را تایید میکنید؟",
                            callBack: () => handleAcceptInvoice(row.id),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Tooltip label="تایید">
                          <Icon w={6} h={6} as={ShieldCheck} />
                        </Tooltip>
                      </Link>
                    )}
                    {row.approvedFile && (
                      <Link
                        _hover={{ color: "#ffd54f" }}
                        color="green.600"
                        onClick={(e) => {
                          setInvoiceSelectedID(row.id);
                          handleShowInvoicePicture(row.id);
                        }}
                      >
                        <Tooltip label="مشاهده مدارک مشتری">
                          <Icon w={6} h={6} as={ScanEye} />
                        </Tooltip>
                      </Link>
                    )}
                    <Link
                      _hover={{ color: "#ffd54f" }}
                      color="red.600"
                      onClick={(e) => {
                        setInvoiceSelectedID(row.id);
                        setDialogGears({
                          title: "حذف فاکتور",
                          text: "آیا واقعا می خواهید این فاکتور را حذف کنید؟",
                          callBack: handleDeleteInvoice,
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
        </Box>
        <Box
          position="sticky"
          bottom="0"
          bg="#efefef"
          p={1}
          zIndex="1"
          borderTopColor="gray.400"
          borderTopWidth="1px"
        >
          <Flex justify="center" align="center">
            <Pagination
              currentPage={currentInvoicePage}
              totalPages={totalInvoicePages}
              onPageChange={(page) => setCurrentInvoicePage(page)}
            />
          </Flex>
        </Box>
      </Flex>
      <MyAlert
        onClose={handleDialogClose}
        isOpen={isDialogOpen}
        AlertHeader={dialogGears.title}
        AlertMessage={dialogGears.text}
      />
      <MyModal
        modalHeader=" فایل تاییدیه مشتری"
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        size={isDesktop ? "xl" : "xs"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={approvedFile == null || approvedFile == ""}
          boxSize={isDesktop ? "lg" : "2xs"}
        >
          <Image
            src={approvedFile ? approvedFile : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تاییدیه"
          />
        </Box>
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
