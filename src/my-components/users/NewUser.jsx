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
  SimpleGrid,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { IdCard, KeyRound, Smartphone, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../MyLoading";
import { CreateUser, GetAllUsers } from "../../api/services/userService";
import { UserRoles } from "../../api/services/enums/roles.enum";

export const NewUser = ({ isDesktop }) => {
  const [formData, setFormData] = useState({
    id: 0,
    role: "",
    username: "",
    userfname: "",
    userlname: "",
    usermobilenumber: "",
    twoFactorAuthntication: false,
    password: "",
    confirm: "",
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    const loadUsersData = async () => {
      const usersData = await GetAllUsers();
      if (!usersData.success) {
        console.log(usersData.error);
        setLoading(false);
        return;
      }
      setUsers(usersData?.data?.items);
      setLoading(false);
    };

    loadUsersData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      toast({
        title: "خطایی رخ داد",
        description: `کلمه عبور باید با تکرار آن برابر باشد`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const res = await CreateUser(formData);
    if (!res.success) {
      toast({
        title: "خطایی رخ داد",
        description: `${res.error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setFormData({
      role: "",
      username: "",
      userfname: "",
      userlname: "",
      usermobilenumber: "",
      twoFactorAuthntication: false,
      password: "",
      confirm: "",
    });
    toast({
      title: "ثبت شد",
      description: `اطلاعات کاربر ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Card filter={loading ? "blur(10px)" : ""}>
        <CardHeader
          bg="#68C15A"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          color="black"
        >
          کاربر جدید
        </CardHeader>
        <CardBody borderTopWidth={2}>
          <Flex direction="column" gap={7} as="form" onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2 }}
              rowGap={5}
              columnGap={5}
            >
              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="170px">
                    نام کاربری
                  </FormLabel>
                  <MyInputBox
                    icon={User}
                    name="username"
                    title="نام کاربری"
                    size={30}
                    value={formData.username}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="165px">
                    نقش کاربری
                  </FormLabel>
                  <Select
                    placeholder="یک نقش انتخاب کنید"
                    dir="ltr"
                    value={formData.role}
                    name="role"
                    maxW="620px"
                    onChange={handleChangeFormData}
                  >
                    {UserRoles.map((r) => (
                      <option key={r.key} value={r.value}>
                        {r.value}
                      </option>
                    ))}
                  </Select>
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="170px">
                    نام
                  </FormLabel>
                  <MyInputBox
                    icon={IdCard}
                    name="userfname"
                    title="نام"
                    size={30}
                    value={formData.userfname}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="170px">
                    نام خانوادگی
                  </FormLabel>
                  <MyInputBox
                    icon={IdCard}
                    name="userlname"
                    title="نام خانوادگی"
                    size={30}
                    value={formData.userlname}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="170px">
                    شماره موبایل
                  </FormLabel>
                  <MyInputBox
                    icon={Smartphone}
                    name="usermobilenumber"
                    title="شماره موبایل"
                    size={30}
                    value={formData.usermobilenumber}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="170px">
                    کلمه عبور
                  </FormLabel>
                  <MyInputBox
                    type="password"
                    icon={KeyRound}
                    name="password"
                    title="کلمه عبور"
                    size={30}
                    value={formData.password}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="170px">
                    تکرار کلمه عبور
                  </FormLabel>
                  <MyInputBox
                    icon={KeyRound}
                    type="password"
                    name="confirm"
                    title="تکرار کلمه عبور"
                    size={30}
                    value={formData.confirm}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <HStack>
                  <FormLabel htmlFor="twoFactorAuthntication" width="140px">
                    ورود دو مرحله ای
                  </FormLabel>
                  <Switch
                    ml="auto"
                    id="twoFactorAuthntication"
                    value={formData.twoFactorAuthntication}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>
            </SimpleGrid>
            <Button
              leftIcon={<UserPlus />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              تایید
            </Button>
          </Flex>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
