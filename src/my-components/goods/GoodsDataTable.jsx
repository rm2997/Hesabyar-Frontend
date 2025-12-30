import {
  AbsoluteCenter,
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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FilePenLine, Trash2, WalletCards } from "lucide-react";
import { AiOutlineProduct } from "react-icons/ai";

import { useEffect, useState } from "react";
import { EditGood } from "./EditGood";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { RemoveGood, ShowAllGoods } from "../../api/services/goodsService";

import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";

export const GoodsDataTable = ({}) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const [goodsData, setGoodsData] = useState([]);

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

  const loadData = async (resetPage = false) => {
    setLoading(true);
    const res = await ShowAllGoods(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      resetPage ? "" : search
    );
    if (!res.data) {
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
    setGoodsData(res?.data.items);
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

  const updateGoodInList = (updatedGood) => {
    setGoodsData((prev) =>
      prev.map((g) => (g.id === updatedGood.id ? updatedGood : g))
    );
  };

  const deleteGoodFromList = (id) => {
    setGoodsData((prev) => prev.filter((g) => g.id !== id));
  };

  const findGoodFromList = (id) => {
    goodsData.map((g) => (g.id === id ? g : null));
  };

  const handleDeleteGood = async (id) => {
    if (id == 0) return;
    setLoading(true);
    const res = await RemoveGood(id);
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

    deleteGoodFromList(id);
    toast({
      title: "توجه",
      description: `کالا حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  return (
    <Box>
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleResetSearch={handleResetSearch}
        loadData={loadData}
        userInfo="جستجوی کالا"
      />
      <Flex
        filter={loading ? "blur(10px)" : ""}
        direction="column"
        minH={isDesktop ? "85vh" : "83vh"}
        overflowY="auto"
        m={1}
      >
        {!isDesktop && (
          <Box flex="1" overflowY="auto" p={1}>
            <Flex direction="column" gap={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {goodsData.map((row) => (
                  <Card
                    borderTopRadius={5}
                    borderWidth={1}
                    _hover={{ borderColor: "orange" }}
                  >
                    <CardHeader
                      maxH="60px"
                      bg="green.500"
                      borderTopRadius={5}
                      color="white"
                      _hover={{ cursor: "pointer" }}
                      onClick={(e) => {
                        setSelectedID(row?.id);
                        setDialogGears({
                          title: "مشاهده و ویرایش کالا",
                          text: "",
                          callBack: null,
                        });
                        onOpen();
                      }}
                    >
                      <Flex justify="space-between" columnGap={3}>
                        <WalletCards color="purple" />
                        <Flex flex={3} direction={"row"} gap={3}>
                          <Tooltip label={row?.goodName}>
                            <Flex direction={"row"} gap={2}>
                              <Text> کد کالا :</Text>
                              <Text
                                fontFamily="IranSans"
                                fontSize="md"
                                mr="auto"
                              >
                                {row?.sepidarCode ? row?.sepidarCode : "0"}
                              </Text>
                            </Flex>
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </CardHeader>
                    <CardBody px={4} py={2}>
                      <VStack align={"stretch"} spacing={2}>
                        <HStack>
                          <Text> نام :</Text>
                          <Tooltip label={row?.goodName}>
                            <Text mr="auto" fontFamily="iransans">
                              {row?.goodName?.length > 26
                                ? row?.goodName?.substring(0, 26) + "..."
                                : row?.goodName}
                            </Text>
                          </Tooltip>
                        </HStack>
                        <Divider />

                        <HStack>
                          <Text> موجودی :</Text>
                          <Text fontFamily="IranSans" fontSize="md" mr="auto">
                            {row?.goodCount
                              ? Number(row?.goodCount).toLocaleString()
                              : "0"}{" "}
                            {row?.goodUnit?.unitName}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text> فروخته شده :</Text>
                          <Text fontFamily="IranSans" fontSize="md" mr="auto">
                            {row?.goodSaleCount
                              ? Number(row?.goodSaleCount).toLocaleString()
                              : "0"}{" "}
                            {row?.goodUnit?.unitName}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text> قابل فروش :</Text>
                          <Text
                            dir="ltr"
                            fontFamily="IranSans"
                            fontSize="md"
                            mr="auto"
                          >
                            {Number(
                              row?.goodCount - row?.goodSaleCount
                            ).toLocaleString()}{" "}
                          </Text>
                          <Text> {row?.goodUnit?.unitName}</Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>توضیحات :</Text>
                          <Text mr="auto">
                            {row?.goodInfo?.length > 15
                              ? row?.goodInfo?.substring(0, 12) + "..."
                              : row?.goodInfo}
                          </Text>
                        </HStack>
                      </VStack>
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
                          color="red.600"
                          onClick={(e) => {
                            setSelectedID(row?.id);
                            setDialogGears({
                              title: "حذف کالا",
                              text: "آیا واقعا می خواهید این کالا را حذف کنید؟",
                              callBack: () => handleDeleteGood(row?.id),
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
                          onClick={(e) => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "ویرایش کالا",
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
                      </Stack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </Flex>
          </Box>
        )}
        {isDesktop && (
          <Box
            borderWidth={"1px"}
            borderColor={"black"}
            borderRadius={"md"}
            bg={"#FEFEFE"}
            mx={4}
            my={1}
          >
            <TableContainer>
              <Table textColor={"black"} variant={"simple"}>
                <TableCaption fontFamily={"IranSans"}>کالاها</TableCaption>
                <Thead bg={"gray.100"}>
                  <Tr>
                    <Td></Td>
                    <Td>کد کالا </Td>
                    <Td>نام </Td>
                    <Td>موجودی</Td>
                    <Td>فروخته شده </Td>
                    <Td>قابل فروش</Td>
                    <Td>واحد</Td>
                    <Td>توضیحات</Td>
                    <Td></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {goodsData.map((row) => (
                    <Tr
                      _hover={{
                        boxShadow: "md",
                        borderWidth: "1px",
                        borderRadius: "md",
                        cursor: "pointer",
                      }}
                    >
                      <Td
                        onClick={(e) => {
                          setSelectedID(row.id);
                          setDialogGears({
                            title: "ویرایش کالا",
                            text: "",
                            callBack: null,
                          });
                          onOpen();
                        }}
                      >
                        <AiOutlineProduct size={"24px"} color="orange" />
                      </Td>
                      <Td>
                        <Text fontFamily="IranSans" fontSize="md">
                          {row?.sepidarCode ? row?.sepidarCode : "0"}
                        </Text>
                      </Td>
                      <Td>
                        <Text mr="auto" fontFamily="iransans">
                          {row?.goodName}
                        </Text>
                      </Td>
                      <Td>
                        <Text
                          fontFamily="IranSans"
                          fontSize="md"
                          dir="ltr"
                          textAlign={"center"}
                        >
                          {row?.goodCount
                            ? Number(row?.goodCount).toLocaleString()
                            : "0"}
                        </Text>
                      </Td>
                      <Td>
                        <Text
                          fontFamily="IranSans"
                          fontSize="md"
                          dir="ltr"
                          textAlign={"center"}
                        >
                          {Number(
                            row?.goodCount - row?.goodSaleCount
                          ).toLocaleString()}{" "}
                        </Text>
                      </Td>
                      <Td>
                        <Text
                          fontFamily="IranSans"
                          fontSize="md"
                          dir="ltr"
                          textAlign={"center"}
                        >
                          {Number(
                            row?.goodCount - row?.goodSaleCount
                          ).toLocaleString()}{" "}
                        </Text>
                      </Td>
                      <Td>{row?.goodUnit?.unitName}</Td>
                      <Td>
                        <Text mr="auto">
                          {row?.goodInfo?.length > 30
                            ? row?.goodInfo?.substring(0, 30) + "..."
                            : row?.goodInfo}
                        </Text>
                      </Td>
                      <Td>
                        <HStack
                          direction={["row"]}
                          spacing={2}
                          align={"stretch"}
                          mr="auto"
                        >
                          <Link
                            _hover={{ color: "#ffd54f" }}
                            color="red.600"
                            onClick={(e) => {
                              setSelectedID(row?.id);
                              setDialogGears({
                                title: "حذف کالا",
                                text: "آیا واقعا می خواهید این کالا را حذف کنید؟",
                                callBack: () => handleDeleteGood(row?.id),
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
                            onClick={(e) => {
                              setSelectedID(row.id);
                              setDialogGears({
                                title: "ویرایش کالا",
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
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Flex>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <MyModal
        size="md"
        modalHeader="مشاهده و ویرایش کالا"
        isOpen={isOpen}
        onClose={onClose}
      >
        <EditGood
          id={selectedID}
          onClose={onClose}
          onUpdate={updateGoodInList}
          //Good={findGoodFromList(selectedID)}
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
