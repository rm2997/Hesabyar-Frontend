// src/components/ForgotPasswordForm.jsx
import {
  Box,
  Button,
  FormControl,
  Input,
  useToast,
  Text,
  Divider,
  useBreakpointValue,
  Flex,
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

  const handleChangeMobileNumber = (e) => {
    const tmpMobile = e.target.value;
    console.log(tmpMobile.length);

    if (isNaN(Number(tmpMobile))) return;
    if (tmpMobile.length > 11) return;
    if (tmpMobile.length < 12) {
      setMobile(tmpMobile);
    }
    if (tmpMobile?.length == 11 && tmpMobile?.startsWith("09") == true) {
      setEnableSend(true);
      return;
    }
    setEnableSend(false);
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
        filter={isLoading ? "blur(10px)" : ""}
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
          فراموشی رمز/نام کاربری
        </Text>
        <Text
          fontFamily="Beiruti"
          size="xs"
          color="whiteAlpha.500"
          fontSize={isDesktop ? "md" : "sm"}
        >
          کاربر گرامی شماره همراه خود را وارد کنید تا لینک بازیابی برایتان ارسال
          شود
        </Text>
        <Flex
          as="form"
          direction="column"
          width="70%"
          rowGap={5}
          onSubmit={handleSubmit}
        >
          <Divider mb="10px" />
          <FormControl isRequired>
            <Input
              autoComplete="off"
              _placeholder={{ color: "whiteAlpha.700" }}
              _focus={{
                boxShadow: "teal 0px 2px 5px 1px",
                borderColor: "blackAlpha.400",
              }}
              pr={3}
              textColor="white"
              variant="outline"
              dir="ltr"
              placeholder="09xxxxxxxxx"
              value={mobile}
              isInvalid={
                mobile?.length > 0 &&
                (mobile?.length != 11 ||
                  isNaN(Number(mobile)) ||
                  mobile.startsWith("09") == false)
              }
              onChange={handleChangeMobileNumber}
            />
          </FormControl>

          <Button
            fontFamily="Yekan"
            size="lg"
            leftIcon={<Send />}
            variant="solid"
            type="submit"
            colorScheme="teal"
            isLoading={isLoading}
            isDisabled={!enableSend}
            width="full"
          >
            ارسال لینک بازیابی
          </Button>
          <Divider />
          <Button
            fontFamily="Yekan"
            mx="auto"
            href="#"
            onClick={handleClick}
            textColor="yellow.400"
            variant="link"
            colorScheme="blue"
          >
            انصراف
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
