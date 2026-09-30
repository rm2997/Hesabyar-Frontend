import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  Link,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { MyInputBox } from "../my-components/MyInputBox";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokens, loadTokens } from "../api/tokenUtils";
import { UserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { LucideUserRound } from "lucide-react";
import { GetNewCaptcha, login } from "../api/services/authService";
import "../theme/login.css";

export const LoginForm = () => {
  const userNameBoxRef = useRef();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [showCaptcha, setShowCaptcha] = useState(false);
  //const [captcha, setCaptcha] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [inputCaptha, setInputCaptha] = useState("");
  const { setUser } = useContext(UserContext);
  const toast = useToast();
  const [form, setForm] = useState({
    username: "",
    password: "",
    userLocation: "",
    captchaToken: "",
    captchaAnswer: "",
  });

  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = loadTokens();

  useEffect(() => {
    //navigate("/second-login");
    if (accessToken) navigate("/myhome");
    userNameBoxRef.current.focus();
  }, []);

  useEffect(() => {
    if (showCaptcha) handleGeneratCaptcha();
  }, [showCaptcha]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCaptcha = (value) => {
    setInputCaptha(value);
  };

  const handleGeneratCaptcha = async () => {
    setIsFormDisabled(true);
    const { svg, token } = await getNewCaptchaFromServer();
    setCaptchaToken(token);
    setCaptchaImage(svg);
    setInputCaptha("");
    setIsFormDisabled(false);
    //await createCaptchaImage(svg);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/forget-password");
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/Home");
  };

  const validateForm = async () => {
    if (
      !form?.username ||
      form?.username?.length < 3 ||
      !isNaN(Number(form?.username))
    ) {
      toast({
        title: "توجه",
        description: "نام کاربری صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!form?.password) {
      toast({
        title: "توجه",
        description: "کلمه عبور صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      inputCaptha.length > 0 &&
      (!isNaN(Number(inputCaptha)) || inputCaptha?.length != 5)
    ) {
      toast({
        title: "توجه",
        description: "رمز تصادفی صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validate = await validateForm();
    if (validate == false) return;
    setIsFormDisabled(true);
    try {
      const formData = {
        ...form,
        captchaToken: captchaToken,
        captchaAnswer: inputCaptha,
      };
      const res = await login(formData);
      if (!res.success) {
        setShowCaptcha(true);
        setInputCaptha("");
        setForm({ username: "", password: "", userLocation: "" });
        handleGeneratCaptcha();
        setIsFormDisabled(false);
        toast({
          title: "خطا",
          description: res.error,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
        return;
      }
      toast({
        title: !res?.data?.twoFactorAuthntication
          ? "ورود موفقیت‌آمیز"
          : "ورود دو مرحله ای",
        description: !res?.data?.twoFactorAuthntication
          ? `خوش آمدید ${form.username}`
          : "لطفا مراحل ورود دو مرحله ای را دنبال کنید",
        status: !res?.data?.twoFactorAuthntication ? "success" : "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      if (
        !res?.data?.twoFactorAuthntication ||
        res?.data?.twoFactorAuthntication === false
      ) {
        saveTokens(res.data.accessToken);
        setUser(jwtDecode(res.data.accessToken));
        navigate("/myhome");
      } else {
        navigate(
          "/second-login?token=" +
            res?.data?.accessToken +
            "&mobile=" +
            res?.data?.mobilnumber,
        );
      }
    } catch (error) {
      setShowCaptcha(true);
      setInputCaptha("");
      setForm({ username: "", password: "", userLocation: "" });
      handleGeneratCaptcha();

      toast({
        title: "خطا",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
    setIsFormDisabled(false);
  };

  const getNewCaptchaFromServer = async () => {
    const rndTextRes = await GetNewCaptcha();
    if (!rndTextRes.success) {
      toast({
        title: "خطا",
        description: rndTextRes?.error
          ? rndTextRes?.error
          : "مشکلی در دریافت کد تصادفی جدید پیش آمده است.",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      return { success: false };
    }
    return rndTextRes?.data;
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
            filter={isFormDisabled ? "blur(10px)" : ""}
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
                <LucideUserRound />
              </Icon>
            </Flex>
            <Text fontWeight={"bold"} color="black" fontSize="3xl">
              ورود کاربران
            </Text>
            <Text
              fontFamily="Vazirmatn"
              size="xs"
              color="var(--muted)"
              fontSize={isDesktop ? "md" : "sm"}
            >
              سامانه دستیار سیستم های حسابداری
            </Text>
            <Flex
              as="form"
              direction="column"
              width="95%"
              rowGap={"15px"}
              onSubmit={handleSubmit}
            >
              <FormControl textColor="white" isRequired>
                <Text my="5px" color={"var(--text)"}>
                  نام کاربری
                </Text>
                <Input
                  ref={userNameBoxRef}
                  isInvalid={
                    form?.username?.length > 0 && form?.username?.length < 3
                  }
                  autoComplete="off"
                  h={"55px"}
                  borderRadius={"2xl"}
                  _placeholder={{ color: "whiteAlpha.700" }}
                  textColor={"var(--text)"}
                  name="username"
                  type="text"
                  variant="outline"
                  value={form?.username}
                  onChange={handleChange}
                  placeholder="نام کاربری"
                />
              </FormControl>

              <FormControl textColor="white" isRequired>
                <Text my="5px" color={"var(--text)"}>
                  کلمه عبور
                </Text>
                <MyInputBox
                  borderRadius={"2xl"}
                  isInvalid={
                    form?.password?.length > 0 && form?.password?.length < 3
                  }
                  h={"55px"}
                  autoComplete="off"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  type="password"
                  pr={3}
                  textColor={"var(--text)"}
                  variant="outline"
                  name="password"
                  title="کلمه عبور"
                  size={30}
                  value={form.password}
                  onChange={handleChange}
                />
              </FormControl>
              {showCaptcha && (
                <FormControl color={"var(--text)"} isRequired>
                  <FormLabel hidden={!isDesktop}>رمز تصادفی</FormLabel>
                  <Flex justify="space-between">
                    <Input
                      isInvalid={
                        inputCaptha?.length > 0 && inputCaptha?.length != 5
                      }
                      autoComplete="off"
                      _placeholder={{ color: "whiteAlpha.700" }}
                      textColor={"var(--text)"}
                      px={2}
                      h={"55px"}
                      dir={isDesktop ? "ltr" : "rtl"}
                      width="50%"
                      name="captcha"
                      type="text"
                      variant="outline"
                      borderRadius={"2xl"}
                      value={inputCaptha}
                      onChange={(e) => handleChangeCaptcha(e.target.value)}
                      placeholder={
                        isDesktop ? "کد تصویر مقابل را وارد کنید" : "کد تصویر"
                      }
                    />
                    <Box
                      minW="150px"
                      minH="60px"
                      mx={1}
                      borderWidth={1}
                      borderColor="whiteAlpha.300"
                      borderRadius="md"
                      onClick={() => handleGeneratCaptcha()}
                      cursor={"pointer"}
                      alignContent="center"
                      p="px"
                    >
                      <Box
                        dangerouslySetInnerHTML={{ __html: captchaImage }}
                        p="1px"
                      />
                      <Text
                        height="50%"
                        textColor="whiteAlpha.400"
                        textAlign="center"
                        hidden={captchaImage?.length > 0}
                      >
                        تصویر امنیتی
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
              )}
              <Link
                href="#"
                onClick={handleClick}
                textColor="#512C74"
                _hover={{
                  color: "#512C74",
                  opacity: "1",
                  transform: "translateX(-3px)",
                }}
              >
                فراموشی نام کاربری/رمز
              </Link>

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
                borderRadius={"2xl"}
                color={"white"}
                variant="solid"
                type="submit"
                width="full"
                disabled={
                  form?.username?.length < 3 ||
                  form?.password?.length < 3 ||
                  isFormDisabled
                }
                isLoading={isFormDisabled}
              >
                ورود به سامانه
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
                onClick={handleHomeClick}
                width="full"
              >
                بازگشت به صفحه اصلی
              </Button>
            </Flex>

            <Flex
              hidden={!isFormDisabled}
              direction={"column"}
              top={0}
              left={0}
              position="absolute"
              zIndex={100}
              minHeight="50%"
              h="100%"
              minW="full"
              bg="blackAlpha.300"
            />
          </Flex>
          <Flex mt={"auto"}>
            <Text
              color={"var(--muted);"}
              mx="auto"
              fontFamily="iransans"
              fontSize="2xs"
            >
              نسخه 1.0.1.0 *** هشتم مهر 1405
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
