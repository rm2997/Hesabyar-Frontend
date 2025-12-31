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
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FilePenLine, RefreshCcw, RefreshCcwDot, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import {
  CheckSepidarDepot,
  GenerateNewToken,
  RemoveDepot,
  SetDepotIsSent,
  ShowAllDepots,
} from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { EditDepotExit } from "./EditDepotExit";
import { MyDepotExitStepper } from "../MyDepotExitStepper";

export const DepotExitList = ({ isDesktop }) => {
  const [depotEntry, setDepotEntry] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 12;
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

    const res = await ShowAllDepots(
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

  const handleCheckSepidarDepot = async (id) => {
    setLoading(true);
    const res = await CheckSepidarDepot(id);
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
    toast({
      title: "بروز رسانی  ",
      description: res.data,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
                    py={4}
                    bg={
                      row?.isAccepted
                        ? row?.depotNumber
                          ? "gray.500"
                          : "green.400"
                        : "blue.200"
                    }
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
                        سند خروجی شماره :{" "}
                        {row?.depotNumber
                          ? row?.depotNumber
                          : " داخلی " + row?.id}
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
                  <CardBody p={2}>
                    <Flex justify="space-between" direction="row" columnGap={1}>
                      <MyDepotExitStepper data={row} />
                      <VStack
                        w="60%"
                        spacing={2}
                        align="stretch"
                        fontFamily="IranSans"
                        fontSize="10px"
                        mx={2}
                      >
                        <HStack>
                          <Text fontFamily="IranSans"> تاریخ ثبت :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {dayjs(row.createdAt)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontFamily="IranSans">شماره فاکتور:</Text>
                          <Text fontFamily="iransans" fontSize="12px" mr="auto">
                            {row.depotInvoice?.invoiceNumber}
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
                          <Text fontSize="12px" mr="auto">
                            {row?.createdBy?.userfname +
                              " " +
                              row?.createdBy?.userlname}
                          </Text>
                        </HStack>

                        <Divider hidden={!row?.acceptedBy} />
                        <HStack hidden={!row?.acceptedBy}>
                          <Text fontFamily="IranSans"> تایید کننده :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row?.acceptedBy?.userfname +
                              " " +
                              row?.acceptedBy?.userlname}
                          </Text>
                        </HStack>

                        <Divider hidden={!row?.warehouseAcceptedBy} />
                        <HStack hidden={!row?.warehouseAcceptedBy}>
                          <Text fontFamily="IranSans"> مسئول انبار :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row?.warehouseAcceptedBy?.userfname +
                              " " +
                              row?.warehouseAcceptedBy?.userlname}
                          </Text>
                        </HStack>
                        <Divider hidden={!row?.depotNumber} />
                        {row?.depotNumber && (
                          <HStack>
                            <Text fontFamily="IranSans"> بررسی وضعیت :</Text>
                            <IconButton
                              onClick={() => handleCheckSepidarDepot(row.id)}
                              maxH={"28px"}
                              mr="auto"
                              variant={"ghost"}
                              colorScheme="blackAlpha"
                              icon={<RefreshCcw />}
                            />
                          </HStack>
                        )}
                      </VStack>
                    </Flex>
                  </CardBody>
                  <CardFooter
                    p={row?.isAccepted ? 0 : 2}
                    borderBottomRadius={5}
                    bg="gray.200"
                  >
                    <Flex hidden={row?.isAccepted} mr="auto">
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
                            setSelectedID(row?.id);
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
                    </Flex>
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

        <MyModal modalHeader="جزییات" isOpen={isOpen} onClose={onClose}>
          <EditDepotExit
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
