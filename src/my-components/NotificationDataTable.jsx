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
import { Edit, Mail, MailCheckIcon, MailOpen, Trash2 } from "lucide-react";
import { MyModalContainer } from "./MyModalContainer";
import { useState } from "react";
export const NotificationDataTable = ({ HeadLables, DataRows }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteNotification = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف پیام زیر اطمینان دارید؟");
    //setModalContetnt(<DeleteProforma id={id} onClose={onClose} />);
    onOpen();
  };
  const handleEditNotification = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش پیام");
    //setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };

  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption> پیام های شما</TableCaption>
        <Thead
          bg="#68C15A"
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
          {DataRows.map((row) => (
            <Tr id={row.id} _hover={{ bg: "#EEEE", color: "orange" }}>
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.title}</Td>
              <Td>{row.message}</Td>
              <Td>{row.read ? <MailOpen /> : <Mail />}</Td>
              <Td textAlign="center">
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditNotification(row.id)}
                  >
                    <MailCheckIcon />
                  </Link>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditNotification(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#ffd54f" }}
                    color="red.600"
                    onClick={(e) => handleDeleteNotification(row.id)}
                  >
                    <Trash2 />
                  </Link>
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
