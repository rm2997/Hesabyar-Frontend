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
} from "@chakra-ui/react";
import { Edit } from "lucide-react";
import { MyModalContainer } from "./MyModalContainer";
import { useState } from "react";

export const ProformaDataTable = ({ HeadLables, DataRows }) => {
  const [showModal, setShowModal] = useState(false);
  const handleDeleteProforma = (id) => {
    console.log(`Delete: ${id}`);
  };
  const handleEditProforma = (id) => {
    console.log(`Edit: ${id}`);
    setShowModal(true);
  };
  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption>جدول اطلاعات پیش فاکتور های کاربر جاری</TableCaption>
        <Thead bg="#2b0b8a">
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
              <Td id={row.createdAt}>{row.createdAt}</Td>
              <Td id={row.customerName}>{row.customerName}</Td>
              <Td id={row.approvedFile}>
                {row.approvedFile ? "دارد" : "ندارد"}
              </Td>
              <Td id={row.totalAmount}>{row.totalAmount}</Td>
              <Td>
                <HStack>
                  <Link
                    color="blue.600"
                    onClick={() => handleEditProforma(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    color="red.600"
                    onClick={() => handleDeleteProforma(row.id)}
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
      <MyModalContainer show={showModal} />
    </TableContainer>
  );
};
