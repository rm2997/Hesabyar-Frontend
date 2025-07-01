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
import { useNavigate } from "react-router-dom";
import { Send, UserLock } from "lucide-react";
import {
  GetUserByMobileNumber,
  SendForgetPassSms,
} from "../../api/services/userService";

export const ForgotPasswordForm = () => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });
  const toast = useToast();
  const [mobile, setMobile] = useState("");
  const [enableSend, setEnableSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeMobileNumber = async (mobile) => {
    if (mobile.length <= 11) setMobile(mobile);
    if (mobile.length == 11) {
      setEnableSend(true);
      return;
    } else setEnableSend(false);
  };
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await GetUserByMobileNumber(mobile);
      setMobile("");
      if (!user.success) {
        toast({
          title: "خطا در ارسال بیامک",
          description: `کاربری با این شماره همراه ثبت نشده است - ${user.error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        return;
      }
      const userInfo = user.data.userfname + " " + user.data.userlname;
      console.log(userInfo);
      await SendForgetPassSms(
        userInfo,
        user.data.usermobilenumber,
        user.data.token
      );
      toast({
        title: "لینک بازیابی ارسال شد.",
        description: "لطفاً تلفن همراه خود را بررسی کنید.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast({
        title: "خطا در ارسال بیامک",
        description: err.message || "مشکلی پیش آمد",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <SimpleGrid
      filter={isLoading ? "blur(10px)" : ""}
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
      <Box></Box>
      <Box
        bg="blackAlpha.100"
        bgImage="url(/assets/images/bg/forgetPassword.svg)"
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
        <VStack spacing={5} as="form" onSubmit={handleSubmit}>
          <UserLock size={100} color="#74CEF7" strokeWidth={1} />
          <Heading
            color="blackAlpha.800"
            fontFamily="Vaziri"
            hidden={!isDesktop}
            size="lg"
          >
            فراموشی رمز عبور
          </Heading>
          <Text
            fontFamily="Vaziri"
            fontSize="xs"
            color="blackAlpha.500"
            textAlign="center"
          >
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
              onChange={(e) => handleChangeMobileNumber(e.target.value)}
            />
          </FormControl>

          <Button
            leftIcon={<Send />}
            variant="outline"
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            isDisabled={!enableSend}
            width="full"
          >
            ارسال لینک بازیابی
          </Button>
          <Divider />
          <Button
            variant="link"
            colorScheme="blue"
            onClick={handleClick}
            width="full"
          >
            انصراف
          </Button>
        </VStack>
      </Box>
    </SimpleGrid>
  );
};
