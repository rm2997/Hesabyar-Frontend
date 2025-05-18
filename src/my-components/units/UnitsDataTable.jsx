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
} from "lucide-react";
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
                <Ruler color="purple" />
                <Text mr="auto">{row.unitName}</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align={"stretch"} spacing={2}>
                <HStack>
                  <Text>توضیحات :</Text>
                  <Text mr="auto">
                    {row.unitInfo.length > 15
                      ? row.unitInfo.substring(0, 12) + "..."
                      : row.unitInfo}
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
                <Link
                  _hover={{
                    color: "orange",
                  }}
                  color="blue.600"
                >
                  <Tooltip label="ویرایش">
                    <Icon w={6} h={6} as={FilePenLine} />
                  </Tooltip>
                </Link>
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
