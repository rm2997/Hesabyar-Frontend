import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import { FilePenLine, Ruler, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { EditUnit } from "./EditUnit";
import { MyAlert } from "../MyAlert";
import { MyModal } from "../MyModal";
import { RemoveUnit, ShowAllUnits } from "../../api/services/unitsService";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";

export const UnitsDataTable = ({ isDesktop }) => {
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitsData, setUnitsData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const updateUnitInList = (updatedUnit) => {
    setUnitsData((prev) =>
      prev.map((u) => (u.id == updatedUnit.id ? updatedUnit : u))
    );
  };

  const deleteUnitFromList = (id) => {
    setUnitsData((prev) => prev.filter((u) => u.id != id));
  };

  const findUnitFromList = (id) => {
    unitsData.map((u) => (u.id === id ? u : null));
  };

  const handleDeleteUnit = async (id) => {
    if (id == 0) return;
    setLoading(true);
    const res = await RemoveUnit(id);
    if (!res.success) {
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
    deleteUnitFromList(id);
    toast({
      title: "توجه",
      description: "واحد حذف شد",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLoading(false);
  };

  const loadData = async (resetPage = false) => {
    setLoading(true);
    const res = await ShowAllUnits(
      resetPage ? 1 : currentPage,
      itemsPerPage,
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
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setUnitsData(res?.data?.items);
    setLoading(false);
  };

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  return (
    <Box>
      <Flex
        direction="column"
        m={1}
        filter={loading ? "blur(10px)" : ""}
        overflowY="auto"
        minH={isDesktop ? "74vh" : "75vh"}
      >
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleResetSearch={handleResetSearch}
          loadData={loadData}
          userInfo="جستجوی واحد اندازه گیری"
        />

        <Box flex="1" overflowY="auto" p={1}>
          <Flex direction="column" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {unitsData.map((row) => (
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
                    onClick={() => {
                      setSelectedID(row.id);
                      setDialogGears({
                        title: "ویرایش واحد",
                      });
                      onOpen();
                    }}
                  >
                    <Flex justify="space-between" columnGap={3}>
                      <Ruler color="purple" />
                      <Flex flex={3} direction={"row"} gap={3}>
                        <Text>کد : </Text>
                        <Text>{row?.sepidarId}</Text>-
                        <Text
                          fontSize={["16px", "16px", "15px", "15px"]}
                          fontFamily="iransans"
                        >
                          {row.unitName}
                        </Text>
                      </Flex>
                    </Flex>
                  </CardHeader>
                  <CardBody px={4} py={2}>
                    <VStack align={"stretch"} spacing={2}>
                      <HStack>
                        <Text>توضیحات :</Text>
                        <Text mr="auto">
                          {row?.unitInfo?.length > 15
                            ? row?.unitInfo?.substring(0, 12) + "..."
                            : row?.unitInfo}
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
                          setSelectedID(row.id);
                          setDialogGears({
                            title: "حذف واحد",
                            text: "آیا واقعا می خواهید این واحد را حذف کنید؟",
                            callBack: () => handleDeleteUnit(row?.id),
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
                            title: "مشاهده و ویرایش واحد",
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
      </Flex>
      <MyModal
        size="md"
        modalHeader={dialogGears.title}
        isOpen={isOpen}
        onClose={onClose}
      >
        <EditUnit
          id={selectedID}
          onClose={onClose}
          onUpdate={updateUnitInList}
          Unit={findUnitFromList(selectedID)}
        />
      </MyModal>
      <MyAlert
        AlertHeader={dialogGears.title}
        AlertMessage={dialogGears.text}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
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
      {loading && <MyLoading />}
    </Box>
  );
};
