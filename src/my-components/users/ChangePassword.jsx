import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Spinner,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { KeyRound, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { ChangePass } from "../../api/services/userService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../../my-components/MyInputBox";
import { GetAllUsers } from "../../api/services/userService";

export const ChangePassword = ({ isDesktop, user }) => {
  const [formData, setFormData] = useState({
    id: 0,
    new: "",
    confirm: "",
  });
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const usersData = await GetAllUsers();
      if (!usersData.success) {
        console.log(usersData.error);
        setLoading(false);
        return;
      }
      setUsers(usersData?.data?.items);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await ChangePass(formData.id, formData);
      if (!res.data) {
        toast({
          title: "خطا",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setFormData({
        id: 0,
        new: "",
        confirm: "",
      });
      toast({
        title: "ثبت شد",
        description: "کلمه عبور تغییر کرد",
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

  const handleChangeUser = (id) => {
    if (id === 0 || id === "") setFormData({ ...formData, user: {} });
    const user = users.find((u) => u.id == id);

    if (!user || id === 0 || id === "") setFormData({ ...formData, user: {} });
    else setFormData({ ...formData, id: id });
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Card
        filter={loading ? "blur(10px)" : ""}
        minH={isDesktop ? "72vh" : "66vh"}
        overflowY="auto"
        m={1}
      >
        <CardHeader
          bg="#68C15A"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          color="black"
        >
          تغییر کلمه عبور
        </CardHeader>
        <CardBody borderTopWidth={2}>
          <VStack
            align={"stretch"}
            direction={["column", "row"]}
            as="form"
            spacing={8}
            onSubmit={handleSubmit}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} w="20%">
                  کاربر
                </FormLabel>
                <Select
                  disabled={!user?.role == "admin"}
                  dir="ltr"
                  placeholder="یک کاربر انتخاب کنید"
                  name="id"
                  value={formData.id}
                  onChange={(e) => handleChangeUser(e.target.value)}
                >
                  {users.map((item) => (
                    <option key={"user" + item.id} value={item.id}>
                      {item.username}
                    </option>
                  ))}
                </Select>
              </HStack>
            </FormControl>

            <FormControl isRequired as={Flex}>
              <HStack w="full">
                <FormLabel hidden={!isDesktop} w="20%">
                  رمز جدید
                </FormLabel>
                <MyInputBox
                  type="password"
                  icon={KeyRound}
                  name="new"
                  title="رمز جدید"
                  value={formData.new}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired as={Flex}>
              <HStack w="full">
                <FormLabel hidden={!isDesktop} w="20%">
                  تکرار رمز
                </FormLabel>
                <MyInputBox
                  icon={KeyRound}
                  type="password"
                  name="confirm"
                  title="تکرار رمز"
                  value={formData.confirm}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>

            <Button
              leftIcon={<UserPen />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              تایید
            </Button>
          </VStack>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
