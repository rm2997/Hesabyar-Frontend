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
import { Edit, Trash2 } from "lucide-react";
import { MyModalContainer } from "../MyModalContainer";
import { useState } from "react";
import { EditProforma } from "./EditProforma";
import { DeleteProforma } from "./DeleteProforma";

export const ProformaDataTable = ({ HeadLables, DataRows }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف پیش فاکتور زیر اطمینان دارید؟");
    setModalContetnt(<DeleteProforma id={id} onClose={onClose} />);
    onOpen();
  };
  const handleEditProforma = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش پیش فاکتور");
    setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };
  return (
    <TableContainer>
      <Table
        color="black"
        colorScheme="blackAlpha"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <TableCaption>جدول اطلاعات پیش فاکتور های کاربر جاری</TableCaption>
        <Thead bg="#50b742" color="white" borderTopRadius={50} height={50}>
          <Tr color="white">
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {DataRows.map((row) => (
            <Tr _hover={{ bg: "#f5f5f5" }} cursor="pointer">
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.createdAt}</Td>
              <Td>
                {row.customer?.customerFName +
                  " " +
                  row.customer?.customerLName}
              </Td>
              <Td>{row.paymentStatus}</Td>
              <Td>{row.approvedFile ? "دارد" : "ندارد"}</Td>
              <Td>{row.totalAmount}</Td>
              <Td>
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditProforma(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#ffd54f" }}
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
