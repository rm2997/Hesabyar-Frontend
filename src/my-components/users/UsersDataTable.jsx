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
import { FilePenLine, MapPin, Trash2, User2 } from "lucide-react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { useEffect, useState } from "react";
import { EditUser } from "./EditUser";

import { MyAlert } from "../MyAlert";
import { MyModal } from "../MyModal";
import { RemoveUser } from "../../api/services/userService";
import { SendLocationSms } from "../../api/services/userService";

export const UsersDataTable = ({ DataRows }) => {
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  dayjs.extend(jalali);

  useEffect(() => {
    setUsersData(DataRows);
  }, [DataRows]);

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const updateUserInList = (updatedUser) => {
    setUsersData((prev) =>
      prev.map((u) => (u.id == updatedUser.id ? updatedUser : u))
    );
  };

  const deleteUserFromList = (id) => {
    setUsersData((prev) => prev.filter((u) => u.id != id));
  };

  const findUserFromList = (id) => {
    const user = usersData.find((u) => u.id == id);
    return user;
  };

  const handleSendLocationRequest = (id) => {
    if (!id || id == 0) {
      toast({
        title: "خطا",
        description: "کاربر انتخاب نشده است" + " " + id,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const user = findUserFromList(id);

    if (!user) return;
    SendLocationSms(
      user.usermobilenumber,
      user.userfname + " " + user.userlname
    )
      .then((res) => {
        console.log("response:", res);
        toast({
          title: "توجه",
          description: "درخواست موقعیت مکانی به شماره کاربر ارسال گردید",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطا",
          description: `خطایی به شرح زیر رخ داد ${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(setLoading(false));
  };

  const handleDeleteUser = (id) => {
    if (id === 0) return;
    setLoading(true);
    RemoveUser(selectedID)
      .then((res) => {
        deleteUserFromList(selectedID);
        toast({
          title: "توجه",
          description: `کاربر حذف شد`,
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

  const handleEditUser = () => {
    if (selectedID === 0) return;
  };

  useEffect(() => {
    setUsersData([...DataRows]);
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
                <User2 color="purple" />
                <Text mr="auto">{row.username}</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align={"stretch"} spacing={2}>
                <HStack>
                  <Text>نام :</Text>
                  <Text mr="auto">{row.userfname}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>نام خانوادگی:</Text>
                  <Text mr="auto">{row.userlname}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>موبایل :</Text>
                  <Text mr="auto">{row.usermobilenumber}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>نقش :</Text>
                  <Text color="green.300" mr="auto">
                    {row.role}
                  </Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>آخرین ورود :</Text>
                  <Text color="orange.300" dir="ltr" mr="auto">
                    {!row?.lastLogin
                      ? "ندارد"
                      : dayjs(row.lastLogin)
                          .locale("fa")
                          .format("YYYY/MM/DD HH:mm:ss")}
                  </Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>آخرین لوکیشن :</Text>
                  <Link
                    dir="ltr"
                    mr="auto"
                    color="blue.300"
                    href={row.userLocation}
                    isExternal
                  >
                    {!row?.userLocation
                      ? "ندارد"
                      : row.userLocation?.length > 19
                      ? row.userLocation?.substring(0, 19) + "..."
                      : row.userLocation}
                  </Link>
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
                      title: "ویرایش کاربر",
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
                  color="green.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "ارسال درخواست موقعیت مکانی",
                      text: "آیا واقعا می خواهید این کاربر موقعیت مکانی خود را ارسال کند؟",
                      callBack: () => handleSendLocationRequest(row.id),
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="درخواست موقعیت مکانی">
                    <Icon w={6} h={6} as={MapPin} />
                  </Tooltip>
                </Link>
                <Link
                  _hover={{ color: "#ffd54f" }}
                  color="red.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "حذف کاربر",
                      text: "آیا واقعا می خواهید این کاربر را حذف کنید؟",
                      callBack: () => handleDeleteUser(row.id),
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
        <EditUser
          onClose={onClose}
          onUpdate={updateUserInList}
          user={findUserFromList(selectedID)}
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
