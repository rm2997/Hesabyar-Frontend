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
import { Trash2, Mail, MailOpen, View } from "lucide-react";
import { MyLoading } from "../MyLoading";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  MarkNotificationAsRead,
  MarkNotificationAsUnread,
  RemoveNotification,
  ShowUserRcvAllNotifications,
} from "../../api/services/notificationService";
import { ShowUserNotification } from "./ShowUserNotification";
import { useNotification } from "../../contexts/NotificationContext";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { MyAlert } from "../MyAlert";
import { MyModal } from "../MyModal";
import { SearchBar } from "../SerachBar";
import { Pagination } from "../Pagination";

export const NotificationReceivedDataTable = ({ isDesktop }) => {
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
  const { loadUnreadeNotif } = useNotification();
  const toast = useToast();

  const handleResetSearch = () => {
    setSearch("");
    loadData(true);
  };

  const loadData = async (resetPage = false) => {
    if (!currentPage || !itemsPerPage) return;
    setLoading(true);

    const res = await ShowUserRcvAllNotifications(
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
    setUserMessages(res?.data?.items);
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  useLayoutEffect(() => {
    loadUnreadeNotif();
  }, []);

  const setUserMessagesAsRead = async (id) => {
    setUserMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, receiverRead: true } : msg))
    );
  };

  const setUserMessagesAsUnread = async (id) => {
    setUserMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, receiverRead: false } : msg))
    );
  };

  const handleMarkAsReadNotification = async (id) => {
    setSelectedID(id);
    try {
      setLoading(true);
      const res = await MarkNotificationAsRead(id);
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
      await setUserMessagesAsRead(id);
      await loadUnreadeNotif();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleMarkAsUnreadNotification = async (id) => {
    setSelectedID(id);
    try {
      setLoading(true);
      const res = await MarkNotificationAsUnread(id);
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
      await setUserMessagesAsUnread(id);
      await loadUnreadeNotif();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const deleteNotificationFromList = (id) => {
    setUserMessages((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteNotification = async (id) => {
    if (id == 0) return;
    setLoading(true);
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

  const handleShowNotification = async (id) => {
    if (id === 0) return;

    handleMarkAsReadNotification(id).then(() => onOpen());
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
          userInfo="جستجوی اعلان"
        />
        <Box flex="1" overflowY="auto" p={1}>
          <Flex direction="column" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
              {userMessages.map((row) => (
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
                      handleMarkAsReadNotification(row.id);
                      onOpen();
                    }}
                  >
                    <HStack fontFamily="iransans">
                      {row.receiverRead ? (
                        <Tooltip label="خوانده شده">
                          <MailOpen color="yellow" />
                        </Tooltip>
                      ) : (
                        <Tooltip label="خوانده نشده">
                          <Mail color="orange" />
                        </Tooltip>
                      )}

                      <Text fontFamily="iransans" mr="auto">
                        {row.title}
                      </Text>
                    </HStack>
                  </CardHeader>
                  <CardBody p={2}>
                    <VStack align={"stretch"} spacing={2}>
                      <HStack>
                        <Text>تاریخ :</Text>
                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                          {dayjs(row.createdAt)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text>فرستنده :</Text>
                        <Text fontFamily="IranSans" mr="auto">
                          {row.fromUser?.userfname +
                            " " +
                            row.fromUser?.userlname}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text>محتوا :</Text>
                        <Text fontFamily="IranSans" mr="auto">
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
                      {row.receiverRead ? (
                        <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={() => handleMarkAsUnreadNotification(row.id)}
                        >
                          <Tooltip
                            fontFamily="IranSans"
                            label="به عنوان خوانده نشده مارک کن"
                          >
                            <Icon w={6} h={6} as={Mail} />
                          </Tooltip>
                        </Link>
                      ) : (
                        <Link
                          _hover={{
                            color: "orange",
                          }}
                          color="blue.600"
                          onClick={() => handleMarkAsReadNotification(row.id)}
                        >
                          <Tooltip
                            fontFamily="IranSans"
                            label="به عنوان خوانده شده مارک کن"
                          >
                            <Icon w={6} h={6} as={MailOpen} />
                          </Tooltip>
                        </Link>
                      )}
                      <Link
                        _hover={{ color: "#ffd54f" }}
                        color="red.600"
                        onClick={(e) => {
                          setSelectedID(row.id);
                          setDialogGears({
                            title: "حذف پیام",
                            text: "آیا واقعا می خواهید این پیام را حذف کنید؟",
                            callBack: () => handleDeleteNotification(row?.id),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Tooltip label="حذف">
                          <Icon w={6} h={6} as={Trash2} />
                        </Tooltip>
                      </Link>

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
                          handleMarkAsReadNotification(row.id);
                          onOpen();
                        }}
                      >
                        <Tooltip label="مشاهده">
                          <Icon w={6} h={6} as={View} />
                        </Tooltip>
                      </Link>
                    </Stack>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
        <MyModal
          size="lg"
          modalHeader={dialogGears.title}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ShowUserNotification
            id={selectedID}
            notification={userMessages.find((n) => n.id == selectedID)}
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
