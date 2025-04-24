import { DeleteIcon } from "@chakra-ui/icons";
import {
  HStack,
  Link,
  ModalContent,
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
import { Edit, Trash2 } from "lucide-react";
import { MyModalContainer } from "./MyModalContainer";
import { useState } from "react";
import { EditProforma } from "./EditProforma";
import { color } from "framer-motion";

export const ProformaDataTable = ({ HeadLables, DataRows }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    onOpen();
  };
  const handleEditProforma = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش پیش فاکتور");
    setModalContetnt(<EditProforma id={id} onClose={onClose}></EditProforma>);

    onOpen();
  };
  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption>جدول اطلاعات پیش فاکتور های کاربر جاری</TableCaption>
        <Thead
          bg="#7bfb32"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          color="black"
        >
          <Tr>
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {DataRows.map((row) => (
            <Tr>
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.createdAt}</Td>
              <Td>{row.customerName}</Td>
              <Td>{row.approvedFile ? "دارد" : "ندارد"}</Td>
              <Td>{row.totalAmount}</Td>
              <Td>
                <HStack>
                  <Link
                    _hover={{ color: "#00952b" }}
                    color="blue.600"
                    onClick={(e) => handleEditProforma(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#00952b" }}
                    color="red.600"
                    onClick={(e) => handleDeleteProforma(row.id)}
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
