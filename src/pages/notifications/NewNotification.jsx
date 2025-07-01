import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Spinner,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateNotification } from "../../api/services/notificationService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { GetAllUsers } from "../../api/services/userService";
import { useNotification } from "../../contexts/NotificationContext";

export const NewNotification = ({ isDesktop }) => {
  const [formData, setFormData] = useState({
    id: 0,
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
      setUsersData(res?.data?.items);
      setLoading(false);
    };
    fetchUsersData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await CreateNotification(formData)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          loadUnreadeNotif();
          setFormData({
            id: "",
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
        }
      })
      .catch((err) => {
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(setLoading(false));
  };

  const handleChangeUser = (id) => {
    if (id == 0 || id == "") {
      setFormData({ ...formData, toUser: {} });
      return;
    }
    const user = usersData.find((u) => (u.id = id));
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
    <Card m={10} filter={loading ? "blur(10px)" : ""}>
      <CardHeader
        bg="#68C15A"
        borderBottomColor="gray.400"
        borderBottomWidth="1px"
        borderTopRadius={5}
        color="black"
      >
        ثبت پیام جدید
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
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
                    htmlSize={19}
                    name="toUser"
                    placeholder="لطفا یکی از کاربران را انتخاب کنید"
                    value={formData.toUser.id}
                    onChange={(e) => handleChangeUser(e.target.value)}
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
  );
};
