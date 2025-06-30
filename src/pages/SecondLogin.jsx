import React, { useEffect, useRef, useState } from "react";
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
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { DoorOpen, TimerReset } from "lucide-react";
import { saveTokens } from "../api/tokenUtils";
import { sendValidationKeySms } from "../api/smsUtils";

export const SecondLogin = ({}) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });
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
      //navigate("/login");
      return;
    }
    const newKey = generateRandomNumber();
    setKey(newKey);
    sendValidationKeySms(mobile, newKey);
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateRandomNumber = () => {
    const rnd = Math.floor(10000 + Math.random() * 90000);

    return rnd;
  };

  const handleChange = (e) => {
    setForm({ key: e });
    if (e.length >= 5) setIsFormDisabled(false);
    else setIsFormDisabled(true);
  };

  const handleClickTimerButton = () => {
    if (timeLeft > 0) return;
    if (!token || !mobile) {
      //navigate("/login");
      return;
    }
    const newKey = generateRandomNumber();
    setKey(newKey);

    sendValidationKeySms(mobile, newKey).catch((err) => {
      toast({
        title: "خطا",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    });
    setTimeLeft(59);
    setForm({ key: "" });
    inputRef.current.focus();
  };

  const handleClickReturn = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key || key.length < 5) return;
    if (timeLeft === 0) {
      return;
    }
    setLoading(true);
    setIsFormDisabled(true);
    if (form.key == key) {
      saveTokens(token);
      navigate("/myhome");
    } else {
      setForm({ key: "" });
      toast({
        title: "خطا",
        description: "کد وارد شده صحیح نیست",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      inputRef.current.focus();
      setIsFormDisabled(false);
      setLoading(false);
    }
  };

  return (
    <SimpleGrid
      filter={loading ? "blur(10px)" : ""}
      spacing={0}
      columns={{ base: 1, md: 1, lg: 4 }}
      height="98vh"
      width="99%"
      m={"auto"}
      mt={2}
      mb={2}
      p={isDesktop ? 5 : 0}
      borderWidth={!isDesktop ? "1px" : ""}
      borderRadius={!isDesktop ? "lg" : ""}
    >
      <Box />
      <Box
        bg="blackAlpha.100"
        bgImage="url(/assets/images/bg/secondLogin.svg)"
        bgSize={"contain"}
        bgRepeat="no-repeat"
        bgPosition={"center"}
        p={8}
        borderWidth={isDesktop ? 1 : 0}
        borderRightWidth={0}
        borderLeftRadius={isDesktop ? "lg" : ""}
      />
      <Box
        p={8}
        borderWidth={isDesktop ? 1 : 0}
        borderLeftWidth={isDesktop ? 1 : 0}
        borderRightRadius={isDesktop ? "lg" : ""}
        borderLeftRadius={isDesktop ? "" : "lg"}
        dir="rtl"
      >
        <Flex direction="column" gap={6} as="form" onSubmit={handleSubmit}>
          <Heading
            color="blackAlpha.500"
            fontFamily="Vaziri"
            size={"lg"}
            textAlign="center"
          >
            لطفا کد ارسال شده به تلفن همراهتان را وارد کنید
          </Heading>
          <FormControl isRequired>
            <HStack justify="center" dir="ltr">
              <PinInput
                placeholder="_"
                autoFocus={true}
                value={form.key}
                onChange={handleChange}
              >
                <PinInputField ref={inputRef} />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </FormControl>
          <Divider />
          <Button
            colorScheme="blue"
            rightIcon={<DoorOpen />}
            type="submit"
            width="full"
            disabled={timeLeft <= 0 || isFormDisabled}
            isLoading={loading}
          >
            ورود
          </Button>
          <Button
            onClick={handleClickTimerButton}
            rightIcon={timeLeft <= 0 ? <TimerReset /> : ""}
            width="full"
            disabled={timeLeft > 0}
            colorScheme="green"
          >
            {timeLeft > 0 ? timeLeft : "کد جدید"}
          </Button>
          <Divider />
          <Button
            variant="link"
            colorScheme="blue"
            onClick={handleClickReturn}
            width="full"
          >
            انصراف
          </Button>
        </Flex>
      </Box>
    </SimpleGrid>
  );
};
