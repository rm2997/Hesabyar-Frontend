import { DeleteIcon } from "@chakra-ui/icons";
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
import { Edit } from "lucide-react";
import { MyModalContainer } from "./MyModalContainer";
import { useState } from "react";
import { EditProforma } from "./EditProforma";

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

    console.log("Going to set selected with" + id);

    setSelectedID(id);

    console.log("Proforma ID selected:" + id);

    setModalHeader("ویرایش پیش فاکتور");
    setModalContetnt(
      <>
        <EditProforma id={id} setId={setSelectedID}></EditProforma>
      </>
    );
    onOpen();
  };
  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption>جدول اطلاعات پیش فاکتور های کاربر جاری</TableCaption>
        <Thead bg="blue.600">
          <Tr>
            {HeadLables.map((label) => (
              <Th color="white" id={label}>
                {label}
              </Th>
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
                    color="blue.600"
                    onClick={(e) => handleEditProforma(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    color="red.600"
                    onClick={(e) => handleDeleteProforma(row.id)}
                  >
                    <DeleteIcon />
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
      />
      {modalContetnt}
    </TableContainer>
  );
};
