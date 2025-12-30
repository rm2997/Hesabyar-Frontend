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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
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
  UserRound,
} from "lucide-react";
import { GrUserWorker } from "react-icons/gr";
import { FaUserTie } from "react-icons/fa6";
import { TbUserDollar } from "react-icons/tb";
import { LiaUserTagSolid } from "react-icons/lia";

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
import { GetSepidarUsers } from "../../api/services/sepidarService";

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
  const [sepidarUsers, setSepidarUsers] = useState([]);

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

  useEffect(() => {
    const loadSepidarUsers = async () => {
      setLoading(true);
      const response = await GetSepidarUsers();
      if (!response.success) {
        console.log(response.error);
        setLoading(false);
        return;
      }
      setSepidarUsers(response?.data);
      setLoading(false);
    };

    loadSepidarUsers();
  }, []);

  const handleShowSepidarUser = (id) => {
    const user = sepidarUsers.find((u) => u.UserID == id);
    if (!user) return "نامشخص";
    return user?.Name;
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

  const handleResetSearch = async (reset = true) => {
    if (!reset) return;
    setSearch("");
    await loadData(true);
  };

  const handleSetUserRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <ShieldUser size="28px" color="#608F60" />;
      case "user":
        return <User size="28px" color="#608F60" />;
      case "warehouseman":
        return <GrUserWorker size="28px" color="#608F60" />;
      case "salesperson":
        return <LiaUserTagSolid size="28px" color="#608F60" />;
      case "accountant":
        return <TbUserDollar size="28px" color="#608F60" />;
    }
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
        {!isDesktop && (
          <Box flex="1" overflowY="auto" p={1}>
            <Flex direction="column" gap={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {usersData.map((row) => (
                  <Card
                    borderTopRadius={5}
                    borderWidth={1}
                    _hover={{ borderColor: "orange" }}
                  >
                    <CardHeader
                      maxH="60px"
                      p={2}
                      bg="#CCA681"
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
                        <UserRound size="25px" color="yellow" strokeWidth={2} />
                        <Text mr="auto">{row.username}</Text>
                      </HStack>
                    </CardHeader>
                    <CardBody px={2} py={2}>
                      <VStack align={"stretch"} spacing={1}>
                        <HStack>
                          <Text>نام :</Text>
                          <Text fontFamily={"iransans"} mr="auto">
                            {row.userfname}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>نام خانوادگی:</Text>
                          <Text fontFamily={"iransans"} mr="auto">
                            {row.userlname}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>موبایل :</Text>
                          <Text fontFamily={"iransans"} mr="auto">
                            {row.usermobilenumber}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>نقش :</Text>
                          <Text mr="auto">
                            <Tooltip label={row.role}>
                              {handleSetUserRoleIcon(row.role)}
                            </Tooltip>
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>تاریخ آخرین ورود :</Text>
                          <Text
                            fontFamily={"iransans"}
                            color="orange.300"
                            dir="ltr"
                            mr="auto"
                          >
                            {!row?.lastLogin
                              ? "ندارد"
                              : dayjs(row.lastLogin)
                                  .locale("fa")
                                  .format("YYYY/MM/DD")}
                          </Text>
                        </HStack>
                        <Divider />
                        <HStack>
                          <Text>ساعت آخرین ورود :</Text>
                          <Text
                            fontFamily={"iransans"}
                            color="orange.300"
                            dir="ltr"
                            mr="auto"
                          >
                            {!row?.lastLogin
                              ? "ندارد"
                              : dayjs(row.lastLogin)
                                  .locale("fa")
                                  .format("HH:mm:ss")}
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
                    <Divider />
                    <CardFooter p={2} borderBottomRadius={5} bg="#F3F3F3">
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
            </Flex>
          </Box>
        )}
        {isDesktop && (
          <Box
            borderWidth={"1px"}
            borderColor={"black"}
            borderRadius={"md"}
            bg={"#FEFEFE"}
          >
            <TableContainer>
              <Table variant={"simple"}>
                <TableCaption fontFamily={"IranSans"}>
                  لیست کاربران
                </TableCaption>
                <Thead bg={"gray.100"}>
                  <Tr>
                    <Td>نقش</Td>
                    <Td>نام کاربری</Td>
                    <Td>نام </Td>
                    <Td>نام خانوادگی</Td>
                    <Td>موبایل</Td>
                    <Td>تاریخ ورود</Td>
                    <Td>ساعت ورود</Td>
                    <Td>موقعیت مکانی</Td>
                    <Td>کاربر سپیدار</Td>
                    <Td></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {usersData.map((row) => (
                    <Tr
                      _hover={{
                        boxShadow: "md",
                        borderWidth: "1px",
                        borderRadius: "md",
                      }}
                    >
                      <Td
                        _hover={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          setSelectedID(row.id);
                          setDialogGears({
                            title: "ویرایش کاربر",
                          });
                          onOpen();
                        }}
                      >
                        <Tooltip label={row.role}>
                          {handleSetUserRoleIcon(row.role)}
                        </Tooltip>
                      </Td>
                      <Td fontFamily={"IranSans"}>{row.username}</Td>
                      <Td fontFamily={"IranSans"}>{row.userfname}</Td>
                      <Td fontFamily={"IranSans"}>{row.userlname}</Td>
                      <Td fontFamily={"IranSans"}>{row.usermobilenumber}</Td>
                      <Td fontFamily={"IranSans"}>
                        {!row?.lastLogin
                          ? "ندارد"
                          : dayjs(row.lastLogin)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                      </Td>
                      <Td fontFamily={"IranSans"}>
                        {!row?.lastLogin
                          ? "ندارد"
                          : dayjs(row.lastLogin)
                              .locale("fa")
                              .format("HH:mm:ss")}
                      </Td>
                      <Td>
                        <Link
                          color="blue.300"
                          href={row.userLocation}
                          isExternal
                        >
                          <Tooltip label={"نمایش موقعیت"}>
                            {row.userLocation == "Denied" ? (
                              <Ban color="red" />
                            ) : (
                              <Map />
                            )}
                          </Tooltip>
                        </Link>
                      </Td>
                      <Td>{handleShowSepidarUser(row?.sepidarId)}</Td>

                      <Td>
                        <HStack
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
                                callBack: () =>
                                  handleSendLocationRequest(row.id),
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
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
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
