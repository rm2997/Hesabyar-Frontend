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
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FilePenLine, Trash2, WalletCards } from "lucide-react";

import { useEffect, useState } from "react";
import { EditGood } from "./EditGood";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { RemoveGood } from "../../api/services/goodsService";

export const GoodsDataTable = ({ HeadLables, DataRows }) => {
  const [goodsData, setGoodsData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

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

  const handleDeleteGood = () => {
    if (selectedID === 0) return;
    RemoveGood(selectedID)
      .then((res) => {
        setLoading(true);
        deleteGoodFromList(selectedID);
        toast({
          title: "توجه",
          description: ` ,واحد حذف شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(setLoading(false));
  };

  const handleEditGood = (id) => {
    if (selectedID === 0) return;
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
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "ویرایش کالا",
                      text: "",
                      callBack: null,
                    });
                    onOpen();
                  }}
                >
                  <Tooltip label="ویرایش">
                    <Icon w={6} h={6} as={FilePenLine} />
                  </Tooltip>
                </Link>
                <Link
                  _hover={{ color: "#ffd54f" }}
                  color="red.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "حذف کالا",
                      text: "آیا واقعا می خواهید این کالا را حذف کنید؟",
                      callBack: handleDeleteGood,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="حذف">
                    <Icon w={6} h={6} as={Trash2} />
                  </Tooltip>
                </Link>
              </Stack>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      <MyModal modalHeader="مشاهده پیام" isOpen={isOpen} onClose={onClose}>
        <EditGood
          id={selectedID}
          onClose={onClose}
          onUpdate={updateGoodInList}
          Good={findGoodFromList(selectedID)}
        />
      </MyModal>
      <MyAlert
        AlertHeader={dialogGears.title}
        AlertMessage={dialogGears.text}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
    </Flex>
  );
};
