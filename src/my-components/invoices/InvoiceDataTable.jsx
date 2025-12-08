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
  useDisclosure,
  Box,
  useToast,
  SimpleGrid,
  Tooltip,
  Icon,
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  FilePenLine,
  Send,
  Trash2,
  CircleFadingArrowUp,
  MailCheck,
  Handshake,
  UserRoundCheck,
  UserLock,
  ShieldUser,
  Link2,
  ArrowRight,
  Warehouse,
  Truck,
  Combine,
} from "lucide-react";

import { EditInvoice } from "./EditInvoice";
import {
  GenerateNewToken,
  RemoveInvoice,
  SendInvoiceDriverLink,
  SetInvoiceIsSent,
  ShowAllInvoices,
  ShowUserAllInvoices,
} from "../../api/services/invoiceService";
import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";
import { MyLoading } from "../MyLoading";
import { MyInvoiceStepper } from "../MyInvoiceStepper";
import { useNavigate } from "react-router-dom";

export const InvoiceDataTable = ({ isDesktop, listAll = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [deleteDialogResult, setDeleteDialogResult] = useState(null);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const navigate = useNavigate();

  const loadData = async (resetPage = false) => {
    setLoading(true);

    const res = listAll
      ? await ShowAllInvoices(
          resetPage ? 1 : currentPage,
          itemsPerPage,
          resetPage ? "" : search
        )
      : await ShowUserAllInvoices(
          resetPage ? 1 : currentPage,
          itemsPerPage,
          resetPage ? "" : search
        );
    if (!res?.success) {
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
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setInvoices(res?.data?.items);
    setLoading(false);
  };

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  useEffect(() => {
    loadData();
  }, [listAll]);

  dayjs.extend(jalali);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const updateFieldInvoiceInList = (id, key, value) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id == id ? { ...i, [key]: value } : i))
    );
  };

  const updateInvoiceInList = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((u) => (u.id == updatedInvoice.id ? updatedInvoice : u))
    );
  };

  const deleteInvoiceFromList = (id) => {
    setInvoices((prev) => prev.filter((u) => u.id != id));
  };

  const handleSendCustomerLink = async (id) => {
    const invoice = invoices.find((i) => i.id == id);

    if (!invoice) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "اطلاعات مشتری در دسترس نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const defaultMobile = invoice?.customer?.phoneNumbers?.find(
      (p) => p.isPrimary == true
    );
    if (!defaultMobile?.phoneNumber) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "شماره موبایل مشتری ثبت نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // if (!invoice?.customerLink) {
    //   toast({
    //     title: "امکان ارسال وجود ندارد",
    //     description: "لینک موقت مشتری ساخته نشده است",
    //     status: "error",
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   return;
    // }
    setLoading(true);
    const res = await SetInvoiceIsSent(invoice?.id);
    if (!res.success) {
      toast({
        title: "خطا بعد از ارسال",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    updateFieldInvoiceInList(id, "isSent", "true");
    toast({
      title: "توجه",
      description:
        "لینک درخواست آپلود مدارک واریز به شماره موبایل" +
        " " +
        defaultMobile?.phoneNumber +
        " به نام " +
        invoice.customer.customerFName +
        " " +
        invoice.customer.customerLName +
        " ارسال شد. ",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleSendDriverLink = async (id) => {
    const invoice = invoices.find((i) => i.id == id);

    if (!invoice) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "اطلاعات مشتری در دسترس نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const defaultMobile = invoice?.customer?.phoneNumbers?.find(
      (p) => p.isPrimary == true
    );
    if (!defaultMobile?.phoneNumber) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "شماره موبایل مشتری ثبت نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const res = await SendInvoiceDriverLink(invoice?.id);
    if (!res.success) {
      toast({
        title: "خطا بعد از ارسال",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    updateFieldInvoiceInList(id, "driverTokenIsSent", "true");
    toast({
      title: "توجه",
      description:
        "لینک درخواست مشخصات راننده به شماره موبایل" +
        " " +
        defaultMobile?.phoneNumber +
        " به نام " +
        invoice?.customer?.customerFName +
        " " +
        invoice?.customer?.customerLName +
        " ارسال شد. ",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleDeleteInvoice = async (id) => {
    setSelectedID(id);
    setLoading(true);
    const res = await RemoveInvoice(id);
    if (!res.success) {
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
    deleteInvoiceFromList(id);
    toast({
      title: "توجه",
      description: `اطلاعات فاکتور شما حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLoading(false);
    // setModalHeader("آیا از حذف پیش فاکتور زیر اطمینان دارید؟");
    // setModalContetnt(<DeleteInvoice id={id} onClose={AlertOnClose} />);
  };

  const handleGenerateNewLink = async (id) => {
    setSelectedID(id);
    setLoading(true);
    const res = await GenerateNewToken(id);
    if (!res.success) {
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
    toast({
      title: "توجه",
      description: ` لینک جدید ساخته شد می توانید آن را دوباره به مشتری ارسال کنید`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setInvoices((prev) =>
      prev.map((p) =>
        p.id == id
          ? {
              ...p,
              customerLink: res.data,
              isSent: false,
              approvedFile: "",
            }
          : p
      )
    );
    setLoading(false);
  };

  const handleEditInvoice = (id) => {
    if (id === 0) return;
    setSelectedID(id);
    // setModalHeader("ویرایش پیش فاکتور");
    // setModalContetnt(<EditInvoice id={id} onClose={onClose} />);
    onOpen();
  };

  if (invoices)
    return (
      <Box>
        <Flex
          filter={loading ? "blur(10px)" : ""}
          direction="column"
          minH={isDesktop ? "85vh" : "83vh"}
        >
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleResetSearch={handleResetSearch}
            loadData={loadData}
            userInfo="جستجوی فاکتور"
          />
          <Box flex="1" overflowY="auto" p={1}>
            <SimpleGrid mr={1} columns={{ base: 1, md: 2, lg: 4 }} spacing={3}>
              {invoices.map((row) => (
                <Card
                  maxW="350px"
                  _hover={{
                    cursor: "",
                    borderColor: "green.500",
                  }}
                  borderWidth={1}
                  borderColor="gray.300"
                >
                  <CardHeader
                    px={4}
                    py={2}
                    borderTopRadius="md"
                    bg={
                      !row?.finished
                        ? row?.isAccepted
                          ? "green.400"
                          : "blue.200"
                        : "gray.400"
                    }
                    _hover={{ cursor: "pointer" }}
                    onClick={(e) => handleEditInvoice(row.id)}
                  >
                    <Text
                      fontSize={["16px", "16px", "15px", "14px"]}
                      fontFamily="iransans"
                    >
                      فاکتور شماره : {row?.invoiceNumber}
                    </Text>
                  </CardHeader>
                  <CardBody p={2}>
                    <Flex justify="space-between" direction="row" columnGap={1}>
                      <MyInvoiceStepper data={row} />
                      <VStack mx={2} w="60%" spacing={2} align="stretch">
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            عنوان :
                          </Text>
                          <Text fontSize="12px" fontFamily="IranSans">
                            {row.title}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            تاریخ :
                          </Text>
                          <Text fontSize="12px" fontFamily="IranSans">
                            {dayjs(row.createdAt)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            مشتری :
                          </Text>
                          <Text fontSize="12px" fontFamily="IranSans">
                            {row.customer?.customerFName +
                              " " +
                              row.customer?.customerLName}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            نوع پرداخت :
                          </Text>
                          <Text fontFamily="IranSans" fontSize="12px">
                            {row.paymentStatus}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            تایید مشتری :
                          </Text>
                          <Text fontSize="12px" fontFamily="IranSans">
                            {row.approvedFile ? "دارد" : "ندارد"}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            جمع کل :
                          </Text>
                          <Text fontSize="md" fontFamily="IranSans">
                            {Number(row.totalAmount).toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </Flex>
                  </CardBody>
                  <CardFooter
                    p={row?.finished ? 0 : 2}
                    borderBottomRadius="md"
                    bg="gray.100"
                  >
                    <Flex hidden={row?.finished} mr="auto">
                      <Stack
                        direction={["row"]}
                        spacing={2}
                        align={"stretch"}
                        mr="auto"
                      >
                        <Link
                          hidden={
                            !row?.approvedFile ||
                            !row?.isAccepted ||
                            !(row?.driverTokenIsSent && row?.driver)
                          }
                          _hover={{ color: "#ffd54f" }}
                          color="orange.600"
                          onClick={(e) => {
                            setSelectedID(row?.id);
                            setDialogGears({
                              title: "ثبت سند خروج",
                              text: "خروج اقلام این فاکتور از انبار را ثبت می کنید؟",
                              callBack: () => {
                                navigate("/myhome/newDepotExit");
                              },
                            });

                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="ثبت سند خروج">
                            <Icon w={6} h={6} as={Combine} />
                          </Tooltip>
                        </Link>
                        <Link
                          hidden={
                            !row?.approvedFile ||
                            !row?.isAccepted ||
                            (row?.driverTokenIsSent && row?.driver)
                          }
                          _hover={{ color: "#ffd54f" }}
                          color="orange.600"
                          onClick={(e) => {
                            const defaultMobile =
                              row?.customer?.phoneNumbers?.find(
                                (p) => p.isPrimary == true
                              );
                            setSelectedID(row?.id);
                            setDialogGears({
                              title: "ارسال درخواست ثبت راننده به مشتری",
                              text: `آیا می خواهید درخواست به شماره ${defaultMobile?.phoneNumber} به نام ${row.customer.customerLName} ارسال گردد؟`,
                              callBack: () => handleSendDriverLink(row?.id),
                            });

                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="درخواست ثبت راننده">
                            <Icon w={6} h={6} as={Truck} />
                          </Tooltip>
                        </Link>

                        <Link
                          hidden={row?.isSent && row?.approvedFile}
                          _hover={{ color: "#ffd54f" }}
                          color="green.600"
                          onClick={(e) => {
                            setSelectedID(row.id);
                            const defaultMobile =
                              row?.customer?.phoneNumbers?.find(
                                (p) => p.isPrimary == true
                              );
                            setDialogGears({
                              title: "ارسال لینک به مشتری",
                              text: `آیا می خواهید لینک به شماره ${defaultMobile?.phoneNumber} به نام ${row.customer.customerLName} ارسال گردد؟`,
                              callBack: () => handleSendCustomerLink(row?.id),
                            });

                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="درخواست ثبت مدارک واریز وجه">
                            <Icon w={6} h={6} as={Send} />
                          </Tooltip>
                        </Link>

                        {/* <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={(e) => handleGenerateNewLink(row.id)}
                        >
                          <Tooltip label="تولید توکن جدید">
                            <Icon w={6} h={6} as={Link2} />
                          </Tooltip>
                        </Link> */}

                        <Link
                          hidden={row?.isAccepted}
                          _hover={{ color: "#ffd54f" }}
                          color="red.600"
                          onClick={(e) => {
                            setSelectedID(row?.id);
                            setDialogGears({
                              title: "حذف فاکتور",
                              text: "از حذف این فاکتور اطمینان دارید؟",
                              callBack: () => handleDeleteInvoice(row?.id),
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="حذف">
                            <Icon w={6} h={6} as={Trash2} />
                          </Tooltip>
                        </Link>

                        <Link
                          hidden={row?.isAccepted}
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={() => handleEditInvoice(row?.id)}
                        >
                          <Tooltip label="ویرایش">
                            <Icon w={6} h={6} as={FilePenLine} />
                          </Tooltip>
                        </Link>
                      </Stack>
                    </Flex>
                  </CardFooter>
                </Card>
              ))}

              <MyModal
                modalHeader="ویرایش فاکتور"
                onClose={onClose}
                isOpen={isOpen}
              >
                <EditInvoice
                  isDesktop={isDesktop}
                  onClose={onClose}
                  onOpen={onOpen}
                  onUpdate={updateInvoiceInList}
                  invoice={invoices.find(
                    (invoice) => invoice.id === selectedID
                  )}
                />
              </MyModal>
              <MyAlert
                onClose={handleDialogClose}
                isOpen={isDialogOpen}
                AlertHeader={dialogGears.title}
                AlertMessage={dialogGears.text}
              />
            </SimpleGrid>
          </Box>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Flex>
        {loading && <MyLoading />}
      </Box>
    );
};
