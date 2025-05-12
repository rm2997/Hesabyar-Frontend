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
import { useEffect, useState } from "react";
import { EditUnit } from "./EditUnit";
import { DeleteUnit } from "./DeleteUnit";

export const UnitsDataTable = ({ HeadLables, DataRows }) => {
  const [unitsData, setUnitsData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateUnitInList = (updatedUnit) => {
    setUnitsData((prev) =>
      prev.map((Unit) => (Unit.id === updatedUnit.id ? updatedUnit : Unit))
    );
  };

  const deleteUnitFromList = (id) => {
    setUnitsData((prev) => prev.filter((Unit) => Unit.id !== id));
  };

  const findUnitFromList = (id) => {
    unitsData.map((Unit) => (Unit.id === id ? Unit : null));
  };

  const handleDeleteUnit = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف واحد زیر اطمینان دارید؟");
    setModalContetnt(
      <DeleteUnit id={id} onDelete={deleteUnitFromList} onClose={onClose} />
    );
    onOpen();
  };

  const handleEditUnit = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش مشخصات واحد");
    setModalContetnt(
      <EditUnit
        id={id}
        onClose={onClose}
        onUpdate={updateUnitInList}
        Unit={findUnitFromList(id)}
      />
    );
    onOpen();
  };

  useEffect(() => {
    setUnitsData([...DataRows]);
  }, [DataRows]);

  return (
    <TableContainer>
      <Table
        color="black"
        colorScheme="blackAlpha"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <TableCaption>جدول اطلاعات واحدهای کالا</TableCaption>
        <Thead bg="#50b742" color="white" borderTopRadius={50} height={50}>
          <Tr color="white">
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {unitsData.map((row) => (
            <Tr _hover={{ bg: "#f5f5f5" }} cursor="pointer">
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.unitName}</Td>
              <Td>
                {row.unitInfo.length > 15
                  ? row.unitInfo.substring(0, 12) + "..."
                  : row.unitInfo}
              </Td>
              <Td>
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditUnit(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#ffd54f" }}
                    color="red.600"
                    onClick={(e) => handleDeleteUnit(row.id)}
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
