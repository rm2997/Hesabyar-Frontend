import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { MyInputBox } from "../my-components/MyInputBox";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokens, loadTokens } from "../api/tokenUtils";
import { UserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { CircleUserRound, DoorOpen, LogIn } from "lucide-react";
import { GetNewCaptcha, login } from "../api/services/authService";
import endpoints from "../api/endpoints";

export const LoginForm = () => {
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
    if (accessToken) navigate("/myhome");
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

  // const createCaptchaImage = async (rndText) => {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  //   const rotations = [-15, -10, -5, 0, 5, 10, 15];
  //   const colors = ["green", "red", "brown", "blue", "purple"];
  //   const fonts = ["Arial", "Verdana", "Georgia", "monospace", "cursive"];
  //   //const rndText = Math.random().toString(36).substring(2, 7);
  //   canvas.width = 150;
  //   canvas.height = 80;
  //   ctx.fillStyle = "white";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   ctx.textBaseline = "middle";
  //   ctx.textAlign = "center";

  //   for (let i = 0; i < rndText.length; i++) {
  //     const char = rndText[i];
  //     const rndX = 25 + i * 25;
  //     const rndY = 40;
  //     const rndFontSize = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
  //     const rndFont = fonts[Math.floor(Math.random() * fonts.length)];
  //     const rndColor = colors[Math.floor(Math.random() * colors.length)];
  //     const rndRotate = rotations[Math.floor(Math.random() * rotations.length)];
  //     ctx.save(); // ذخیره حالت فعلی
  //     ctx.translate(rndX, rndY); // انتقال مرکز چرخش
  //     ctx.rotate((rndRotate * Math.PI) / 180); // چرخش به رادیان
  //     ctx.font = `bold ${rndFontSize}px ${rndFont}`;
  //     ctx.fillStyle = rndColor;
  //     ctx.fillText(char, 0, 0);
  //     ctx.restore(); // بازگشت به حالت اولیه
  //   }

  //   const dataUrl = canvas.toDataURL("image/png");
  //   setCaptcha(rndText);
  //   setCaptchaImage(dataUrl);
  // };

  const handleGeneratCaptcha = async () => {
    const { svg, token } = await getNewCaptchaFromServer();
    setCaptchaToken(token);
    setCaptchaImage(svg);
    setInputCaptha("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (showCaptcha && inputCaptha != captcha) {
    //   toast({
    //     title: "خطا",
    //     description: "کد تصادفی صحیح نیست",
    //     status: "error",
    //     duration: 3000,
    //     isClosable: false,
    //   });
    //   const { svg, token } = await getNewCaptchaFromServer();

    //   handleGeneratCaptcha();
    //   setInputCaptha("");
    //   setForm({ username: "", password: "", userLocation: "" });
    //   return;
    // }
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
            res?.data?.mobilnumber
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
        description: "مشکلی در دریافت کد تصادفی جدید پیش آمده است.",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      return { success: false };
    }
    return rndTextRes?.data;
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
      <Box width="full">
        <Flex
          filter={isFormDisabled ? "blur(10px)" : ""}
          bg="gray"
          textColor="white"
          mx="auto"
          borderWidh="2px"
          borderRadius="lg"
          w={isDesktop ? "600px" : "full"}
          maxW={{ sm: "400", lg: "600px" }}
          minH={isDesktop ? "600px" : "90vh"}
          direction="column"
          alignContent="center"
          alignItems="center"
          rowGap={isDesktop ? 2 : 0}
          dir="rtl"
          borderColor="white"
          boxShadow="1px 2px 15px 1px rgb(0, 0, 0)"
          p={isDesktop ? "10px" : "5px"}
        >
          <CircleUserRound mt="15px" size={100} strokeWidth={1} />
          <Text color="white" fontSize="3xl">
            ورود کاربران
          </Text>
          <Text
            fontFamily="Beiruti"
            size="xs"
            color="whiteAlpha.500"
            fontSize={isDesktop ? "md" : "sm"}
          >
            سامانه دستیار سیستم های حسابداری
          </Text>
          <Flex
            as="form"
            direction="column"
            width="70%"
            rowGap={5}
            onSubmit={handleSubmit}
          >
            <Divider mb="10px" />
            <FormControl textColor="white" isRequired>
              <Input
                autoComplete="off"
                _placeholder={{ color: "whiteAlpha.700" }}
                _focus={{
                  boxShadow: "teal 0px 2px 5px 1px",
                  borderColor: "blackAlpha.400",
                }}
                textColor="white"
                name="username"
                type="text"
                variant="outline"
                value={form.username}
                onChange={handleChange}
                placeholder="نام کاربری"
              />
            </FormControl>

            <FormControl textColor="white" isRequired>
              <MyInputBox
                autoComplete="off"
                _placeholder={{ color: "whiteAlpha.700" }}
                _focus={{
                  boxShadow: "teal 0px 2px 5px 1px",
                  borderColor: "blackAlpha.400",
                }}
                type="password"
                pr={3}
                textColor="white"
                variant="outline"
                name="password"
                title="کلمه عبور"
                size={30}
                value={form.password}
                onChange={handleChange}
              />
            </FormControl>
            {showCaptcha && (
              <FormControl textColor="white" isRequired>
                <FormLabel hidden={!isDesktop}>رمز تصادفی</FormLabel>
                <Flex justify="space-between">
                  <Input
                    autoComplete="off"
                    colorScheme="teal"
                    _placeholder={{ color: "whiteAlpha.700" }}
                    textColor="white"
                    dir={isDesktop ? "ltr" : "rtl"}
                    width="50%"
                    name="captcha"
                    type="text"
                    variant="flushed"
                    value={inputCaptha}
                    onChange={(e) => handleChangeCaptcha(e.target.value)}
                    placeholder={
                      isDesktop ? "کد تصویر مقابل را وارد کنید" : "کد تصویر"
                    }
                  />
                  <Box
                    width="150px"
                    dangerouslySetInnerHTML={{ __html: captchaImage }}
                    onClick={() => handleGeneratCaptcha()}
                    mx={1}
                    borderWidth={1}
                    borderColor="gray"
                  >
                    {/* <Image
                      objectFit="cover"
                      target="_blank"
                      rel="noopener noreferrer"
                      src={endpoints.auth.newCaptcha}
                      onClick={() => handleGeneratCaptcha()}
                    /> */}
                  </Box>
                </Flex>
              </FormControl>
            )}
            <Divider mt="5px" mb="10px" />
            <Button
              fontFamily="Yekan"
              size="lg"
              colorScheme="teal"
              variant="solid"
              leftIcon={<LogIn />}
              type="submit"
              width="full"
              disabled={isFormDisabled}
              isLoading={isFormDisabled}
            >
              ورودبه حسابیار
            </Button>
            <Link
              fontFamily="Yekan"
              mx="auto"
              href="#"
              onClick={handleClick}
              textColor="yellow.400"
            >
              فراموشی نام کاربری/رمز
            </Link>
            <Link
              fontFamily="Yekan"
              mx="auto"
              href="#"
              onClick={handleHomeClick}
              textColor="yellow.400"
            >
              خانه
            </Link>
          </Flex>
          <Flex mt="auto">
            <Text
              mx="auto"
              fontFamily="iransans"
              fontSize="2xs"
              color="whiteAlpha.600"
            >
              نسخه 1.0.0.0 *** 09 مرداد 1404
            </Text>
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
      </Box>
    </Box>
  );
};
