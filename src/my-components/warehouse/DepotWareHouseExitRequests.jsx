import {
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
  Stack,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowBigRight,
  ArrowBigRightDash,
  ArrowRight,
  CircleFadingArrowUp,
  Combine,
  DecimalsArrowLeft,
  FilePenLine,
  Handshake,
  Link2,
  MailCheck,
  Send,
  ShieldUser,
  Trash2,
  UserLock,
  UserRoundCheck,
  WalletCards,
  Warehouse,
} from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import {
  GenerateNewToken,
  RemoveDepot,
  SetDepotIsSent,
  ShowAllDepots,
  ShowDepotWareHouseList,
} from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { MyWareHouseDepotExitStepper } from "../MyWareHouseDepotExitStepper";
import {
  AcceptDepotExitByWareHouseMan,
  EditDepotExitByWareHouseMan,
} from "./AcceptDepotExitByWareHouseMan";

export const DepotWareHouseExitRequests = ({ isDesktop }) => {
  const [depotEntry, setDepotEntry] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [selectedID, setSelectedID] = useState(0);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  dayjs.extend(jalali);

  const loadData = async (resetPage = false) => {
    setLoading(true);

    const res = await ShowDepotWareHouseList(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      DepotTypes.find((t) => t.key == "out").value,
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
    setDepotEntry(res?.data.items);
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setLoading(false);
  };

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const updateDepotEntryInList = (updatedDepotEntry) => {
    console.log("updatedDepotEntry:", updatedDepotEntry);
    setDepotEntry((prev) =>
      prev.map((g) => (g.id === updatedDepotEntry.id ? updatedDepotEntry : g))
    );
  };

  const updateFieldDepotEntryInList = (id, key, value) => {
    setDepotEntry((prev) =>
      prev.map((i) => (i.id == id ? { ...i, [key]: value } : i))
    );
  };

  const deleteDepotEntryFromList = (id) => {
    setDepotEntry((prev) => prev.filter((g) => g.id !== id));
  };

  const findDepotEntryFromList = (id) => {
    return depotEntry.find((g) => (g.id === id ? g : null));
  };

  const handleDeleteDepotEntry = async (id) => {
    if (id === 0) return;
    setLoading(true);
    const res = await RemoveDepot(id);
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

    deleteDepotEntryFromList(id);
    toast({
      title: "توجه",
      description: `اطلاعات حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleSendCustomerLink = async (id) => {
    const depot = depotEntry.find((i) => i.id == id);

    if (!depot) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "اطلاعات مشتری در دسترس نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!depot?.depotInvoice?.customer?.customerMobile) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "شماره موبایل مشتری ثبت نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!depot?.customerToken) {
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
    const res = await SetDepotIsSent(depot?.id);
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
    updateFieldDepotEntryInList(id, "isSent", "true");
    toast({
      title: "توجه",
      description:
        "لینک تاییدیه به شماره موبایل" +
        " " +
        depot?.depotInvoice?.customer?.customerMobile +
        " به نام " +
        depot?.depotInvoice?.customer?.customerFName +
        " " +
        depot?.depotInvoice?.customer?.customerLName +
        " ارسال شد. ",
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
    setDepotEntry((prev) =>
      prev.map((p) =>
        p.id == id
          ? {
              ...p,
              customerToken: res?.data,
              isSent: false,
            }
          : p
      )
    );
    setLoading(false);
  };

  return (
    <Box>
      <Flex
        height="100vh"
        filter={loading ? "blur(10px)" : ""}
        direction="column"
      >
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleResetSearch={handleResetSearch}
          loadData={loadData}
          userInfo="جستجوی خروجی انبار"
        />

        <Box flex="1" overflowY="auto" p={1}>
          <Flex direction="column" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
              {depotEntry.map((row) => (
                <Card
                  borderTopRadius={5}
                  borderWidth="1px"
                  borderColor="gray.300"
                  _hover={{ cursor: "", borderColor: "green.500" }}
                >
                  <CardHeader
                    bg={row?.isAccepted ? "green.400" : "blue.200"}
                    borderTopRadius={5}
                    _hover={{ cursor: "pointer", borderColor: "green.500" }}
                    onClick={(e) => {
                      setSelectedID(row.id);
                      setDialogGears({
                        title: "ویرایش",
                        text: "",
                        callBack: null,
                      });
                      onOpen();
                    }}
                  >
                    <HStack>
                      {/* <Flex
                        borderWidth={1}
                        p={1}
                        borderRadius="md"
                        borderColor="whiteAlpha.300"
                      >
                        <ArrowBigRight
                          color="#e49b5bff"
                          height={18}
                          width={18}
                        />
                        <Warehouse color="#e49b5bff" height={18} width={18} />
                      </Flex> */}
                      <Text fontFamily="IranSans" fontSize="md">
                        سند خروجی شماره : {row?.id}
                      </Text>
                      {/* <Box mr="auto">
                        <HStack>
                          {row?.isAccepted ? (
                            <Tooltip label="تاییدیه کاربر ارشد">
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
                          {row?.driverNatCode ||
                          row?.driverCarNumber ||
                          row?.driver ||
                          row?.driverMobile ? (
                            <Tooltip label="تایید مشتری">
                              <UserRoundCheck color="green" />
                            </Tooltip>
                          ) : (
                            <Tooltip label="منتظر تایید مشتری">
                              <Handshake color="white" />
                            </Tooltip>
                          )}

                          {row?.isSent ? (
                            <Tooltip label="لینک به مشتری ارسال شده است">
                              <MailCheck color="green" />
                            </Tooltip>
                          ) : (
                            <Tooltip label="منتظر ارسال">
                              <CircleFadingArrowUp color="orange" />
                            </Tooltip>
                          )}
                        </HStack>
                      </Box> */}
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Flex justify="space-between" direction="row" columnGap={1}>
                      <MyWareHouseDepotExitStepper data={row} />
                      <VStack
                        fontFamily="IranSans"
                        fontSize="10px"
                        align={"stretch"}
                        spacing={2}
                      >
                        <HStack>
                          <Text fontFamily="IranSans"> تاریخ ثبت :</Text>
                          <Text fontFamily="IranSans" fontSize="15px" mr="auto">
                            {dayjs(row.createdAt)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontFamily="IranSans">شماره فاکتور:</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row.depotInvoice?.id}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontFamily="IranSans">تعداد کالا</Text>
                          <Text fontFamily="iransans" fontSize="12px" mr="auto">
                            {row?.totalQuantity}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontFamily="IranSans">جمع کل</Text>
                          <Text fontFamily="iransans" fontSize="15px" mr="auto">
                            {Number(row?.totalAmount).toLocaleString()}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontFamily="IranSans"> ثبت کننده :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row?.createdBy?.userfname +
                              " " +
                              row?.createdBy?.userlname}
                          </Text>
                        </HStack>

                        {/*<Divider />
                         <HStack>
                          <Text fontFamily="IranSans"> تایید کننده :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row?.acceptedBy?.userfname +
                              " " +
                              row?.acceptedBy?.userlname}
                          </Text>
                        </HStack> */}
                      </VStack>
                    </Flex>
                  </CardBody>
                  {/* <CardFooter borderBottomRadius={5} bg="gray.200">
                    {!row?.isAccepted && (
                      <Stack
                        direction={["row"]}
                        spacing={2}
                        align={"stretch"}
                        mr="auto"
                      >
                        {!row?.isSent && (
                          <Link
                            _disabled={true}
                            _hover={{ color: "#ffd54f" }}
                            color="green.600"
                            onClick={(e) => {
                              setSelectedID(row.id);
                              setDialogGears({
                                title: "ارسال لینک به مشتری",
                                text: `آیا می خواهید لینک به شماره ${row?.depotInvoice?.customer?.customerMobile} به نام ${row?.depotInvoice?.customer?.customerLName} ارسال گردد؟`,
                                callBack: handleSendCustomerLink,
                              });

                              setIsDialogOpen(true);
                            }}
                          >
                            <Tooltip label="ارسال درخواست ثبت مشخصات راننده به مشتری">
                              <Icon w={6} h={6} as={Send} />
                            </Tooltip>
                          </Link>
                        )}

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
                        <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={(e) => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "ویرایش",
                              text: "",
                              callBack: null,
                            });
                            onOpen();
                          }}
                        >
                          <Tooltip label="ویرایش">
                            <Icon w={6} h={6} as={FilePenLine} />
                          </Tooltip>
                        </Link>

                        <Link
                          _hover={{ color: "#ffd54f" }}
                          color="red.600"
                          onClick={(e) => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "حذف",
                              text: "آیا واقعا می خواهید این رکورد را حذف کنید؟",
                              callBack: () => {
                                handleDeleteDepotEntry(row.id);
                              },
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Tooltip label="حذف">
                            <Icon w={6} h={6} as={Trash2} />
                          </Tooltip>
                        </Link>
                      </Stack>
                    )}
                  </CardFooter> */}
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

        <MyModal
          modalHeader="تاییدیه مسئول انبار"
          isOpen={isOpen}
          onClose={onClose}
        >
          <AcceptDepotExitByWareHouseMan
            isDesktop={isDesktop}
            id={selectedID}
            closeMe={onClose}
            onUpdate={updateDepotEntryInList}
            depot={findDepotEntryFromList(selectedID)}
          />
        </MyModal>
        <MyAlert
          AlertHeader={dialogGears.title}
          AlertMessage={dialogGears.text}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      </Flex>
      {loading && <MyLoading />}
    </Box>
  );
};
