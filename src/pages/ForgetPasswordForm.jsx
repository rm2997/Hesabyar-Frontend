// src/components/ForgotPasswordForm.jsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { sendResetLink } from "../api/services/authService"; // فرض بر اینکه داریمش
import { useNavigate } from "react-router-dom";
import { LinkIcon } from "@chakra-ui/icons";

export const ForgotPasswordForm = () => {
  const toast = useToast();
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendResetLink(mobile); // سرویس فرستادن لینک ایمیل
      toast({
        title: "لینک بازیابی ارسال شد.",
        description: "لطفاً گوشی همراه خود را بررسی کنید.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setMobile("");
    } catch (err) {
      toast({
        title: "خطا در ارسال بیامک",
        description: err.message || "مشکلی پیش آمد",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      dir="rtl"
      maxW="400px"
      mx="auto"
      mt={20}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={5} as="form" onSubmit={handleSubmit}>
        <Heading size="md">فراموشی رمز عبور</Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          شماره همراه خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
        </Text>

        <FormControl isRequired>
          <FormLabel>شماره همراه</FormLabel>
          <Input
            variant="flushed"
            dir="ltr"
            type="number"
            placeholder="09xxxxxxxxx"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          width="full"
        >
          ارسال لینک بازیابی
        </Button>
        <Divider />
        <Button
          leftIcon={<LinkIcon />}
          colorScheme="pink"
          variant="solid"
          onClick={handleClick}
          width="full"
        >
          ورود به سیستم
        </Button>
      </VStack>
    </Box>
  );
};
