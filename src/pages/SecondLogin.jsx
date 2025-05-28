import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  HStack,
  Heading,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TimerReset } from "lucide-react";
import { saveTokens } from "../api/tokenUtils";
import { sendValidationKeySms } from "../api/smsUtils";

export const SecondLogin = ({}) => {
  const toast = useToast();
  const [timeLeft, setTimeLeft] = useState(59);
  const [key, setKey] = useState(0);
  const [form, setForm] = useState({
    key: "",
  });
  const inputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const mobile = searchParams.get("mobile");

  const navigate = useNavigate();

  useEffect(() => {
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
    console.log(rnd);
    return rnd;
  };

  const handleChange = (e) => {
    setForm({ key: e });
  };

  const handleClickTimerButton = () => {
    if (timeLeft > 0) return;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeLeft === 0) {
      return;
    }
    if (form.key == key) {
      saveTokens(token);
      navigate("/home");
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
    }
  };

  return (
    <Stack
      maxW="600px"
      mx="auto"
      mt="100px"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      align="stretch"
    >
      <Heading size={"lg"} mb={6} textAlign="center">
        لطفا کد ارسال شده به شماره همراهتان را وارد کنید
      </Heading>
      <Flex direction="column" gap={6} as="form" onSubmit={handleSubmit}>
        <FormControl isRequired>
          <HStack justify="center">
            <PinInput value={form.key} onChange={handleChange}>
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
          rightIcon={<UnlockIcon />}
          type="submit"
          width="full"
          disabled={timeLeft <= 0}
        >
          ورود
        </Button>
        <Button
          onClick={handleClickTimerButton}
          leftIcon={<TimerReset />}
          width="full"
          disabled={timeLeft > 0}
          colorScheme="green"
        >
          {timeLeft > 0 ? timeLeft : "ارسال مجدد"}
        </Button>
      </Flex>
    </Stack>
  );
};
