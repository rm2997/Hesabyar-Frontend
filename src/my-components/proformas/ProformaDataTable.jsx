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
} from "../../api/services/proformaService";
import { useEffect, useState } from "react";
import { CreateInvoice } from "../../api/services/invoiceService";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";

export const ProformaDataTable = ({ isDesktop }) => {
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
    await ShowUserAllProformas(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      resetPage ? "" : search
    )
      .then((res) => {
        if (!res?.data) return;
        setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
        setProformas(res?.data?.items);
      })
      .catch((err) => {
        toast({
          title: "خطا در دریافت داده‌ها",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(setLoading(false));
  };

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  dayjs.extend(jalali);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const handleSendCustomerLink = (id) => {
    const proforma = proformas.find((p) => p.id == id);
    console.log(proforma);
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
    SetProformaIsSent(proforma.id)
      .then((res) => updateProformainList(id, "isSent", "true"))
      .catch((err) => console.log(err.message));
    const customer =
      proforma?.customer?.customerGender +
      " " +
      proforma?.customer?.customerFName +
      " " +
      proforma?.customer?.customerLName;

    SendUpdateProformaSms(
      customer,
      proforma?.customer?.customerMobile,
      "www.hesab-yaar.ir/upload-proforma-document?token=" +
        proforma?.customerLink
    )
      .then((res) => {
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
            " ارسال شد. " +
            "www.hesab-yaar.ir/upload-proforma-document?token=" +
            proforma?.customerLink,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطا بعد از ارسال",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );
  };

  const updateProformainList = (id, key, value) => {
    setProformas((prev) =>
      prev.map((p) => (p.id == id ? { ...p, [key]: value } : p))
    );
  };

  const handleConvertToInvoice = (id) => {
    const proforma = proformas.find((p) => (p.id = id));
    // const newInvoice = {
    //   chequeAmount: 0,
    //   chequeDate: "",
    //   chequeSerial: 0,
    //   customer: {},
    //   description: "",
    //   id: 0,
    //   invoiceGoods: [],
    //   paperMoneyAmount: 0,
    //   paperMoneySerial: 0,
    //   paymentStatus: "",
    //   proforma: {},
    //   title: "",
    //   totalAmount: 0,
    //   trustIssueDate: "",
    // };

    if (!proforma) return;
    const newInvoice = {
      ...proforma,
      customer: { ...proforma.customer },
      invoiceGoods: proforma.proformaGoods,
      proforma: { ...proforma },
    };
    setLoading(true);
    CreateInvoice(newInvoice)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          ConvertProformaToInvoice(proforma.id).then((res) => {
            // const newProformas = proformas.filter((p) => p.id != proforma.id);
            // proforma.isConverted = true;
            // newProformas.push(proforma);
            // setProformas(newProformas);
            updateProformainList(proforma.id, "isConverted", "true");
          });
          toast({
            title: "توجه",
            description: ` پیش فاکتور شما به فاکتور تبدیل شد`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((err) =>
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(setLoading(false));
  };

  const handleGenerateNewLink = (id) => {
    setSelectedID(id);
    setLoading(true);
    GenerateNewToken(id)
      .then((res) => {
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

  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    setLoading(true);
    RemoveProforma(id)
      .then(() => {
        const newProformas = proformas.filter((p) => p.id != id);
        setProformas(newProformas);
        toast({
          title: "توجه",
          description: `اطلاعات پیش فاکتور شما حذف شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(setLoading(false));
    // setModalHeader("آیا از حذف پیش فاکتور زیر اطمینان دارید؟");
    // setModalContetnt(<DeleteProforma id={id} onClose={AlertOnClose} />);
  };

  const handleEditProforma = (id) => {
    if (id === 0) return;
    setSelectedID(id);
    // setModalHeader("ویرایش پیش فاکتور");
    // setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };

  if (proformas)
    return (
      <Flex direction="column" height="100vh">
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleResetSearch={handleResetSearch}
          loadData={loadData}
          userInfo="جستجوی پیش فاکتور"
        />
        <Box flex="1" overflowY="auto" p={5}>
          <SimpleGrid
            mr={1}
            columns={{ base: 1, md: 2, lg: 5 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
            spacing={3}
          >
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
                  bg={
                    !row.isConverted
                      ? row?.isAccepted
                        ? "green.400"
                        : "blue.200"
                      : "gray.400"
                  }
                >
                  <HStack>
                    <Text> شماره :{row.id}</Text>
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
                      <Text>{row.title}</Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text>تاریخ : </Text>
                      <Text>
                        {dayjs(row.createdAt).locale("fa").format("YYYY/MM/DD")}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text>نام مشتری : </Text>
                      <Text>
                        {row.customer?.customerFName +
                          " " +
                          row.customer?.customerLName}
                      </Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text>نوع پرداخت : </Text>
                      <Text>{row.paymentStatus}</Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text> تایید مشتری : </Text>
                      <Text>{row.approvedFile ? "دارد" : "ندارد"}</Text>
                    </HStack>
                    <Divider />
                    <HStack>
                      <Text> جمع کل : </Text>
                      <Text fontSize={"xl"}>
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
                          onClick={() => handleConvertToInvoice(row.id)}
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
