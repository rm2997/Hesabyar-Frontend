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
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { Info, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ChangePass,
  ChangePassFromOut,
  GetUserByToken,
} from "../../api/services/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { GetAllUsers } from "../../api/services/userService";

export const ChangeUserPassword = () => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [formData, setFormData] = useState({
    new: "",
    confirm: "",
    token: "",
  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [user, setUser] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      if (!token || token.length < 10) {
        toast({
          title: "خطا",
          description: "توکن شما در سیستم وجود ندارد",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
        setTimeout(() => {
          navigate("/NotFound");
          setLoading(false);
          return;
        }, 3000);
      }
      setLoading(true);
      try {
        await GetUserByToken(token)
          .then((res) => {
            setUser(res.data);
            setFormData({ ...formData, token: token });
          })
          .catch((err) => {
            toast({
              title: "خطا",
              description: err.message,
              status: "error",
              duration: 3000,
              isClosable: false,
            });

            setTimeout(() => {
              navigate("/NotFound");
              setLoading(false);
              return;
            }, 3000);
          });
        setLoading(false);
      } catch (error) {
        toast({
          title: "خطا",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: false,
        });

        setTimeout(() => {
          navigate("/NotFound");
          setLoading(false);
          return;
        }, 3000);
      }
    };

    loadUserData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await ChangePassFromOut(formData)
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
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) =>
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );
    setLoading(false);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card dir="rtl" m={10}>
      <CardHeader
        bg="#68C15A"
        borderBottomColor="gray.400"
        borderBottomWidth="1px"
        borderTopRadius={5}
        color="black"
      >
        تغییر کلمه عبور
        {user.userfname} {user.userlname}
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
              <FormLabel hidden={!isDesktop} width="125px">
                کاربر
              </FormLabel>
              <Text>{user.username}</Text>
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
