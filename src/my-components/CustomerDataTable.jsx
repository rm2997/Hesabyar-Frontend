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
import { MyModalContainer } from "./MyModalContainer";
import { useEffect, useState } from "react";
import { EditCustomer } from "./EditCustomer";
import { DeleteCustomer } from "./DeleteCustomer";

export const CustomerDataTable = ({ HeadLables, DataRows }) => {
  const [customersData, setCustomersData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteCustomer = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف مشتری زیر اطمینان دارید؟");
    setModalContetnt(
      <DeleteCustomer
        id={id}
        onDelete={deleteCustomerFromList}
        onClose={onClose}
      />
    );
    onOpen();
  };

  const updateCustomerInList = (updatedCustomer) => {
    setCustomersData((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const deleteCustomerFromList = (id) => {
    setCustomersData((prev) => prev.filter((customer) => customer.id !== id));
  };

  const findCustomerFromList = (id) => {
    customersData.map((customer) => (customer.id === id ? customer : null));
  };

  const handleEditCustomer = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش مشخصات مشتری");
    setModalContetnt(
      <EditCustomer
        id={id}
        onClose={onClose}
        onUpdate={updateCustomerInList}
        customer={findCustomerFromList(id)}
      />
    );
    onOpen();
  };

  useEffect(() => {
    setCustomersData([...DataRows]);
  }, [DataRows]);

  return (
    <TableContainer>
      <Table
        color="black"
        colorScheme="blackAlpha"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <TableCaption>جدول اطلاعات مشتری ها</TableCaption>
        <Thead bg="#50b742" color="white" borderTopRadius={50} height={50}>
          <Tr color="white">
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {customersData.map((row) => (
            <Tr _hover={{ bg: "#f5f5f5" }} cursor="pointer">
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.customerFName}</Td>
              <Td>{row.customerLName}</Td>
              <Td>{row.customerNationalCode}</Td>
              <Td>{row.customerPhone}</Td>
              <Td>
                {row.customerAddress.length > 15
                  ? row.customerAddress.substring(0, 12) + "..."
                  : row.customerAddress}
              </Td>
              <Td>
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditCustomer(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#ffd54f" }}
                    color="red.600"
                    onClick={(e) => handleDeleteCustomer(row.id)}
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
