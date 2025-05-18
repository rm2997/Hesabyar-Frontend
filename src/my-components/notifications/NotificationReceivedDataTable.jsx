import {
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
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
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
} from "lucide-react";

import { MyModalContainer } from "../MyModalContainer";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  MarkNotificationAsRead,
  MarkNotificationAsUnread,
} from "../../api/services/notificationService";
import { ShowUserNotification } from "./ٍShowUserNotification";
import { useNotification } from "../../contexts/NotificationContext";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";

export const NotificationReceivedDataTable = ({ DataRows }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [userMessages, setUserMessages] = useState([]);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loadUnreadeNotif } = useNotification();

  useEffect(() => {
    setUserMessages([...DataRows]);
  }, [DataRows]);

  useLayoutEffect(() => {
    loadUnreadeNotif();
  }, []);

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
  const handleMarkAsReadNotification = async (id) => {
    console.log(id);
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
    console.log(id);
    setSelectedID(id);
    try {
      await MarkNotificationAsUnread(id);
      await setUserMessagesAsUnread(id);
      await loadUnreadeNotif();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNotification = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف پیام زیر اطمینان دارید؟");
    //setModalContetnt(<DeleteProforma id={id} onClose={onClose} />);
    //onOpen();
  };

  const handleShowNotification = async (id) => {
    if (id === 0) return;
    await handleMarkAsReadNotification(id);
    setModalHeader("مشاهده پیام");
    setModalContetnt(<ShowUserNotification id={id} onClose={onClose} />);
    onOpen();
  };

  dayjs.extend(jalali);

  return (
    <Flex direction="column" gap={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
        {DataRows.map((row) => (
          <Card
            borderTopRadius={5}
            borderWidth={1}
            _hover={{ borderColor: "orange" }}
          >
            <CardHeader bg="green.500" borderTopRadius={5} color="white">
              <HStack>
                {row.read ? (
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
                  <Text>از طرف :</Text>
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
                {row.read ? (
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
                <Link _hover={{ color: "#ffd54f" }} color="red.600">
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
  );
};
