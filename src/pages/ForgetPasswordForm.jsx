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
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { sendResetLink } from "../api/services/authService"; // فرض بر اینکه داریمش
import { useNavigate } from "react-router-dom";
import { LinkIcon } from "@chakra-ui/icons";
import { Send, UserLock } from "lucide-react";

export const ForgotPasswordForm = () => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
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
    <SimpleGrid
      bgImage="url(/assets/images/bg/forgetPassword.jpg)"
      bgSize={isDesktop ? "contain" : "auto"}
      bgRepeat="no-repeat"
      bgPosition="left"
      height="100vh"
      spacing={0}
      columns={{ base: 1, md: 2, lg: 2 }}
      p={5}
      width="100%"
      m={1}
    >
      <Box
        hidden={!isDesktop}
        p={8}
        borderWidth={1}
        borderRightWidth={0}
        borderLeftRadius="lg"
        bg="whiteAlpha.500"
      ></Box>
      <Box
        p={8}
        borderWidth={1}
        borderLeftWidth={isDesktop ? 0 : 1}
        borderRightRadius="lg"
        borderLeftRadius={isDesktop ? "" : "lg"}
        dir="rtl"
      >
        <VStack spacing={5} as="form" onSubmit={handleSubmit}>
          <UserLock size={100} color="#74CEF7" strokeWidth={1} />
          <Heading hidden={!isDesktop} size="md">
            فراموشی رمز عبور
          </Heading>
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
            leftIcon={<Send />}
            variant="outline"
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            width="full"
          >
            ارسال لینک بازیابی
          </Button>
          <Divider />
          <Button
            variant="outline"
            leftIcon={<LinkIcon />}
            colorScheme="pink"
            onClick={handleClick}
            width="full"
          >
            ورود به سیستم
          </Button>
        </VStack>
      </Box>
    </SimpleGrid>
  );
};
