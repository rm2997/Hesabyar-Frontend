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
import { CircleCheckBig } from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import {
  SetDepotIsAcceptedByWarehouseMan,
  ShowDepotWareHouseList,
} from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { MyWareHouseDepotExitStepper } from "../MyWareHouseDepotExitStepper";
import { AcceptDepotEntryByWareHouseMan } from "./AcceptDepotEntryByWareHouseMan";

export const DepotWareHouseEntyRequests = ({ isDesktop }) => {
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

    const res = await ShowDepotWareHouseList(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      DepotTypes.find((t) => t.key == "in").value,
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
    setDepotEntry(res?.data?.items);
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setLoading(false);
  };

  const handleResetSearch = (reset = true) => {
    if (!reset) return;
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

  const updateDepotEntryInList = async (updatedDepotEntry) => {
    console.log(updatedDepotEntry);

    setDepotEntry((prev) =>
      prev.map((g) => (g.id == updatedDepotEntry.id ? updatedDepotEntry : g))
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

  const validateDepotForAccept = async (depot) => {
    if (!depot?.exitGoodImage) {
      toast({
        title: "تایید ناموفق",
        description: "تصویر خودروی حامل کالا مشخص نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!depot?.driverSignImage) {
      toast({
        title: "تایید ناموفق",
        description: "تصویر امضای راننده و مدارک فاکتور مشخص نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return false;
    }
    return true;
  };

  const handleAcceptDepotByWarehouseMan = async (id) => {
    const depot = findDepotEntryFromList(id);
    const validate = await validateDepotForAccept(depot);
    if (!validate) return;

    setLoading(true);
    const res = await SetDepotIsAcceptedByWarehouseMan(id);
    if (!res?.success) {
      toast({
        title: "تایید ناموفق",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    toast({
      title: "تایید موفق",
      description: "سند ورودی با موفقیت تایید شد ",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    deleteDepotEntryFromList(id);
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
          userInfo="جستجوی ورودی انبار"
        />

        <Box flex="1" overflowY="auto" p={1}>
          <Flex direction="column" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
              {depotEntry.map((row) => (
                <Card
                  maxW="350px"
                  borderTopRadius={5}
                  borderWidth="1px"
                  borderColor="gray.300"
                  _hover={{ cursor: "", borderColor: "green.500" }}
                >
                  <CardHeader
                    py={4}
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
                        <Divider hidden={!row?.acceptedBy} />
                        <HStack hidden={!row?.acceptedBy}>
                          <Text fontFamily="IranSans"> تایید کننده :</Text>
                          <Text fontFamily="IranSans" fontSize="12px" mr="auto">
                            {row?.acceptedBy?.userfname +
                              " " +
                              row?.acceptedBy?.userlname}
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
                        _hover={{
                          color: "orange",
                        }}
                        color="blue.600"
                        onClick={(e) => {
                          setSelectedID(row?.id);
                          setDialogGears({
                            title: "تایید سند",
                            text: "شما در حال تایید سند ورود انبار می باشید، پس از تایید، موجودی کالا در انبار به میزان اقلام ثبت شده افزایش خواهد یافت، ادامه می دهید؟",
                            callBack: () =>
                              handleAcceptDepotByWarehouseMan(row?.id),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Tooltip label="تایید سند">
                          <Icon w={6} h={6} as={CircleCheckBig} />
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

        <MyModal
          modalHeader="تاییدیه مسئول انبار"
          isOpen={isOpen}
          onClose={onClose}
        >
          <AcceptDepotEntryByWareHouseMan
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
