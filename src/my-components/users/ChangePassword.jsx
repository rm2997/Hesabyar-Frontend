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
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Info, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { ChangePass } from "../../api/services/userService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { GetAllUsers } from "../../api/services/userService";

export const ChangePassword = ({ isDesktop }) => {
  const [formData, setFormData] = useState({
    id: 0,
    current: "",
    new: "",
    confirm: "",
  });
  const [users, setUsers] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      GetAllUsers()
        .then((res) => {
          setUsers(res.data);
          console.log(res.data);
        })
        .catch((err) => {})
        .finally(setLoading(false));
    };
    loadData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    ChangePass(formData.id, formData)
      .then((res) => {
        if (!res.data) return;
        setFormData({
          id: 0,
          current: "",
          new: "",
          confirm: "",
        });
        toast({
          title: "ثبت شد",
          description: `اطلاعات ذخیره شد`,
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
    <Card m={10}>
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
          spacing={5}
          onSubmit={handleSubmit}
        >
          <FormControl isRequired>
            <HStack>
              <FormLabel hidden={!isDesktop} width="150px">
                کاربر
              </FormLabel>
              <Select
                dir="ltr"
                placeholder="انتخاب کنید"
                maxW="400px"
                name="user.id"
                value={formData?.user?.id}
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
          <FormControl as={Flex}>
            <HStack>
              <FormLabel hidden={!isDesktop} width="170px">
                کلمه عبور فعلی
              </FormLabel>
              <MyInputBox
                type="password"
                icon={Info}
                name="current"
                title="کلمه عبور فعلی"
                size={30}
                value={formData.current}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
          <FormControl isRequired as={Flex}>
            <HStack>
              <FormLabel hidden={!isDesktop} width="170px">
                کلمه عبور جدید
              </FormLabel>
              <MyInputBox
                type="password"
                icon={Info}
                name="new"
                title="کلمه عبور جدید"
                size={30}
                value={formData.new}
                onChange={handleChangeFormData}
              ></MyInputBox>
            </HStack>
          </FormControl>
          <FormControl isRequired as={Flex}>
            <HStack>
              <FormLabel hidden={!isDesktop} width="170px">
                تکرار کلمه عبور
              </FormLabel>
              <MyInputBox
                icon={Info}
                type="password"
                name="confirm"
                title="تکرار کلمه عبور"
                size={30}
                value={formData.confirm}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>

          <Button
            leftIcon={<SquareCheckBig />}
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
  );
};
