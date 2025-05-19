import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Edit,
  FilePenLine,
  Replace,
  Ruler,
  Send,
  Trash2,
  User2,
  UsersRound,
  WalletCards,
  Eye,
  Mail,
  MailOpen,
  EyeClosed,
  View,
} from "lucide-react";

import { MyModalContainer } from "../MyModalContainer";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  MarkNotificationAsRead,
  MarkNotificationAsUnread,
  RemoveNotification,
} from "../../api/services/notificationService";
import { ShowUserNotification } from "./ٍShowUserNotification";
import { useNotification } from "../../contexts/NotificationContext";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";

export const NotificationReceivedDataTable = ({ DataRows }) => {
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(0);
  const [userMessages, setUserMessages] = useState([]);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loadUnreadeNotif } = useNotification();
  const toast = useToast();

  useEffect(() => {
    setUserMessages([...DataRows]);
  }, [DataRows]);

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
      await MarkNotificationAsRead(id);
      await setUserMessagesAsRead(id);
      await loadUnreadeNotif();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkAsUnreadNotification = async (id) => {
    setSelectedID(id);
    try {
      await MarkNotificationAsUnread(id);
      await setUserMessagesAsUnread(id);
      await loadUnreadeNotif();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDialogClose = (result) => {
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };
  const handleDeleteNotification = () => {
    setLoading(true);
    RemoveNotification(selectedID)
      .then((res) => {
        const notifs = userMessages.filter((n) => n.id !== selectedID);
        setUserMessages(notifs);
        toast({
          title: "توجه",
          description: ` پیام حذف شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(setLoading(false));
  };

  const handleShowNotification = async (id) => {
    if (id === 0) return;
    setSelectedID(id);
    handleMarkAsReadNotification(id).then(() => onOpen());
  };

  dayjs.extend(jalali);

  return (
    <Flex direction="column" gap={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
        {userMessages.map((row) => (
          <Card
            borderTopRadius={5}
            borderWidth={1}
            _hover={{ borderColor: "orange" }}
          >
            <CardHeader bg="green.500" borderTopRadius={5} color="white">
              <HStack>
                {row.receiverRead ? (
                  <Tooltip label="خوانده شده">
                    <MailOpen color="yellow" />
                  </Tooltip>
                ) : (
                  <Tooltip label="خوانده نشده">
                    <Mail color="orange" />
                  </Tooltip>
                )}

                <Text mr="auto">{row.title}</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align={"stretch"} spacing={2}>
                <HStack>
                  <Text>تاریخ :</Text>
                  <Text mr="auto">
                    {dayjs(row.createdAt).locale("fa").format("YYYY/MM/DD")}
                  </Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>فرستنده :</Text>
                  <Text mr="auto">
                    {row.fromUser?.userfname + " " + row.fromUser?.userlname}
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
            <CardFooter borderBottomRadius={5} bg="gray.200">
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
                    <Tooltip label="به عنوان خوانده نشده مارک کن">
                      <Icon w={6} h={6} as={EyeClosed} />
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
                    <Tooltip label="به عنوان خوانده شده مارک کن">
                      <Icon w={6} h={6} as={Eye} />
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
                      callBack: handleDeleteNotification,
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
                    handleShowNotification(row.id);
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
      <Modal dir="rtl" onClose={onClose} size={"md"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.400">مشاهده پیام</ModalHeader>
          <ModalCloseButton />
          <ModalBody dir="rtl">
            <ShowUserNotification
              id={selectedID}
              notifications={userMessages}
              onClose={onClose}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              تایید
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        motionPreset="slideInTop"
        onClose={handleDialogClose}
        isOpen={isDialogOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>{dialogGears.title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody dir="rtl">{dialogGears.text}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onClick={(e) => {
                setIsDialogOpen(false);
                handleDialogClose("Cancel");
              }}
            >
              خیر
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={(e) => {
                setIsDialogOpen(false);
                handleDialogClose("Confirm");
              }}
            >
              بله
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
};
