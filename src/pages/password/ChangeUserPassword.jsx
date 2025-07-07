import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Link,
  Select,
  SimpleGrid,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import {
  Info,
  KeySquare,
  RotateCcwKey,
  SquareCheckBig,
  UserLock,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ChangePassFromOut,
  GetUserByToken,
} from "../../api/services/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";

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
      if (!token) {
        toast({
          title: "عدم دسترسی",
          description: "شما برای ورود به این بخش مجاز نیستید",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        return;
      }
      if (token.length < 10) {
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
      const user = await GetUserByToken(token);
      if (!user.success) {
        toast({
          title: "خطا",
          description: user.error,
          status: "error",
          duration: 3000,
          isClosable: false,
        });
        setTimeout(() => {
          navigate("/NotFound");
          setLoading(false);
        }, 3000);
        return;
      }
      setUser(user.data);
      setFormData({ ...formData, token: token });
      setLoading(false);
    };
    loadUserData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      toast({
        title: "عدم دسترسی",
        description: "شما برای ورود به این بخش مجاز نیستید",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }
    try {
      const res = await ChangePassFromOut(formData);
      if (!res.success) {
        toast({
          title: "خطایی رخ داد",
          description: `${res.error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
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
        }, 200);
      }
    } catch (error) {
      toast({
        title: "خطایی رخ داد",
        description: `${error.error}`,
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
  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/Home");
  };

  return (
    <Box
      p="10px"
      w="full"
      minH="100vh"
      bg="gray.700"
      alignItems="center"
      alignContent="center"
      bgSize="auto"
      bgRepeat="repeat-x"
      bgPosition="left"
      bgImage="url(/assets/images/bg/world.png)"
    >
      <Flex
        filter={loading ? "blur(10px)" : ""}
        bg="gray"
        textColor="white"
        mx="auto"
        borderWidh="2px"
        borderRadius="lg"
        w={isDesktop ? "600px" : "full"}
        maxW={{ sm: "400", lg: "600px" }}
        minH={isDesktop ? "600px" : "90vh"}
        direction="column"
        alignContent="center"
        alignItems="center"
        rowGap={isDesktop ? 2 : 0}
        dir="rtl"
        borderColor="white"
        boxShadow="1px 2px 15px 1px rgb(0, 0, 0)"
        p={isDesktop ? "10px" : "5px"}
      >
        <RotateCcwKey mt="15px" size={100} strokeWidth={1} />
        <Text color="white" fontSize="3xl">
          تغییر رمز عبور
        </Text>
        <Text
          fontFamily="Beiruti"
          size="xs"
          color="whiteAlpha.500"
          fontSize={isDesktop ? "md" : "sm"}
        >
          کاربر گرامی
          {" " + user.userfname + " " + user.userlname + " "}
          شما در حال تغییر رمز عبور خود می باشید
        </Text>
        <Flex
          as="form"
          direction="column"
          width="70%"
          rowGap={5}
          onSubmit={handleSubmit}
        >
          <Divider mb="10px" />
          <FormControl textColor="white" isRequired>
            <MyInputBox
              autoComplete="off"
              _placeholder={{ color: "whiteAlpha.700" }}
              _focus={{
                boxShadow: "teal 0px 2px 5px 1px",
                borderColor: "blackAlpha.400",
              }}
              pr={3}
              textColor="white"
              variant="outline"
              type="password"
              name="new"
              title="کلمه عبور جدید"
              size={30}
              value={formData.new}
              onChange={handleChangeFormData}
            />
          </FormControl>
          <FormControl textColor="white" isRequired>
            <MyInputBox
              autoComplete="off"
              _placeholder={{ color: "whiteAlpha.700" }}
              _focus={{
                boxShadow: "teal 0px 2px 5px 1px",
                borderColor: "blackAlpha.400",
              }}
              pr={3}
              textColor="white"
              variant="outline"
              type="password"
              name="confirm"
              title="تکرار کلمه عبور"
              size={30}
              value={formData.confirm}
              onChange={handleChangeFormData}
            />
          </FormControl>
          <Divider mt="5px" mb="10px" />
          <Button
            leftIcon={<KeySquare />}
            fontFamily="Yekan"
            size="lg"
            colorScheme="teal"
            variant="solid"
            type="submit"
            width="full"
            isLoading={loading}
          >
            تغییر رمز
          </Button>
          <Link
            fontFamily="Yekan"
            mx="auto"
            href="#"
            onClick={handleHomeClick}
            textColor="yellow.400"
          >
            خانه
          </Link>
        </Flex>
      </Flex>
    </Box>
    // <SimpleGrid
    //   filter={loading ? "blur(10px)" : ""}
    //   mr={isDesktop ? "auto" : "1"}
    //   ml={isDesktop ? "auto" : "1"}
    //   height="100vh"
    //   spacing={0}
    //   columns={{ base: 1, md: 2, lg: 2 }}
    //   p={5}
    //   width={isDesktop ? "50%" : "99%"}
    // >
    //   <Box
    //     bg="blackAlpha.200"
    //     bgImage="url(/assets/images/bg/changePassword.svg)"
    //     bgSize={isDesktop ? "fill" : "auto"}
    //     bgRepeat="no-repeat"
    //     bgPosition="left"
    //     hidden={!isDesktop}
    //     borderWidth={1}
    //     borderRightWidth={0}
    //     borderLeftRadius="lg"
    //     width="full"
    //   ></Box>
    //   <Box
    //     p={8}
    //     borderWidth={1}
    //     borderLeftWidth={isDesktop ? 0 : 1}
    //     borderRightRadius="lg"
    //     borderLeftRadius={isDesktop ? "" : "lg"}
    //     dir="rtl"
    //   >
    //     <VStack spacing={8} as="form" onSubmit={handleSubmit}>
    //       <RotateCcwKey size={100} color="#74CEF7" strokeWidth={1} />
    //       <Heading
    //         color="blackAlpha.800"
    //         fontFamily="Vaziri"
    //         hidden={!isDesktop}
    //         size="lg"
    //       >
    //         تغییر رمز عبور
    //       </Heading>
    //       <Text
    //         fontFamily="Vaziri"
    //         fontSize="sm"
    //         color="blackAlpha.500"
    //         textAlign="center"
    //       >
    //         کاربر گرامی
    //         {" " + user.userfname + " " + user.userlname + " "}
    //         شما در حال تغییر رمز عبور خود می باشید
    //       </Text>
    //       <Divider />
    //       <FormControl isRequired as={Flex}>
    //         <HStack>
    //           <FormLabel hidden={!isDesktop} width="170px">
    //             کلمه عبور جدید
    //           </FormLabel>
    //           <MyInputBox
    //             type="password"
    //             icon={Info}
    //             name="new"
    //             title="کلمه عبور جدید"
    //             size={30}
    //             value={formData.new}
    //             onChange={handleChangeFormData}
    //           ></MyInputBox>
    //         </HStack>
    //       </FormControl>
    //       <FormControl isRequired as={Flex}>
    //         <HStack>
    //           <FormLabel hidden={!isDesktop} width="170px">
    //             تکرار کلمه عبور
    //           </FormLabel>
    //           <MyInputBox
    //             icon={Info}
    //             type="password"
    //             name="confirm"
    //             title="تکرار کلمه عبور"
    //             size={30}
    //             value={formData.confirm}
    //             onChange={handleChangeFormData}
    //           />
    //         </HStack>
    //       </FormControl>
    //       <Divider />
    //       <Button
    //         leftIcon={<KeySquare />}
    //         type="submit"
    //         colorScheme="blue"
    //         isLoading={loading}
    //         width="full"
    //       >
    //         تغییر رمز
    //       </Button>
    //     </VStack>
    //   </Box>
    // </SimpleGrid>
  );
};
