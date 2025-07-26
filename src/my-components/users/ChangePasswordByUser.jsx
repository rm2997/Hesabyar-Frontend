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
  Spinner,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Key, KeyRound, SquareCheckBig, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  ChangePass,
  CheckUserPassword,
  GetUserByUserid,
} from "../../api/services/userService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../../my-components/MyInputBox";
import { UserContext } from "../../contexts/UserContext";

export const ChangePasswordByUser = ({ isDesktop }) => {
  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const res = await GetUserByUserid(user?.sub);
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
        if (!res?.data) {
          setLoading(false);
          return;
        }
        setUserData(res?.data);
      } catch (error) {
        toast({
          title: "خطایی رخ داد",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const validateForm = async () => {
    if (!formData) {
      toast({
        title: "توجه",
        description: "اطلاعات فرم باید تکمیل گردد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (formData.new !== formData.confirm) {
      toast({
        title: "خطایی رخ داد",
        description: `کلمه عبور باید با تکرار آن برابر باشد`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{6,}$/;

    const isValidPassword = (password) => {
      return passwordRegex.test(password);
    };
    if (!isValidPassword(formData?.new)) {
      toast({
        title: "خطایی رخ داد",
        description: `کلمه عبور باید باید حداقل شش کاراکتر و شامل حروف کوچک و بزرگ و یک کاراکتر خاص باشد`,
        status: "warning",
        duration: 5000,
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
    const checkPass = await CheckUserPassword(userData.id, formData.current);
    if (!checkPass.success) {
      toast({
        title: "خطایی رخ داد",
        description: checkPass.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (checkPass?.data?.result == false) {
      toast({
        title: "خطا",
        description: "رمز فعلی صحیح نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (formData.new !== formData.confirm) {
      toast({
        title: "خطا",
        description: "تکرار رمز صحیح نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (formData.new == formData.current) {
      toast({
        title: "خطا",
        description: "رمز جدید با رمز قبلی یکی است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const res = await ChangePass(userData.id, formData);
      console.log(res);
      if (!res.data) {
        toast({
          title: "خطا",
          description: "اطلاعات ثبت نشد",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setFormData({
        id: 0,
        current: "",
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
        title: "خطا",
        description: `${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
      <Card m={1} filter={loading ? "blur(10px)" : ""}>
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
                <FormLabel hidden={!isDesktop} width="137px">
                  نام کاربری
                </FormLabel>
                <MyInputBox
                  icon={User}
                  isReadOnly
                  type="text"
                  name="username"
                  width="400px"
                  placeholder="نام کاربری"
                  value={userData.username}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired as={Flex}>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  کلمه عبور فعلی
                </FormLabel>
                <MyInputBox
                  type="password"
                  icon={Key}
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
                  icon={KeyRound}
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
      {loading && <MyLoading />}
    </Box>
  );
};
