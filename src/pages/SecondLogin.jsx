import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Icon,
  Image,
  Link,
  PinInput,
  PinInputField,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, TimerReset, UserLock } from "lucide-react";
import { saveTokens } from "../api/tokenUtils";
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
  const [loading, setLoading] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [form, setForm] = useState({
    key: "",
    token: "",
  });
  const inputRef = useRef(null);
  const [searchParams] = useSearchParams();

  const firstToken = searchParams.get("token");
  const mobile = searchParams.get("mobile");
  const navigate = useNavigate();

  useEffect(() => {
    // if (!firstToken || !mobile) {
    //   navigate("/login");
    //   return;
    // }
    // inputRef.current.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setForm({ key: form.key, token: firstToken });
  }, [firstToken]);

  const handleChange = (e) => {
    setForm({ ...form, key: e });
    if (e.length >= 5) setIsFormDisabled(false);
    else setIsFormDisabled(true);
  };

  const handleClickTimerButton = async () => {
    if (timeLeft > 0) return;
    if (!form.token || !mobile) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setIsFormDisabled(true);
    const res = await sendValidationKeyAgain(form);
    if (!res.success) {
      toast({
        title: "خطا",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      navigate("/login");
      setLoading(false);
      setIsFormDisabled(false);
      return;
    }
    setForm({ key: "", token: res.data?.accessToken });
    setTimeLeft(59);
    setLoading(false);
    setIsFormDisabled(false);
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
    const res = await secondLogin(form);
    if (!res.success) {
      toast({
        title: "خطا",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setLoading(false);
      setIsFormDisabled(false);
      navigate("/login");
      return;
    }

    saveTokens(res.data.accessToken);
    setUser(jwtDecode(res.data.accessToken));
    navigate("/myhome");
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
            filter={loading ? "blur(10px)" : ""}
            textColor="white"
            mx="auto"
            borderWidh="2px"
            borderRadius="lg"
            w={isDesktop ? "460px" : "full"}
            maxW={{ sm: "400", lg: "600px" }}
            minH={isDesktop ? "600px" : "90vh"}
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
                <UserLock />
              </Icon>
            </Flex>

            <Text textAlign={"center"} color="black" fontSize="2xl">
              لطفا کد ارسال شده به تلفن همراهتان را وارد کنید
            </Text>
            <Text
              fontFamily="Vazirmatn"
              size="xs"
              color="var(--muted)"
              fontSize={isDesktop ? "md" : "sm"}
            >
              کاربر گرامی هرگز کد ارسال شده را در اختیار دیگران قرار ندهید
            </Text>
            <Flex
              as="form"
              direction="column"
              width="95%"
              rowGap={5}
              color="var(--muted)"
              onSubmit={handleSubmit}
            >
              <FormControl width="full" textAlign="center" dir="ltr" isRequired>
                <PinInput
                  colorScheme="blackAlpha"
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
                size="lg"
                style={{
                  background: "linear-gradient(180deg,#623987,#7f5ba0)",
                }}
                _hover={{
                  background:
                    "linear-gradient( 180deg, #74469d 0%, #5a327d 100% )",
                  boxShadow: "0 14px 30px rgba(57,27,90,.28)",
                  transform: "translateY(-2px);",
                }}
                variant="solid"
                borderRadius={"2xl"}
                type="submit"
                disabled={timeLeft <= 0 || isFormDisabled}
                isLoading={loading}
                width="full"
                color={"white"}
              >
                ورود به سامانه
              </Button>
              <Button
                onClick={handleClickTimerButton}
                rightIcon={timeLeft <= 0 ? <TimerReset /> : ""}
                width="full"
                disabled={timeLeft > 0}
                size="lg"
                borderRadius={"2xl"}
                borderColor={"transparent"}
                _hover={{
                  borderColor: "rgb(98, 57, 135)",
                  background: "rgba(98,57,135,.12)",
                }}
                fontFamily={"iransans"}
                variant={"outline"}
                color={"black"}
              >
                {timeLeft > 0 ? timeLeft : "کد جدید"}
              </Button>
              <Divider />
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
        </Flex>
      </Flex>
    </div>
  );
};
