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
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { IdCard, Info, Phone, Ruler, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import {
  CreateUser,
  GetAllUsers,
  UpdateUser,
} from "../../api/services/userService";
import { UserRoles } from "../../api/services/enums/roles.enum";

export const EditUser = ({ isDesktop, user, onClose }) => {
  const [formData, setFormData] = useState({
    id: 0,
    role: "",
    username: "",
    userfname: "",
    userlname: "",
    usermobilenumber: "",
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadUsersData = () => {
      setLoading(true);
      GetAllUsers()
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {})
        .finally(setLoading(false));
    };

    loadUsersData();
  }, []);

  useEffect(() => {
    console.log("user:", user);
    setFormData({ ...user });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    UpdateUser(formData.id, formData)
      .then((res) => {
        setFormData({
          id: 0,
          role: "",
          username: "",
          userfname: "",
          userlname: "",
          usermobilenumber: "",
        });
        toast({
          title: "ثبت شد",
          description: `اطلاعات کاربر ذخیره شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
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
    else setFormData({ ...formData, user: user });
  };

  const handleChangeFormData = (e) => {
    console.log(e.target.name, e.target.value);
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
        ویرایش کاربر
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
            spacing={4}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  نام کاربری
                </FormLabel>
                <MyInputBox
                  icon={IdCard}
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
                <FormLabel hidden={!isDesktop} width="135px">
                  نقش کاربری
                </FormLabel>
                <Select
                  placeholder="یک نقش انتخاب کنید"
                  dir="ltr"
                  value={formData.role}
                  name="role"
                  width="402px"
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
                  icon={Phone}
                  name="usermobilenumber"
                  title="شماره موبایل"
                  size={30}
                  value={formData.usermobilenumber}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
          </SimpleGrid>
          <Button
            leftIcon={<SquareCheckBig />}
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
  );
};
