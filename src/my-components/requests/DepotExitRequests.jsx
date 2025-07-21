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
  Combine,
  DecimalsArrowLeft,
  FilePenLine,
  ShieldCheck,
  ShieldUser,
  Trash2,
  UserLock,
  WalletCards,
} from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import {
  RemoveDepot,
  SetDepotExitIsAccepted,
  ShowAllDepots,
} from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { EditDepotExit } from "../depot/EditDepotExit";

export const DepotExitRequests = ({ isDesktop }) => {
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
    const tmpDepotExitsReq = res?.data?.items?.filter(
      (exitReq) => exitReq.isAccepted === null
    );
    console.log("reza:", tmpDepotExitsReq);
    console.log("total:", tmpDepotExitsReq.length);

    setDepotEntry(tmpDepotExitsReq);
    setTotalPages(Math.ceil(tmpDepotExitsReq.length / itemsPerPage));
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
    if (updatedDepotEntry.isAccepted)
      deleteDepotEntryFromList(updatedDepotEntry.id);
    else
      setDepotEntry((prev) =>
        prev.map((g) => (g.id === updatedDepotEntry.id ? updatedDepotEntry : g))
      );
  };

  const deleteDepotEntryFromList = (id) => {
    setDepotEntry((prev) => prev.filter((g) => g.id !== id));
  };

  const findDepotEntryFromList = (id) => {
    return depotEntry.find((g) => (g.id === id ? g : null));
  };

  const handleAcceptDepotExit = async (id) => {
    setLoading(true);
    const res = await SetDepotExitIsAccepted(id);
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
      description: "تایید شد",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    updateDepotEntryInList(res?.data);
    setLoading(false);
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
                    bg={depotEntry?.isAccepted ? "green.400" : "blue.200"}
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
                      <Text fontFamily="IranSans" fontSize="md">
                        شماره : {row.id}
                      </Text>
                      <Box mr="auto">
                        <HStack>
                          {depotEntry?.isAccepted ? (
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
                        </HStack>
                      </Box>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align={"stretch"} spacing={2}>
                      <HStack>
                        <Text> تاریخ ثبت :</Text>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {dayjs(row.createdAt)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text>شماره فاکتور:</Text>
                        <Text fontFamily="iransans" fontSize="md" mr="auto">
                          {row.depotInvoice?.id}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text>تعداد کالا</Text>
                        <Text fontFamily="iransans" fontSize="md" mr="auto">
                          {row?.totalQuantity}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text>جمع کل</Text>
                        <Text fontFamily="iransans" fontSize="md" mr="auto">
                          {Number(row?.totalAmount).toLocaleString()}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text> ثبت کننده :</Text>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {row?.createdBy?.userfname +
                            " " +
                            row?.createdBy?.userlname}
                        </Text>
                      </HStack>
                      <Divider />
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
                        _hover={{ color: "#ffd54f" }}
                        color="orange.300"
                        onClick={(e) => {
                          //setInvoiceSelectedID(row.id);
                          setDialogGears({
                            title: "تایید",
                            text: "آیا واقعا رکورد را تایید میکنید؟",
                            callBack: () => handleAcceptDepotExit(row.id),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Tooltip label="تایید">
                          <Icon w={6} h={6} as={ShieldCheck} />
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
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </Flex>
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
