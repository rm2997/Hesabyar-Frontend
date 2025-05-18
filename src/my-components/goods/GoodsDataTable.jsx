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
  Send,
  Trash2,
  User2,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { MyModalContainer } from "../MyModalContainer";
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
      prev.map((g) => (g.id === updatedGood.id ? updatedGood : g))
    );
  };

  const deleteGoodFromList = (id) => {
    setGoodsData((prev) => prev.filter((g) => g.id !== id));
  };

  const findGoodFromList = (id) => {
    goodsData.map((g) => (g.id === id ? g : null));
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
                <WalletCards color="purple" />
                <Text mr="auto">{row.goodName}</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align={"stretch"} spacing={2}>
                <HStack>
                  <Text> واحد :</Text>
                  <Text mr="auto">{row.goodUnit?.unitName}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text> قیمت کالا :</Text>
                  <Text mr="auto">{row.goodPrice}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>توضیحات :</Text>
                  <Text mr="auto">
                    {row.goodInfo.length > 15
                      ? row.goodInfo.substring(0, 12) + "..."
                      : row.goodInfo}
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
