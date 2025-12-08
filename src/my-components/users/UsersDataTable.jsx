import {
  Box,
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
import {
  Ban,
  FilePenLine,
  Map,
  MapPin,
  MapPinCheck,
  ShieldUser,
  Trash2,
  User,
  UsersRound,
} from "lucide-react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { useEffect, useState } from "react";
import { EditUser } from "./EditUser";

import { MyAlert } from "../MyAlert";
import { MyModal } from "../MyModal";
import { GetAllUsers, RemoveUser } from "../../api/services/userService";
import { SendLocationSms } from "../../api/services/userService";
import { Pagination } from "../Pagination";
import { SearchBar } from "../SerachBar";
import { MyLoading } from "../MyLoading";

export const UsersDataTable = ({ isDesktop }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [selectedID, setSelectedID] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  dayjs.extend(jalali);

  const loadData = async (resetPage = false) => {
    setLoading(true);
    const res = await GetAllUsers(
      resetPage ? 1 : currentPage,
      itemsPerPage,
      resetPage ? "" : search
    );

    if (!res.success) {
      toast({
        title: "خطا در دریافت داده‌ها",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setTotalPages(Math.ceil(res?.data?.total / itemsPerPage));
    setUsersData(res?.data?.items);
    setLoading(false);
  };

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

  const handleSendLocationRequest = async (id) => {
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

    setLoading(true);
    const user = findUserFromList(id);

    if (!user) return;
    await SendLocationSms(
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

  const handleDeleteUser = async (id) => {
    if (id === 0) return;
    setLoading(true);
    try {
      const res = await RemoveUser(id);
      if (!res.success) {
        toast({
          title: "خطا",
          description: `${res.error}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      deleteUserFromList(id);
      toast({
        title: "توجه",
        description: `کاربر حذف شد`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "خطایی رخ داد",
        description: `${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleResetSearch = async () => {
    setSearch("");
    await loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  // if (loading)
  //   return (
  //     <AbsoluteCenter>
  //       <Spinner size="xl" colorScheme="red" />
  //     </AbsoluteCenter>
  //   );

  return (
    <Box>
      <Flex
        direction="column"
        filter={loading ? "blur(10px)" : ""}
        minH={isDesktop ? "73vh" : "73vh"}
        overflowY="auto"
      >
        <SearchBar
          isDesktop={isDesktop}
          search={search}
          setSearch={setSearch}
          handleResetSearch={handleResetSearch}
          loadData={loadData}
          userInfo="جستجوی کاربر"
        />
        <Box flex="1" overflowY="auto" p={1}>
          <Flex direction="column" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={3}>
              {usersData.map((row) => (
                <Card
                  borderTopRadius={5}
                  borderWidth={1}
                  _hover={{ borderColor: "orange" }}
                >
                  <CardHeader
                    p={2}
                    bg="green.500"
                    borderTopRadius={5}
                    color="white"
                    _hover={{ cursor: "pointer" }}
                    onClick={(e) => {
                      setSelectedID(row.id);
                      setDialogGears({
                        title: "ویرایش کاربر",
                      });
                      onOpen();
                    }}
                  >
                    <HStack>
                      <UsersRound size="25px" color="#F6AB49" strokeWidth={2} />
                      <Text mr="auto">{row.username}</Text>
                    </HStack>
                  </CardHeader>
                  <CardBody p={2}>
                    <VStack align={"stretch"} spacing={1}>
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
                        <Text mr="auto">
                          <Tooltip label={row.role}>
                            {row.role == "admin" ? (
                              <ShieldUser size="30px" color="green" />
                            ) : (
                              <User size="30px" color="#97D540" />
                            )}
                          </Tooltip>
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
                          <Tooltip label={row.userLocation}>
                            {row.userLocation == "Denied" ? (
                              <Ban color="red" />
                            ) : (
                              <HStack>
                                <Map /> <MapPin color="tomato" />
                              </HStack>
                            )}
                          </Tooltip>
                        </Link>
                      </HStack>
                    </VStack>
                  </CardBody>
                  <CardFooter p={2} borderBottomRadius={5} bg="gray.200">
                    <Stack
                      direction={["row"]}
                      spacing={2}
                      align={"stretch"}
                      mr="auto"
                    >
                      <Link
                        _hover={{ color: "#ffd54f" }}
                        color="green.600"
                        onClick={(e) => {
                          setSelectedID(row.id);
                          setDialogGears({
                            title: "ارسال درخواست موقعیت مکانی",
                            text: "کاربر موقعیت مکانی خود را ارسال کند؟",
                            callBack: () => handleSendLocationRequest(row.id),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Tooltip label="درخواست موقعیت مکانی">
                          <Icon w={6} h={6} as={MapPinCheck} />
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
                      <Link
                        _hover={{
                          color: "orange",
                        }}
                        color="blue.600"
                        onClick={(e) => {
                          setSelectedID(row?.id);
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
                selectedId={selectedID}
                onClose={onClose}
                onUpdate={updateUserInList}
                user={findUserFromList(selectedID)}
                isDesktop={isDesktop}
              />
            </MyModal>
            <MyAlert
              AlertHeader={dialogGears.title}
              AlertMessage={dialogGears.text}
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
            />
          </Flex>
        </Box>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Flex>
      {loading && <MyLoading />}
    </Box>
  );
};
