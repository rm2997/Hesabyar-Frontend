import {
  HStack,
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Eye, Mail, MailOpen } from "lucide-react";
import { MyModalContainer } from "./MyModalContainer";
import { useEffect, useLayoutEffect, useState } from "react";
import { MarkNotificationAsRead } from "../api/services/notificationService";
import { ShowUserNotification } from "./ٍShowUserNotification";
import { useNotification } from "../contexts/NotificationContext";

export const NotificationDataTable = ({ HeadLables, DataRows }) => {
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

  const setUserMessagesReasStat = async (id) => {
    setUserMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };
  const handleMarkAsReadNotification = async (id) => {
    setSelectedID(id);
    try {
      await MarkNotificationAsRead(id);
      await setUserMessagesReasStat(id);
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

  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption> پیام های شما</TableCaption>
        <Thead
          bg="#fad7a0"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={50}
          color="black"
          height={50}
        >
          <Tr>
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {userMessages.map((row) => (
            <Tr id={row.id} _hover={{ bg: "#EEEE" }}>
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.title}</Td>
              <Td>
                {row.message.length > 15
                  ? row.message.substring(0, 12) + "..."
                  : row.message}
              </Td>
              <Td>
                <Link
                  _hover={{
                    color: "orange",
                  }}
                  color="blue.600"
                  onClick={(e) => handleMarkAsReadNotification(row.id)}
                >
                  {row.read ? (
                    <MailOpen color="green" />
                  ) : (
                    <Mail color=" #d2b4de " />
                  )}
                </Link>
              </Td>
              <Td textAlign="center">
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleShowNotification(row.id)}
                  >
                    <Eye />
                  </Link>
                  {/* <Link
                    _hover={{ color: "#ffd54f" }}
                    color="red.600"
                    onClick={(e) => handleDeleteNotification(row.id)}
                  >
                    <Trash2 />
                  </Link> */}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            {HeadLables.map((label, idx, isNumeric) => (
              <Th id={idx} isNumeric={isNumeric}>
                {label}
              </Th>
            ))}
          </Tr>
        </Tfoot>
      </Table>

      <MyModalContainer
        onClose={onClose}
        isOpen={isOpen}
        onOpen={onOpen}
        proformaID={selectedID}
        modalHeader={modalHeader}
      >
        {modalContetnt}
      </MyModalContainer>
    </TableContainer>
  );
};
