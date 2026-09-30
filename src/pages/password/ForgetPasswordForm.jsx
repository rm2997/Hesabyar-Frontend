// src/components/ForgotPasswordForm.jsx
import {
  Box,
  Button,
  FormControl,
  Input,
  useToast,
  Text,
  useBreakpointValue,
  Flex,
  Image,
  Icon,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOpen } from "lucide-react";
import { GetUserByMobileNumber } from "../../api/services/userService";
import "../../theme/login.css";

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
    navigate("/Home");
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
    <div className="body">
      <Flex className="auth-page">
        <Flex w="full" flexDirection={"column"} rowGap={5}>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            w="full"
            marginX={"auto"}
            columnGap={2}
          >
            <Text color={"var(--muted);"}>تجارت آسانبر علیا · آسانسورلند</Text>
            <Image
              style={{
                width: "42px",
                height: "42px",
                objectfit: "cover",
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid var(--brand)",
                boxShadow: "0 0 0 5px rgba(123,45,255,.10)",
              }}
              src="/assets/images/logos/logo_small.webp"
            />
          </Flex>
          <Flex
            filter={isLoading ? "blur(10px)" : ""}
            textColor="white"
            mx="auto"
            borderWidh="2px"
            borderRadius="lg"
            w={isDesktop ? "460px" : "full"}
            maxW={{ sm: "400", lg: "600px" }}
            minH={isDesktop ? "300px" : "90vh"}
            direction="column"
            alignContent="center"
            alignItems="center"
            rowGap={isDesktop ? 2 : 0}
            dir="rtl"
            // borderColor="white"
            // boxShadow="1px 2px 15px 1px rgb(0, 0, 0)"
            // p={isDesktop ? "10px" : "5px"}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "32px",
              padding: "clamp(24px,5vw,38px)",
              boxShadow: "var(--shadow)",
              backdropFilter: "blur(22px)",
              webkitBackdropFilter: "blur(22px)",
              transition:
                "background .35s ease,border-color .35s ease,box-shadow .35s ease",
            }}
          >
            <Flex
              color={"#fff"}
              style={{
                boxShadow: "0 12px 35px rgba(123,45,255,.35)",
                background: "linear-gradient(180deg,#623987,#7f5ba0)",
                borderRadius: "22px",
                margin: "0 auto 18px",
                alignItems: "center",
                justifyContent: "center",
                width: "72px",
                height: "72px",
              }}
            >
              <Icon w={"35px"} h={"35px"}>
                <LockOpen />
              </Icon>
            </Flex>
            <Text fontWeight={"bold"} color="black" fontSize="3xl">
              بازیابی نام کاربری/کلمه عبور
            </Text>
            <Text
              fontFamily="Vazirmatn"
              size="xs"
              color="var(--muted)"
              fontSize={isDesktop ? "md" : "sm"}
              textAlign={"center"}
            >
              کاربر گرامی شماره همراه خود را وارد کنید تا لینک بازیابی برایتان
              ارسال شود
            </Text>
            <Flex
              as="form"
              direction="column"
              width="95%"
              rowGap={5}
              onSubmit={handleSubmit}
            >
              <FormControl isRequired>
                <Text my="5px" color={"var(--text)"}>
                  شماره همراه
                </Text>
                <Input
                  autoComplete="off"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  pr={3}
                  h={"55px"}
                  textColor={"var(--text)"}
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
                size="lg"
                color={"white"}
                style={{
                  background: "linear-gradient(180deg,#623987,#7f5ba0)",
                }}
                _hover={{
                  background:
                    "linear-gradient( 180deg, #74469d 0%, #5a327d 100% )",
                  boxShadow: "0 14px 30px rgba(57,27,90,.28)",
                  transform: "translateY(-2px);",
                }}
                borderRadius={"2xl"}
                variant="solid"
                type="submit"
                isLoading={isLoading}
                isDisabled={!enableSend}
                width="full"
              >
                ارسال لینک بازیابی
              </Button>
              <Button
                mx="auto"
                size="lg"
                href="#"
                borderRadius={"2xl"}
                borderColor={"transparent"}
                _hover={{
                  borderColor: "rgb(98, 57, 135)",
                  background: "rgba(98,57,135,.12)",
                }}
                variant={"outline"}
                onClick={handleClick}
                width="full"
              >
                بازگشت به صفحه اصلی
              </Button>
            </Flex>
          </Flex>
          <Link
            mx="auto"
            href="/login"
            textColor="#512C74"
            _hover={{
              color: "#512C74",
              opacity: "1",
            }}
          >
            بازگشت به صفحه ورود
          </Link>
        </Flex>
      </Flex>
    </div>
  );
};
