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
import { MyProformaStepper } from "../MyProformaSteper";

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
    if (!res?.success) {
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
    // if (!proforma?.customerLink) {
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
    updateProformaInListWithKey(id, "isSent", "true");
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
  };

  const updateProformaInListWithKey = (id, key, value) => {
    setProformas((prev) =>
      prev.map((p) => (p.id == id ? { ...p, [key]: value } : p))
    );
  };

  const updateProformaInList = (updatedPerforma) => {
    setProformas((prev) =>
      prev.map((p) => (p.id == updatedPerforma.id ? updatedPerforma : p))
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
      stockRef: Number(proforma.stockRef),
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
    updateProformaInListWithKey(proforma.id, "isConverted", "true");
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
    if (!res?.success) {
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
              customerLink: res?.data,
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
          <Box flex="1" overflowY="auto" p={1}>
            <SimpleGrid mr={1} columns={{ base: 1, md: 2, lg: 4 }} spacing={3}>
              {proformas.map((row) => (
                <Card
                  maxW="350px"
                  _hover={{
                    cursor: "",
                    borderColor: "orange.300",
                  }}
                  borderWidth="1px"
                  borderColor="gray.300"
                >
                  <CardHeader
                    px={4}
                    py={2}
                    borderTopRadius="md"
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
                    <Text fontFamily="IranSans" fontSize="md">
                      پیش فاکتور شماره : {row.proformaNumber}
                    </Text>
                  </CardHeader>
                  <CardBody p={2}>
                    <Flex justify="space-between" direction="row" columnGap={1}>
                      <MyProformaStepper data={row} />
                      <VStack mx={2} w="60%" spacing={2} align="stretch">
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            عنوان :
                          </Text>
                          <Text fontFamily="IranSans" fontSize="12px">
                            {row.title}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            تاریخ :
                          </Text>
                          <Text fontFamily="IranSans" fontSize="12px">
                            {dayjs(row.createdAt)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            نام مشتری :
                          </Text>
                          <Text fontFamily="IranSans" fontSize="12px">
                            {row.customer?.customerFName +
                              " " +
                              row.customer?.customerLName}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack fontSize="10px" fontFamily="IranSans">
                          <Text>نوع پرداخت : </Text>
                          <Text fontFamily="IranSans" fontSize="12px">
                            {row.paymentStatus}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            تایید مشتری :
                          </Text>
                          <Text fontFamily="IranSans" fontSize="12px">
                            {row.approvedFile ? "دارد" : "ندارد"}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontSize="10px" fontFamily="IranSans">
                            جمع کل :
                          </Text>
                          <Text fontFamily="IranSans" fontSize="md">
                            {Number(row.totalAmount).toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </Flex>
                  </CardBody>
                  <CardFooter
                    p={row?.isConverted ? 0 : 2}
                    borderBottomRadius="md"
                    bg="gray.100"
                  >
                    <Flex hidden={row?.isConverted} mr="auto">
                      <Stack
                        direction={["row"]}
                        spacing={2}
                        align={"stretch"}
                        mr="auto"
                      >
                        <Link
                          hidden={
                            !row?.isSent ||
                            !row?.isAccepted ||
                            !row?.approvedFile
                          }
                          _hover={{ color: "#ffd54f" }}
                          color="purple.600"
                          onClick={() => handleConvertToInvoice(row?.id)}
                        >
                          <Tooltip label="تبدیل به فاکتور">
                            <Icon w={6} h={6} as={Replace} />
                          </Tooltip>
                        </Link>

                        {/* <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={(e) => handleGenerateNewLink(row.id)}
                        >
                          <Tooltip label="تولید لینک جدید">
                            <Icon w={6} h={6} as={Link2} />
                          </Tooltip>
                        </Link> */}

                        <Link
                          hidden={row?.isSent && row?.approvedFile}
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
                          <Tooltip
                            label={
                              !row?.isSent
                                ? "ارسال درخواست به مشتری"
                                : "ارسال مجدد"
                            }
                          >
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
                              text: "از حذف این پیش فاکتور اطمینان دارید؟",
                              callBack: () => handleDeleteProforma(row?.id),
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
                          onClick={() => handleEditProforma(row?.id)}
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
                modalHeader="ویرایش پیش فاکتور"
                onClose={onClose}
                isOpen={isOpen}
              >
                <EditProforma
                  closeMe={onClose}
                  onOpen={onOpen}
                  setProformas={setProformas}
                  proformas={proformas}
                  onUpdate={updateProformaInList}
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
