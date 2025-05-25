import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import { login } from "../api/services/authService";
import { useNavigate } from "react-router-dom";
import { loadTokens } from "../api/tokenUtils";

export const LoginForm = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    username: "",
    password: "",
    userLocation: "",
  });

  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = loadTokens();

  useEffect(() => {
    if (accessToken) navigate("/home");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/forget-password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormDisabled(true);
    console.log(form);
    toast.promise(
      login(form)
        .then((res) => {
          return res;
        })
        .finally(() => {
          setIsFormDisabled(false);
          navigate("/home");
        }),
      {
        success: (res) => ({
          title: "ورود موفقیت‌آمیز",
          description: `خوش اومدی ${form.username}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        }),
        error: (err) => ({
          title: err.message,
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: false,
        }),
        loading: {
          title: "در انتظار دریافت نتیجه از سرور",
          description: "لطفا شکیبا باشید",
        },
      }
    );
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt="100px"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      dir="rtl"
    >
      <Heading size={"lg"} mb={6} textAlign="center">
        ورود به حساب کاربری
      </Heading>

      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>نام کاربری</FormLabel>
          <Input
            colorScheme="blue"
            name="username"
            dir="ltr"
            type="text"
            variant="flushed"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>کلمه عبور</FormLabel>
          <Input
            dir="ltr"
            colorScheme="blue"
            name="password"
            type="password"
            variant="flushed"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          rightIcon={<UnlockIcon />}
          type="submit"
          width="full"
          disabled={isFormDisabled}
        >
          ورود
        </Button>
      </VStack>
      <Divider marginTop={10} marginBottom={5} />
      <Center>
        <Link href="#" onClick={handleClick} color="blue">
          رمز خود را فراموش کرده اید؟
        </Link>
      </Center>
    </Box>
  );
};
