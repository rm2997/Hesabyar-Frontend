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
import { FilePenLine, ShieldCheck, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import {
  RemoveDepot,
  SetDepotIsAccepted,
  ShowDepotAcceptList,
} from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { EditDepotEntry } from "../depot/EditDepotEntry";
import { MyDepotExitRequestStepper } from "../MyDepotExitRequestStepper";

export const DepotEntryRequest = ({ isDesktop }) => {
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

    const res = await ShowDepotAcceptList(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      DepotTypes.find((t) => t.key == "in").value,
      resetPage ? "" : search
    );
    if (!res?.success) {
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

    const tmpEntryReq = res?.data?.items;
    setDepotEntry(tmpEntryReq);
    setTotalPages(Math.ceil(tmpEntryReq.length / itemsPerPage));
    setLoading(false);
  };

  const handleAcceptDepotEntry = async (id) => {
    setLoading(true);
    const depot = depotEntry?.find((d) => d.id == id);
    const checkDepot = depot?.depotGoods?.every((element) => {
      let retval = true;
      if (element.price == 0) {
        toast({
          title: "هشدار",
          description: "برای کالاهای این سند مبلغ  درج نشده است",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        retval = false;
      }
      if (element.quantity == 0) {
        toast({
          title: "هشدار",
          description: "برای کالاهای این سند  تعداد درج نشده است",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        retval = false;
      }
      return retval;
    });

    if (!checkDepot) {
      setLoading(false);
      return;
    }

    const res = await SetDepotIsAccepted(id);
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
    depot.isAccepted = true;
    updateDepotEntryInList(depot);
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
      <Flex minH="60vh" filter={loading ? "blur(10px)" : ""} direction="column">
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleResetSearch={handleResetSearch}
          loadData={loadData}
          userInfo="جستجوی ورودی انبار"
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
                    p={2}
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
                      <Text fontFamily="IranSans" fontSize="md">
                        سند ورودی شماره : {row?.id}
                      </Text>
                    </HStack>
                  </CardHeader>
                  <CardBody p={2}>
                    <Flex justify="space-between" direction="row" columnGap={1}>
                      <MyDepotExitRequestStepper data={row} />
                      <VStack
                        mx={2}
                        fontFamily="IranSans"
                        fontSize="10px"
                        align={"stretch"}
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
                          <Text fontFamily="IranSans">تعداد کالا</Text>
                          <Text fontFamily="iransans" fontSize="12px" mr="auto">
                            {row?.totalQuantity}
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
                        <Divider hidden={!row?.warehouseAcceptedBy} />
                        <HStack hidden={!row?.warehouseAcceptedBy}>
                          <Text fontFamily="IranSans"> مسئول انبار :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row?.warehouseAcceptedBy?.userfname +
                              " " +
                              row?.warehouseAcceptedBy?.userlname}
                          </Text>
                        </HStack>
                      </VStack>
                    </Flex>
                  </CardBody>
                  <CardFooter p={2} borderBottomRadius={5} bg="gray.200">
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
                            text: "شما در حال تایید سند ورودی می باشید، پس از تایید، موجودی اقلام به سرانه انبار اضافه خواهد شد. ادامه می دهید؟",
                            callBack: () => handleAcceptDepotEntry(row.id),
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
                            text: "از حذف این سند ورودی انبار اطمینان دارید؟",
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        <MyModal modalHeader="جزییات" isOpen={isOpen} onClose={onClose}>
          <EditDepotEntry
            isDesktop={isDesktop}
            id={selectedID}
            closeMe={onClose}
            onUpdate={updateDepotEntryInList}
            depot={findDepotEntryFromList(selectedID)}
            isForAccept={true}
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
