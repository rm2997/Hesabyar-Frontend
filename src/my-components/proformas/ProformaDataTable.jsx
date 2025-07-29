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
  AbsoluteCenter,
  Spinner,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  FilePenLine,
  Send,
  Trash2,
  CircleFadingArrowUp,
  Replace,
  Link2,
  Handshake,
  UserRoundCheck,
  MailCheck,
  UserLock,
  ShieldUser,
} from "lucide-react";

import { EditProforma } from "./EditProforma";
import {
  ConvertProformaToInvoice,
  GenerateNewToken,
  RemoveProforma,
  SendUpdateProformaSms,
  SetProformaIsSent,
  ShowUserAllProformas,
  ShowUserMyProformas,
} from "../../api/services/proformaService";
import { useEffect, useState } from "react";
import { CreateInvoice } from "../../api/services/invoiceService";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";
import { MyLoading } from "../MyLoading";

export const ProformaDataTable = ({ isDesktop, listAll = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [proformas, setProformas] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedID, setSelectedID] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });

  const loadData = async (resetPage = false) => {
    setLoading(true);

    const res = listAll
      ? await ShowUserAllProformas(
          resetPage ? 1 : currentPage,
          itemsPerPage,
          resetPage ? "" : search
        )
      : await ShowUserMyProformas(
          resetPage ? 1 : currentPage,
          itemsPerPage,
          resetPage ? "" : search
        );
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

    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setProformas(res?.data?.items);

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

  const handleSendCustomerLink = async (id) => {
    const proforma = proformas.find((p) => p.id == id);

    if (!proforma) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "اطلاعات مشتری در دسترس نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!proforma?.customer?.customerMobile) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "شماره موبایل مشتری ثبت نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!proforma?.customerLink) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "لینک موقت مشتری ساخته نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const res = await SetProformaIsSent(proforma.id);
    if (!res.success) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    updateProformainList(id, "isSent", "true");
    toast({
      title: "توجه",
      description:
        "لینک تاییدیه به شماره موبایل" +
        " " +
        proforma.customer.customerMobile +
        " به نام " +
        proforma.customer.customerFName +
        " " +
        proforma.customer.customerLName +
        " ارسال شد. ",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
    // const customer =
    //   proforma?.customer?.customerGender +
    //   " " +
    //   proforma?.customer?.customerFName +
    //   " " +
    //   proforma?.customer?.customerLName;

    // SendUpdateProformaSms(
    //   customer,
    //   proforma?.customer?.customerMobile,
    //   "www.hesab-yaar.ir/upload-proforma-document?token=" +
    //     proforma?.customerLink
    // )
    //   .then((res) => {
    //     toast({
    //       title: "توجه",
    //       description:
    //         "لینک تاییدیه به شماره موبایل" +
    //         " " +
    //         proforma.customer.customerMobile +
    //         " به نام " +
    //         proforma.customer.customerFName +
    //         " " +
    //         proforma.customer.customerLName +
    //         " ارسال شد. " +
    //         "www.hesab-yaar.ir/upload-proforma-document?token=" +
    //         proforma?.customerLink,
    //       status: "success",
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   })
    //   .catch((err) =>
    //     toast({
    //       title: "خطا بعد از ارسال",
    //       description: err.message,
    //       status: "error",
    //       duration: 3000,
    //       isClosable: true,
    //     })
    //   );
  };

  const updateProformainList = (id, key, value) => {
    setProformas((prev) =>
      prev.map((p) => (p.id == id ? { ...p, [key]: value } : p))
    );
  };

  const handleConvertToInvoice = async (id) => {
    const proforma = proformas.find((p) => p.id == id);
    if (!proforma) return;

    const newInvoice = {
      ...proforma,
      id: 0,
      isSent: false,
      approvedFile: "",
      isAccepted: false,
      customerLink: "",
      acceptedBy: null,
      customer: { ...proforma.customer },
      invoiceGoods: [...proforma.proformaGoods],
      proforma: { ...proforma },
    };

    setLoading(true);
    const res = await CreateInvoice(newInvoice);
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
    await ConvertProformaToInvoice(proforma.id);
    updateProformainList(proforma.id, "isConverted", "true");
    toast({
      title: "توجه",
      description: ` پیش فاکتور شما به فاکتور تبدیل شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleGenerateNewLink = async (id) => {
    setSelectedID(id);
    setLoading(true);
    const res = await GenerateNewToken(id);
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

    toast({
      title: "توجه",
      description: ` لینک جدید ساخته شد می توانید آن را دوباره به مشتری ارسال کنید`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setProformas((prev) =>
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

  const handleDeleteProforma = async (id) => {
    setSelectedID(id);
    setLoading(true);
    const res = await RemoveProforma(id);
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
    const newProformas = proformas.filter((p) => p.id != id);
    setProformas(newProformas);
    toast({
      title: "توجه",
      description: `اطلاعات پیش فاکتور شما حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleEditProforma = (id) => {
    if (id === 0) return;
    setSelectedID(id);
    onOpen();
  };

  if (proformas)
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
            userInfo="جستجوی پیش فاکتور"
          />
          <Box flex="1" overflowY="auto" p={5}>
            <SimpleGrid mr={1} columns={{ base: 1, md: 2, lg: 5 }} spacing={3}>
              {proformas.map((row) => (
                <Card
                  maxW="370px"
                  _hover={{
                    cursor: "",
                    borderColor: "orange.300",
                  }}
                  borderWidth="1px"
                  borderColor="gray.300"
                >
                  <CardHeader
                    borderTopRadius={5}
                    _hover={{ cursor: "pointer" }}
                    onClick={(e) => handleEditProforma(row.id)}
                    bg={
                      !row.isConverted
                        ? row?.isAccepted
                          ? "green.400"
                          : "blue.200"
                        : "gray.400"
                    }
                  >
                    <HStack>
                      <Text fontFamily="IranSans" fontSize="md">
                        {" "}
                        شماره :{row.id}
                      </Text>
                      <Box mr="auto">
                        <HStack>
                          {row.isConverted ? (
                            <Tooltip label="فاکتور شده">
                              <Replace color="purple" />
                            </Tooltip>
                          ) : (
                            <></>
                          )}
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
                          {dayjs(row.createdAt)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
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
                      {!row.isConverted && (
                        <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={(e) => handleEditProforma(row.id)}
                        >
                          <Tooltip label="ویرایش">
                            <Icon w={6} h={6} as={FilePenLine} />
                          </Tooltip>
                        </Link>
                      )}

                      {!row.isConverted && (
                        <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={(e) => handleGenerateNewLink(row.id)}
                        >
                          <Tooltip label="تولید لینک جدید">
                            <Icon w={6} h={6} as={Link2} />
                          </Tooltip>
                        </Link>
                      )}

                      {!row.isConverted && row?.isSent == false && (
                        <Link
                          _hover={{ color: "#ffd54f" }}
                          color="green.600"
                          onClick={(e) => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "ارسال لینک به مشتری",
                              text: `آیا می خواهید لینک به شماره ${
                                row.customer.customerMobile
                              } به نام ${
                                row.customer.customerGender +
                                " " +
                                row.customer.customerFName +
                                " " +
                                row.customer.customerLName
                              } ارسال گردد؟`,
                              callBack: () => handleSendCustomerLink(row.id),
                            });

                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="ارسال لینک به مشتری">
                            <Icon w={6} h={6} as={Send} />
                          </Tooltip>
                        </Link>
                      )}

                      {!row.isConverted &&
                        row?.isSent &&
                        row?.approvedFile &&
                        row?.isAccepted && (
                          <Link
                            _hover={{ color: "#ffd54f" }}
                            color="purple.600"
                            onClick={() => handleConvertToInvoice(row?.id)}
                          >
                            <Tooltip label="تبدیل به فاکتور">
                              <Icon w={6} h={6} as={Replace} />
                            </Tooltip>
                          </Link>
                        )}

                      {!row.isConverted && (
                        <Link
                          _hover={{ color: "#ffd54f" }}
                          color="red.600"
                          onClick={(e) => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "حذف پیش فاکتور",
                              text: "آیا واقعا می خواهید این پیش فاکتور را حذف کنید؟",
                              callBack: handleDeleteProforma,
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="حذف">
                            <Icon w={6} h={6} as={Trash2} />
                          </Tooltip>
                        </Link>
                      )}
                    </Stack>
                  </CardFooter>
                </Card>
              ))}
              <MyModal
                modalHeader="ویرایش پیش فاکتور"
                onClose={onClose}
                isOpen={isOpen}
              >
                <EditProforma
                  isDesktop={isDesktop}
                  onClose={onClose}
                  onOpen={onOpen}
                  setProformas={setProformas}
                  proformas={proformas}
                  proforma={proformas.find(
                    (proforma) => proforma.id === selectedID
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
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Flex>
          </Box>
        </Flex>
        {loading && <MyLoading />}
      </Box>
    );
};
