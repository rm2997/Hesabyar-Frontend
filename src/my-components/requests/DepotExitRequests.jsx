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
import { CircleCheckBig, ShieldCheck } from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import {
  SetDepotIsAccepted,
  ShowDepotAcceptList,
} from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";

import { MyDepotExitRequestStepper } from "../MyDepotExitRequestStepper";
import { EditDepotExit } from "../depot/EditDepotExit";

export const DepotExitRequests = ({ isDesktop }) => {
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

    const res = await ShowDepotAcceptList(
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

  const handleResetSearch = (reset = true) => {
    if (reset) {
      setSearch("");
      loadData(true);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const updateDepotEntryInList = (updatedDepotEntry) => {
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

  const handleAcceptDepotExit = async (id) => {
    setLoading(true);
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

    deleteDepotEntryFromList(id);
    setLoading(false);
  };

  return (
    <Box alignContent="center">
      <Flex minH="77vh" filter={loading ? "blur(10px)" : ""} direction="column">
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
                  maxW="300px"
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
                    <Text fontFamily="IranSans" fontSize="md">
                      سند خروجی شماره : {row?.id}
                    </Text>
                  </CardHeader>
                  <CardBody p={2}>
                    <Flex justify="center" direction="row" columnGap={1}>
                      <MyDepotExitRequestStepper data={row} />
                      <VStack
                        fontFamily="IranSans"
                        fontSize="10px"
                        align="stretch"
                        spacing={2}
                        mx={2}
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
                  <CardFooter p={2} borderBottomRadius={5} bg="gray.200">
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
                            title: "تایید سند",
                            text: "شما در حال تایید سند خروج  می باشید، پس از تایید شما و انبار دار، موجودی اقلام از سرانه انبار، کسر خواهد شد. ادامه می دهید؟",
                            callBack: () => handleAcceptDepotExit(row?.id),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Tooltip label="تایید سند">
                          <Icon w={6} h={6} as={ShieldCheck} />
                        </Tooltip>
                      </Link>
                    </Stack>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
      </Flex>
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
      {loading && <MyLoading />}
    </Box>
  );
};
