import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import { FilePenLine, Ruler, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { EditUnit } from "./EditUnit";
import { DeleteUnit } from "./DeleteUnit";
import { MyAlert } from "../MyAlert";
import { MyModal } from "../MyModal";
import { RemoveUnit } from "../../api/services/unitsService";

export const UnitsDataTable = ({ HeadLables, DataRows }) => {
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitsData, setUnitsData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const updateUnitInList = (updatedUnit) => {
    setUnitsData((prev) =>
      prev.map((u) => (u.id == updatedUnit.id ? updatedUnit : u))
    );
  };

  const deleteUnitFromList = (id) => {
    setUnitsData((prev) => prev.filter((u) => u.id != id));
  };

  const findUnitFromList = (id) => {
    unitsData.map((u) => (u.id === id ? u : null));
  };

  const handleDeleteUnit = () => {
    if (selectedID === 0) return;
    setLoading(true);
    RemoveUnit(selectedID)
      .then((res) => {
        deleteUnitFromList(selectedID);
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

  const handleEditUnit = () => {
    if (selectedID === 0) return;
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
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "ویرایش واحد",
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
                      title: "حذف واحد",
                      text: "آیا واقعا می خواهید این واحد را حذف کنید؟",
                      callBack: handleDeleteUnit,
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
      <MyModal
        modalHeader={dialogGears.title}
        isOpen={isOpen}
        onClose={onClose}
      >
        <EditUnit
          id={selectedID}
          onClose={onClose}
          onUpdate={updateUnitInList}
          Unit={findUnitFromList(selectedID)}
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
