import React, { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";

export const LoginForm = () => {
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormDisabled(true);
    const examplePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(200);
        setIsFormDisabled(false);
      }, 5000);
    });

    toast.promise(examplePromise, {
      success: {
        title: "ورود موفقیت‌آمیز",
        description: `خوش اومدی ${form.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      },
      error: {
        title: "مشکلی هنگام مرود به سیستم رخ داد",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: false,
      },
      loading: {
        title: "در انتظار دریافت نتیجه از سرور",
        description: "لطفا شکیبا باشید",
      },
    });
  };
  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="100px"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      dir="rtl"
    >
      <Heading size={"sm"} mb={6} textAlign="right">
        به حسابیار خوش آمدید
      </Heading>
      <Heading size={"lg"} mb={6} textAlign="center">
        ورود به حساب
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>ایمیل</FormLabel>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>رمز عبور</FormLabel>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder=""
            />
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            width="full"
            disabled={isFormDisabled}
          >
            ورود
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
