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
    await ShowUserAllInvoices(
      resetPage ? 1 : currentInvoicePage,
      itemsPerPage,
      resetPage ? "" : invoiceSearch
    )
      .then((res) => {
        if (!res?.data) return;
        setTotalInvoicePages(Math.ceil(res?.data?.total / itemsPerPage));
        const newInvoices = res.data.items.filter(
          (i) =>
            i.isAccepted == false && i.isSent == true && i.approvedFile !== null
        );
        setInvoices(newInvoices);
      })
      .catch((err) => {
        toast({
          title: "خطا در دریافت داده‌ها",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    setLoading(false);
  };

  const handleResetInvoiceSearch = () => {
    setInvoiceSearch("");
    loadInvoiceData(true);
  };

  const handleShowInvoicePicture = async (id) => {
    setLoading(true);
    await ShowInvoiceApprovedFile(id)
      .then((res) => {
        if (!res.data) return;
        const url = URL.createObjectURL(res.data);
        setApprovedFile(url);
        setShowModal(true);
      })
      .catch((err) => console.log(err.message));
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
    await RemoveInvoice(id)
      .then(() => {
        const newInvoices = invoices.filter((p) => p.id != id);
        setInvoices(newInvoices);
        toast({
          title: "توجه",
          description: `اطلاعات فاکتور شما حذف شد`,
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
      );
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
        ml="auto"
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
        <Box flex="1" overflowY="auto" p={5} zIndex={0}>
          <SimpleGrid
            mr={1}
            columns={{ base: 1, md: 2, lg: 3 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
            spacing={3}
          >
            {invoices.map((row) => (
              <Card
                maxW="350px"
                _hover={{
                  cursor: "",
                  borderColor: "green.500",
                }}
                borderWidth="1px"
                borderColor="gray.300"
              >
                <CardHeader
                  borderTopRadius={5}
                  bg={row?.isAccepted ? "green.200" : "orange.200"}
                >
                  <HStack>
                    <Text> پیش فاکتور شماره :{row.id}</Text>
                    <Box mr="auto">
                      {row.isSent ? (
                        <SquareArrowUp color="green" />
                      ) : (
                        <Tooltip label="منتظر ارسال">
                          <Icon
                            as={CircleFadingArrowUp}
                            _hover={{
                              color: "green",
                            }}
                          />
                        </Tooltip>
                      )}
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
            <MyAlert
              onClose={handleDialogClose}
              isOpen={isDialogOpen}
              AlertHeader={dialogGears.title}
              AlertMessage={dialogGears.text}
            />
            <MyModal
              modalHeader="نمایش فایل تاییدیه مشتری"
              onClose={() => setShowModal(false)}
              isOpen={showModal}
              size="xl"
            >
              <Box
                borderRadius="6px"
                hidden={approvedFile == null || approvedFile == ""}
                boxSize="xl"
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
        modalHeader="نمایش فایل تاییدیه مشتری"
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        size="xl"
      >
        <Box
          borderRadius="6px"
          hidden={approvedFile == null || approvedFile == ""}
          boxSize="xl"
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
      {loading && (
        <AbsoluteCenter>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="xl"
          />
        </AbsoluteCenter>
      )}
    </Box>
  );
};
