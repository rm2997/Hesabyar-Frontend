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
import { EditGood } from "./EditGood";
import { DeleteGood } from "./DeleteGood";

export const GoodsDataTable = ({ HeadLables, DataRows }) => {
  const [goodsData, setGoodsData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateGoodInList = (updatedGood) => {
    setGoodsData((prev) =>
      prev.map((Good) => (Good.id === updatedGood.id ? updatedGood : Good))
    );
  };

  const deleteGoodFromList = (id) => {
    setGoodsData((prev) => prev.filter((Good) => Good.id !== id));
  };

  const findGoodFromList = (id) => {
    goodsData.map((Good) => (Good.id === id ? Good : null));
  };

  const handleDeleteGood = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف کالای زیر اطمینان دارید؟");
    setModalContetnt(
      <DeleteGood id={id} onDelete={deleteGoodFromList} onClose={onClose} />
    );
    onOpen();
  };

  const handleEditGood = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش مشخصات کالا");
    setModalContetnt(
      <EditGood
        id={id}
        onClose={onClose}
        onUpdate={updateGoodInList}
        Good={findGoodFromList(id)}
      />
    );
    onOpen();
  };

  useEffect(() => {
    setGoodsData([...DataRows]);
  }, [DataRows]);

  return (
    <TableContainer>
      <Table
        color="black"
        colorScheme="blackAlpha"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <TableCaption>جدول اطلاعات کالا ها</TableCaption>
        <Thead bg="#50b742" color="white" borderTopRadius={50} height={50}>
          <Tr color="white">
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {goodsData.map((row) => (
            <Tr _hover={{ bg: "#f5f5f5" }} cursor="pointer">
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.goodName}</Td>
              <Td>{row.goodUnit}</Td>
              <Td>
                {row.goodInfo.length > 15
                  ? row.goodInfo.substring(0, 12) + "..."
                  : row.goodInfo}
              </Td>
              <Td>
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditGood(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#ffd54f" }}
                    color="red.600"
                    onClick={(e) => handleDeleteGood(row.id)}
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
