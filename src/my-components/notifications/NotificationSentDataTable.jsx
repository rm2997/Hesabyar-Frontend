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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Trash2, Mail, View } from "lucide-react";
import { BsEnvelopeArrowUp } from "react-icons/bs";
import { MyLoading } from "../MyLoading";
import { useEffect, useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import {
  RemoveNotification,
  ShowUserSndNotifications,
} from "../../api/services/notificationService";
import { ShowUserNotification } from "./ShowUserNotification";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";

export const NotificationSentDataTable = ({ isDesktop }) => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(0);
  const [userMessages, setUserMessages] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { loadUnreadeNotif } = useNotification();

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };
  const loadData = async (resetPage = false) => {
    if (!currentPage || !itemsPerPage) return;
    setLoading(true);

    const res = await ShowUserSndNotifications(
      resetPage ? 1 : currentPage,
      itemsPerPage,
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

    setUserData(res?.data?.items);
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const setUserMessagesAsRead = async (id) => {
    const messages = userMessages.filter((u) => u.id != id);
    const message = userMessages.find((u) => u.id == id);
    message.read = true;
    if (!message) return;
    messages.push(message);
    setUserMessages(messages);
  };

  const setUserMessagesAsUnread = async (id) => {
    const messages = userMessages.filter((u) => u.id != id);
    const message = userMessages.find((u) => u.id == id);
    message.read = false;
    if (!message) return;
    messages.push(message);
    setUserMessages(messages);
  };

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const deleteNotificationFromList = (id) => {
    setUserData((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteNotification = async (id) => {
    setLoading(true);
    if (id == 0) return;
    const res = await RemoveNotification(id);
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
    deleteNotificationFromList(id);
    toast({
      title: "توجه",
      description: ` پیام حذف شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  dayjs.extend(jalali);

  return (
    <Box>
      <Flex
        filter={loading ? "blur(10px)" : ""}
        direction="column"
        height="80vh"
      >
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleResetSearch={handleResetSearch}
          loadData={loadData}
          userInfo="جستجوی اعلان ارسالی"
        />
        {!isDesktop && (
          <Box flex="1" overflowY="auto" p={1}>
            <Flex direction="column" gap={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
                {userData.map((row) => (
                  <Card
                    borderTopRadius={5}
                    borderWidth={1}
                    _hover={{ borderColor: "orange" }}
                  >
                    <CardHeader
                      py={4}
                      bg="green.500"
                      borderTopRadius={5}
                      color="white"
                      _hover={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedID(row.id);
                        setDialogGears({
                          title: "مشاهده پیام",
                          text: "",
                          callBack: null,
                        });
                        onOpen();
                      }}
                    >
                      <HStack>
                        <Tooltip>
                          <Mail color="orange" />
                        </Tooltip>
                        <Text fontFamily="IranSans" mr="auto">
                          {row?.title?.length <= 25
                            ? row?.title
                            : row?.title?.substring(0, 25) + "..."}
                        </Text>
                      </HStack>
                    </CardHeader>
                    <CardBody p={2}>
                      <VStack align={"stretch"} spacing={2}>
                        <HStack>
                          <Text>عنوان :</Text>
                          <Tooltip label={row?.title}>
                            <Text fontFamily="iransans" mr="auto">
                              {row?.title?.length <= 30
                                ? row?.title
                                : row?.title?.substring(0, 30) + "..."}
                            </Text>
                          </Tooltip>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text fontFamily="IranSans">تاریخ :</Text>
                          <Text fontFamily="IranSans" fontSize="md" mr="auto">
                            {dayjs(row.createdAt)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>گیرنده :</Text>
                          <Text mr="auto">
                            {row.toUser?.userfname +
                              " " +
                              row.toUser?.userlname}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>محتوا :</Text>
                          <Text mr="auto">
                            {row.message.length > 15
                              ? row.message.substring(0, 12) + "..."
                              : row.message}
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
                          color="green"
                          onClick={() => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "مشاهده پیام",
                              text: "",
                              callBack: null,
                            });
                            onOpen();
                          }}
                        >
                          <Tooltip label="مشاهده">
                            <Icon w={6} h={6} as={View} />
                          </Tooltip>
                        </Link>

                        <Link
                          _hover={{ color: "#ffd54f" }}
                          color="red.600"
                          onClick={(e) => {
                            setSelectedID(row.id);
                            setDialogGears({
                              title: "حذف پیام",
                              text: "آیا واقعا می خواهید این پیام را حذف کنید؟",
                              callBack: () => handleDeleteNotification(row.id),
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
                <TableCaption fontFamily={"IranSans"}>
                  پیام های ارسال شده
                </TableCaption>
                <Thead bg={"gray.100"}>
                  <Tr>
                    <Td>وضعیت </Td>
                    <Td>تاریخ </Td>
                    <Td>عنوان</Td>
                    <Td>گیرنده</Td>
                    <Td></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {userData.map((row) => (
                    <Tr
                      _hover={{
                        boxShadow: "md",
                        borderWidth: "1px",
                        borderRadius: "md",
                        cursor: "pointer",
                      }}
                    >
                      <Td
                        onClick={() => {
                          setSelectedID(row.id);
                          setDialogGears({
                            title: "مشاهده پیام",
                            text: "",
                            callBack: null,
                          });
                          onOpen();
                        }}
                      >
                        <BsEnvelopeArrowUp size={"24px"} color="green" />
                      </Td>
                      <Td>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {dayjs(row.createdAt)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                        </Text>
                      </Td>
                      <Td>
                        <Tooltip label={row?.title}>
                          <Text fontFamily="iransans" mr="auto">
                            {row?.title?.length <= 50
                              ? row?.title
                              : row?.title?.substring(0, 50) + "..."}
                          </Text>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Text mr="auto">
                          {row.toUser?.userfname + " " + row.toUser?.userlname}
                        </Text>
                      </Td>

                      <Td>
                        <Stack
                          direction={["row"]}
                          spacing={2}
                          align={"stretch"}
                          mr="auto"
                        >
                          <Link
                            _hover={{ color: "#ffd54f" }}
                            color="green"
                            onClick={() => {
                              setSelectedID(row.id);
                              setDialogGears({
                                title: "مشاهده پیام",
                                text: "",
                                callBack: null,
                              });
                              onOpen();
                            }}
                          >
                            <Tooltip label="مشاهده">
                              <Icon w={6} h={6} as={View} />
                            </Tooltip>
                          </Link>

                          <Link
                            _hover={{ color: "#ffd54f" }}
                            color="red.600"
                            onClick={(e) => {
                              setSelectedID(row.id);
                              setDialogGears({
                                title: "حذف پیام",
                                text: "آیا واقعا می خواهید این پیام را حذف کنید؟",
                                callBack: () =>
                                  handleDeleteNotification(row.id),
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Tooltip label="حذف">
                              <Icon w={6} h={6} as={Trash2} />
                            </Tooltip>
                          </Link>
                        </Stack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <MyModal
          size="md"
          modalHeader={dialogGears.title}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ShowUserNotification
            id={selectedID}
            notification={userData.find((n) => n.id == selectedID)}
          />
        </MyModal>
        <MyAlert
          AlertHeader={dialogGears.title}
          AlertMessage={dialogGears.text}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Flex>
      {loading && <MyLoading />}
    </Box>
  );
};
