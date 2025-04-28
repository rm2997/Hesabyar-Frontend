import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard, UserIcon, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateNotification } from "../api/services/notificationService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../my-components/MyInputBox";
import { GetAllUsers } from "../api/services/userService";

export const NewNotification = () => {
  const [formData, setFormData] = useState({});
  const [usersData, setUsersData] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      const response = await GetAllUsers();
      const result = response.data;
      setUsersData(result);
      setLoading(false);
    };
    fetchUsersData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await CreateNotification(formData)
      .then((result) => {
        setFormData({
          id: "",
          title: "",
          message: "",
          touser: "",
        });
        toast({
          title: "ثبت شد",
          description: `اطلاعات پیام شما ذخیره شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card m={10}>
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
        <VStack as="form" spacing={5} onSubmit={handleSubmit}>
          <FormControl isDisabled>
            <HStack>
              <FormLabel width="90px">ردیف</FormLabel>
              <MyInputBox icon={Hash} title="ردیف" name="id" />
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <HStack>
              <FormLabel width="90px">عنوان</FormLabel>
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
              <FormLabel width="90px">محتوا</FormLabel>
              <MyInputBox
                icon={DollarSign}
                name="message"
                title="محتوا"
                value={formData.message}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <HStack textAlign={"right"}>
              <FormLabel width="90px">گیرنده</FormLabel>
              {loading ? (
                <Spinner />
              ) : (
                <InputGroup>
                  <InputRightElement
                    pointerEvents="none"
                    borderColor="gray.200"
                    borderWidth={1}
                    borderRadius={5}
                    borderLeftRadius={0}
                  >
                    <Icon pointerEvents="none" color="gray.500">
                      <UserSearch />
                    </Icon>
                  </InputRightElement>
                  <Select
                    dir="rtl"
                    borderRightWidth={0}
                    borderRightRadius={0}
                    pr="2.5rem"
                    width="auto"
                    htmlSize={19}
                    name="touser"
                    placeholder="لطفا یکی از کاربران را انتخاب کنید"
                    value={formData.touser}
                    onChange={handleChangeFormData}
                  >
                    {usersData.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.userfname + " " + user.userlname}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
              )}
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <HStack>
              <FormLabel width="90px">گیرنده</FormLabel>
              <MyInputBox
                icon={DollarSign}
                name="touser"
                title="گیرنده"
                value={formData.touser}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>

          <Button colorScheme="blue" type="submit" isLoading={loading}>
            تایید
          </Button>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
