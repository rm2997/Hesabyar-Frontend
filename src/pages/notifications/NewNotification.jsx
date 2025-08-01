import {
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
  InputGroup,
  Select,
  SimpleGrid,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { IdCard } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateNotification } from "../../api/services/notificationService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
import { GetAllUsers } from "../../api/services/userService";
import { useNotification } from "../../contexts/NotificationContext";

export const NewNotification = ({ isDesktop, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    toUser: {},
  });

  const [usersData, setUsersData] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadUnreadeNotif } = useNotification();
  const toast = useToast();

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      const res = await GetAllUsers();
      if (!res.success) {
        console.log(res.error);
        setLoading(false);
        return;
      }
      const tmpUsers = res?.data?.items?.filter((u) => u.id != user.sub);

      setUsersData(tmpUsers);
      setLoading(false);
    };
    fetchUsersData();
  }, []);

  const validateForm = async () => {
    if (!formData) {
      toast({
        title: "توجه",
        description: "اطلاعات پیام باید تکمیل گردد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (formData?.message?.trim().length < 4) {
      toast({
        title: "توجه",
        description: "لطفا محتوای پیام را مشخص فرمایید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.title?.trim()?.length < 2) {
      toast({
        title: "توجه",
        description: "لطفا عنوان پیام را مشخص فرمایید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData?.toUser || formData?.toUser == {}) {
      toast({
        title: "توجه",
        description: "لطفا گیرنده پیام را مشخص فرمایید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((await validateForm()) == false) return;
    setLoading(true);

    const res = await CreateNotification(formData);
    if (!res.success) {
      toast({
        title: "خطایی رخ داد",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    await loadUnreadeNotif();
    setFormData({
      title: "",
      message: "",
      toUser: {},
    });
    toast({
      title: "ثبت شد",
      description: `اطلاعات پیام شما ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLoading(false);
  };

  const handleChangeUser = (id) => {
    if (id == 0 || id == "") {
      setFormData({ ...formData, toUser: {} });
      return;
    }
    const user = usersData.find((u) => u.id == id);
    if (!user) return;
    setFormData({ ...formData, toUser: user });
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Card m={1} filter={loading ? "blur(10px)" : ""}>
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            ثبت پیام جدید
          </CardHeader>
        )}
        <CardBody>
          <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 1 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
              spacing={4}
            >
              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="90px">
                    عنوان
                  </FormLabel>
                  <MyInputBox
                    icon={IdCard}
                    name="title"
                    title="عنوان"
                    value={formData.title}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="90px">
                    گیرنده
                  </FormLabel>
                  <InputGroup>
                    <Select
                      dir="ltr"
                      name="toUser"
                      placeholder="لطفا یکی از کاربران را انتخاب کنید"
                      value={formData?.toUser}
                      onChange={handleChangeFormData}
                    >
                      {usersData.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.userfname + " " + user.userlname}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                  {loading && <Spinner />}
                </HStack>
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="85px">
                  محتوا
                </FormLabel>
                <Textarea
                  name="message"
                  placeholder="محتوا"
                  value={formData.message}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>

            <Button colorScheme="blue" type="submit" isLoading={loading}>
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
