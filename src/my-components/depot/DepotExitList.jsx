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
  DecimalsArrowLeft,
  FilePenLine,
  Trash2,
  WalletCards,
} from "lucide-react";

import { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";
import { RemoveDepot, ShowAllDepots } from "../../api/services/depotService";
import { DepotTypes } from "../../api/services/enums/depotTypes.enum";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { EditDepotEntry } from "./EditDepotEntry";

export const DepotExitList = ({ isDesktop }) => {
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
    console.log(res.data);
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
                  borderTopRadius={5}
                  borderWidth={1}
                  _hover={{ borderColor: "orange" }}
                >
                  <CardHeader
                    bg="green.500"
                    borderTopRadius={5}
                    color="white"
                    _hover={{ cursor: "pointer" }}
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
                      <DecimalsArrowLeft color="orange" />
                      <Text fontFamily="IranSans" fontSize="md" mr="auto">
                        شماره : {row.id}
                      </Text>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align={"stretch"} spacing={2}>
                      <HStack>
                        <Text> تاریخ ورود :</Text>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {dayjs(row.deliveredAt)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
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
                      <HStack>
                        <Text> تحویل دهنده:</Text>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {row?.deliveredBy.customerFName +
                            " " +
                            row?.deliveredBy.customerLName}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text> نام کالا :</Text>
                        <Tooltip label={row.depotGood?.goodName}>
                          <Text mr="auto">
                            {row.depotGood?.goodName?.length > 20
                              ? row?.depotGood?.goodName.substring(0, 20) +
                                "..."
                              : row.depotGood?.goodName}
                          </Text>
                        </Tooltip>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text> مقدار :</Text>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {row.quantity}
                        </Text>
                      </HStack>
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
          <EditDepotEntry
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
