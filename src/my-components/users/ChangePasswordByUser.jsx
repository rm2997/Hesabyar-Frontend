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

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{6,}$/;

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
      <Card
        m={1}
        filter={loading ? "blur(10px)" : ""}
        h={isDesktop ? "65vh" : "75vh"}
        overflowY="auto"
      >
        <CardHeader
          hidden={!isDesktop}
          p={2}
          bg="#68C15A"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          color="black"
        >
          تغییر کلمه عبور
        </CardHeader>
        <CardBody
          borderTopRadius={isDesktop ? "" : "md"}
          p={isDesktop ? 20 : 2}
          borderTopWidth={2}
        >
          <VStack
            align={"stretch"}
            as="form"
            onSubmit={handleSubmit}
            rowGap={isDesktop ? 10 : 5}
          >
            <FormControl isRequired>
              <Flex
                gap="5px"
                alignItems="center"
                direction={{ base: "column", sm: "row" }}
              >
                <FormLabel
                  fontSize={isDesktop ? "15px" : "13px"}
                  w={isDesktop ? "10%" : "35%"}
                >
                  نام کاربری
                </FormLabel>
                <MyInputBox
                  isInvalid={formData?.username?.length == 0}
                  icon={User}
                  isReadOnly
                  type="text"
                  name="username"
                  placeholder="نام کاربری"
                  value={userData.username}
                />
              </Flex>
            </FormControl>
            <FormControl isRequired>
              <Flex
                gap="5px"
                alignItems="center"
                direction={{ base: "column", sm: "row" }}
              >
                <FormLabel
                  fontSize={isDesktop ? "15px" : "13px"}
                  w={isDesktop ? "10%" : "35%"}
                >
                  کلمه عبور فعلی
                </FormLabel>
                <MyInputBox
                  isInvalid={formData?.current?.length == 0}
                  type="password"
                  icon={Key}
                  name="current"
                  title="کلمه عبور فعلی"
                  value={formData.current}
                  onChange={handleChangeFormData}
                />
              </Flex>
            </FormControl>
            <FormControl isRequired>
              <Flex
                gap="5px"
                alignItems="center"
                direction={{ base: "column", sm: "row" }}
              >
                <FormLabel
                  fontSize={isDesktop ? "15px" : "13px"}
                  w={isDesktop ? "10%" : "35%"}
                >
                  کلمه عبور جدید
                </FormLabel>
                <MyInputBox
                  isInvalid={
                    formData?.new?.length < 6 ||
                    !passwordRegex.test(formData?.new)
                  }
                  type="password"
                  icon={KeyRound}
                  name="new"
                  title="کلمه عبور جدید"
                  value={formData.new}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </Flex>
            </FormControl>
            <FormControl isRequired>
              <Flex
                gap="5px"
                alignItems="center"
                direction={{ base: "column", sm: "row" }}
              >
                <FormLabel
                  fontSize={isDesktop ? "15px" : "13px"}
                  w={isDesktop ? "10%" : "35%"}
                >
                  تکرار کلمه عبور
                </FormLabel>
                <MyInputBox
                  isInvalid={formData?.confirm !== formData?.new}
                  icon={KeyRound}
                  type="password"
                  name="confirm"
                  title="تکرار کلمه عبور"
                  value={formData.confirm}
                  onChange={handleChangeFormData}
                />
              </Flex>
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
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
