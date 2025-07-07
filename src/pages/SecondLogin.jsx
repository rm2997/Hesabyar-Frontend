import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  HStack,
  Heading,
  PinInput,
  PinInputField,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, TimerReset, UserLock } from "lucide-react";
import { saveTokens } from "../api/tokenUtils";
import { sendValidationKeySms } from "../api/smsUtils";
import { UserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import {
  secondLogin,
  sendValidationKeyAgain,
} from "../api/services/authService";

export const SecondLogin = ({}) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });
  const { setUser } = useContext(UserContext);
  const toast = useToast();
  const [timeLeft, setTimeLeft] = useState(59);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [form, setForm] = useState({
    key: "",
  });
  const inputRef = useRef(null);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const mobile = searchParams.get("mobile");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !mobile) {
      navigate("/login");
      return;
    }
    // const newKey = generateRandomNumber();
    // setKey(newKey);
    // sendValidationKeySms(mobile, newKey);
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // const generateRandomNumber = () => {
  //   const rnd = Math.floor(10000 + Math.random() * 90000);
  //   return rnd;
  // };

  const handleChange = (e) => {
    setForm({ key: e });
    if (e.length >= 5) setIsFormDisabled(false);
    else setIsFormDisabled(true);
  };

  const handleClickTimerButton = async () => {
    if (timeLeft > 0) return;
    if (!token || !mobile) {
      navigate("/login");
      return;
    }
    const data = { token: token, mobile: mobile };
    await sendValidationKeyAgain(data);
    // const newKey = generateRandomNumber();
    // setKey(newKey);

    // sendValidationKeySms(mobile, newKey).catch((err) => {
    //   toast({
    //     title: "خطا",
    //     description: err.message,
    //     status: "error",
    //     duration: 3000,
    //     isClosable: false,
    //   });
    // });
    setTimeLeft(59);
    setForm({ key: "" });
    inputRef.current.focus();
  };

  const handleClickReturn = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.key || form.key.length < 5) return;
    if (timeLeft === 0) {
      return;
    }

    setLoading(true);
    setIsFormDisabled(true);
    const secondLoginData = { token: token, key: form.key };
    const res = await secondLogin(secondLoginData);
    if (!res.success) {
      toast({
        title: "خطا",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      return;
    }

    saveTokens(res.data.accessToken);
    setUser(jwtDecode(res.data.accessToken));
    navigate("/myhome");
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
        borderWidh="1px"
        borderRadius="lg"
        w={isDesktop ? "600px" : "full"}
        maxW={{ sm: "400", lg: "600px" }}
        minH={isDesktop ? "600px" : "90vh"}
        direction="column"
        alignContent="center"
        alignItems="center"
        rowGap={isDesktop ? 5 : 3}
        dir="rtl"
        borderColor="white"
        boxShadow="1px 2px 15px 1px rgb(0, 0, 0)"
        pt={isDesktop ? "10px" : "5px"}
      >
        <UserLock mt="15px" size={100} strokeWidth={1} />
        <Text color="white" fontSize="3xl">
          لطفا کد ارسال شده به تلفن همراهتان را وارد کنید
        </Text>
        <Text
          fontFamily="Beiruti"
          size="xs"
          color="whiteAlpha.500"
          fontSize={isDesktop ? "md" : "sm"}
        >
          کاربر گرامی هرگز کد ارسال شده را در اختیار دیگران قرار ندهید
        </Text>
        <Flex
          as="form"
          direction="column"
          width="70%"
          rowGap={5}
          onSubmit={handleSubmit}
        >
          <Divider mb="10px" />
          <FormControl width="full" textAlign="center" dir="ltr" isRequired>
            <PinInput
              type="number"
              placeholder="_"
              autoFocus={true}
              value={form.key}
              onChange={handleChange}
            >
              <PinInputField mr={2} ref={inputRef} />
              <PinInputField mr={2} />
              <PinInputField mr={2} />
              <PinInputField mr={2} />
              <PinInputField mr={2} />
            </PinInput>
          </FormControl>
          <Button
            fontFamily="Yekan"
            size="lg"
            leftIcon={<Send />}
            variant="solid"
            type="submit"
            colorScheme="teal"
            disabled={timeLeft <= 0 || isFormDisabled}
            isLoading={loading}
            width="full"
          >
            ورود به سامانه
          </Button>
          <Button
            onClick={handleClickTimerButton}
            rightIcon={timeLeft <= 0 ? <TimerReset /> : ""}
            width="full"
            disabled={timeLeft > 0 || isFormDisabled}
            colorScheme="green"
          >
            {timeLeft > 0 ? timeLeft : "کد جدید"}
          </Button>
          <Divider />
          <Button
            fontFamily="Yekan"
            mx="auto"
            href="#"
            onClick={handleClickReturn}
            textColor="yellow.400"
            variant="link"
            colorScheme="blue"
          >
            انصراف
          </Button>
        </Flex>
      </Flex>
    </Box>
    // <SimpleGrid
    //   filter={loading ? "blur(10px)" : ""}
    //   spacing={0}
    //   columns={{ base: 1, md: 1, lg: 4 }}
    //   height="98vh"
    //   width="99%"
    //   m={"auto"}
    //   mt={2}
    //   mb={2}
    //   p={isDesktop ? 5 : 0}
    //   borderWidth={!isDesktop ? "1px" : ""}
    //   borderRadius={!isDesktop ? "lg" : ""}
    // >
    //   <Box />
    //   <Box
    //     bg="blackAlpha.100"
    //     bgImage="url(/assets/images/bg/secondLogin.svg)"
    //     bgSize={"contain"}
    //     bgRepeat="no-repeat"
    //     bgPosition={"center"}
    //     p={8}
    //     borderWidth={isDesktop ? 1 : 0}
    //     borderRightWidth={0}
    //     borderLeftRadius={isDesktop ? "lg" : ""}
    //   />
    //   <Box
    //     p={8}
    //     borderWidth={isDesktop ? 1 : 0}
    //     borderLeftWidth={isDesktop ? 1 : 0}
    //     borderRightRadius={isDesktop ? "lg" : ""}
    //     borderLeftRadius={isDesktop ? "" : "lg"}
    //     dir="rtl"
    //   >
    //     <Flex direction="column" gap={6} as="form" onSubmit={handleSubmit}>
    //       <Heading
    //         color="blackAlpha.500"
    //         fontFamily="Vaziri"
    //         size={"lg"}
    //         textAlign="center"
    //       >
    //         لطفا کد ارسال شده به تلفن همراهتان را وارد کنید
    //       </Heading>
    //       <FormControl isRequired>
    //         <HStack justify="center" dir="ltr">
    //           <PinInput
    //             placeholder="_"
    //             autoFocus={true}
    //             value={form.key}
    //             onChange={handleChange}
    //           >
    //             <PinInputField ref={inputRef} />
    //             <PinInputField />
    //             <PinInputField />
    //             <PinInputField />
    //             <PinInputField />
    //           </PinInput>
    //         </HStack>
    //       </FormControl>
    //       <Divider />
    //       <Button
    //         colorScheme="blue"
    //         rightIcon={<DoorOpen />}
    //         type="submit"
    //         width="full"
    //         disabled={timeLeft <= 0 || isFormDisabled}
    //         isLoading={loading}
    //       >
    //         ورود
    //       </Button>
    //       <Button
    //         onClick={handleClickTimerButton}
    //         rightIcon={timeLeft <= 0 ? <TimerReset /> : ""}
    //         width="full"
    //         disabled={timeLeft > 0}
    //         colorScheme="green"
    //       >
    //         {timeLeft > 0 ? timeLeft : "کد جدید"}
    //       </Button>
    //       <Divider />
    //       <Button
    //         variant="link"
    //         colorScheme="blue"
    //         onClick={handleClickReturn}
    //         width="full"
    //       >
    //         انصراف
    //       </Button>
    //     </Flex>
    //   </Box>
    // </SimpleGrid>
  );
};
