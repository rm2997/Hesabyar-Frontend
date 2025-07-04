import React, { useContext, useEffect, useState } from "react";
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
  SimpleGrid,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import { login } from "../api/services/authService";
import { useNavigate } from "react-router-dom";
import { loadTokens, saveTokens } from "../api/tokenUtils";
import { MyInputBox } from "../my-components/MyInputBox";
import { CircleUserRound, DoorOpen } from "lucide-react";
import { UserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";

export const LoginForm1 = () => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [inputCaptha, setInputCaptha] = useState("");
  const { setUser } = useContext(UserContext);

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

  const createCaptchaImage = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const rotations = [-15, -10, -5, 0, 5, 10, 15];
    const colors = ["green", "red", "brown", "blue", "purple"];
    const fonts = ["Arial", "Verdana", "Georgia", "monospace", "cursive"];
    const rndText = Math.random().toString(36).substring(2, 7); // 5 حرف
    canvas.width = 150;
    canvas.height = 80;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let i = 0; i < rndText.length; i++) {
      const char = rndText[i];
      const rndX = 25 + i * 25;
      const rndY = 40;
      const rndFontSize = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
      const rndFont = fonts[Math.floor(Math.random() * fonts.length)];
      const rndColor = colors[Math.floor(Math.random() * colors.length)];
      const rndRotate = rotations[Math.floor(Math.random() * rotations.length)];
      ctx.save(); // ذخیره حالت فعلی
      ctx.translate(rndX, rndY); // انتقال مرکز چرخش
      ctx.rotate((rndRotate * Math.PI) / 180); // چرخش به رادیان
      ctx.font = `bold ${rndFontSize}px ${rndFont}`;
      ctx.fillStyle = rndColor;
      ctx.fillText(char, 0, 0);
      ctx.restore(); // بازگشت به حالت اولیه
    }

    const dataUrl = canvas.toDataURL("image/png");
    setCaptcha(rndText);
    setCaptchaImage(dataUrl);
  };

  const handleGeneratCaptcha = async () => {
    await createCaptchaImage();
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

    if (showCaptcha && inputCaptha != captcha) {
      toast({
        title: "خطا",
        description: "کد تصادفی صحیح نیست",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      handleGeneratCaptcha();
      setInputCaptha("");
      setForm({ username: "", password: "", userLocation: "" });
      return;
    }
    setIsFormDisabled(true);
    try {
      const res = await login(form);
      if (!res.success) {
        setShowCaptcha(true);
        setInputCaptha("");
        setForm({ username: "", password: "", userLocation: "" });
        handleGeneratCaptcha();
        setIsFormDisabled(false);
        toast({
          title: "خطا",
          description: res?.error,
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
        status: "success",
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
        console.log(res.data.accessToken, res?.data?.mobilnumber);

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

  return (
    <SimpleGrid
      bg="#2E2E2E"
      filter={isFormDisabled ? "blur(10px)" : ""}
      spacing={0}
      columns={{ base: 1, md: 1, lg: 4 }}
      height="98vh"
      width="99%"
      m={"auto"}
      mt={2}
      mb={2}
      p={isDesktop ? 5 : 0}
      borderColor="teal"
      borderWidth={!isDesktop ? "1px" : ""}
      borderRadius={!isDesktop ? "lg" : ""}
    >
      <Box />
      <Box
        boxShadow="#138d75 0px 5px 10px 0px"
        bgImage="url(/assets/images/bg/login.svg)"
        bgSize={"contain"}
        bgRepeat="no-repeat"
        bgPosition={"center"}
        p={8}
        borderWidth={isDesktop ? 1 : 0}
        borderRightWidth={0}
        borderLeftRadius={isDesktop ? "lg" : ""}
        borderColor="teal.400"
      />
      <Box
        boxShadow="#138d75 0px 5px 10px 0px"
        p={8}
        borderWidth={isDesktop ? 1 : 0}
        borderLeftWidth={isDesktop ? 1 : 0}
        borderRightRadius={isDesktop ? "lg" : ""}
        borderLeftRadius={isDesktop ? "" : "lg"}
        dir="rtl"
        borderColor="teal.400"
      >
        <VStack as="form" spacing={5} onSubmit={handleSubmit}>
          <CircleUserRound
            size={100}
            color="teal"
            strokeWidth={1}
            style={{ transition: "0.3s", filter: "" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.filter =
                "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))")
            }
            onMouseOut={(e) => (e.currentTarget.style.filter = "")}
          />

          <Box>
            <Heading
              fontFamily="Vaziri"
              size="lg"
              mb={3}
              textAlign="center"
              color="white"
            >
              به حسابیار خوش آمدید
            </Heading>
            <Heading
              fontFamily="Vaziri"
              size="xs"
              mb={1}
              textAlign="center"
              color="whiteAlpha.500"
            >
              سامانه دستیار سیستم های حسابداری
            </Heading>
          </Box>
          <FormControl textColor="white" isRequired>
            <FormLabel hidden={!isDesktop}>نام کاربری</FormLabel>
            <Input
              colorScheme="teal"
              name="username"
              type="text"
              variant="flushed"
              value={form.username}
              onChange={handleChange}
              placeholder="نام کاربری"
            />
          </FormControl>

          <FormControl textColor="white" isRequired>
            <FormLabel hidden={!isDesktop}>کلمه عبور</FormLabel>

            <MyInputBox
              colorScheme="teal"
              type="password"
              variant="flushed"
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
                  dir="ltr"
                  width="50%"
                  colorScheme="blue"
                  name="captcha"
                  type="text"
                  variant="flushed"
                  value={inputCaptha}
                  onChange={(e) => handleChangeCaptcha(e.target.value)}
                  placeholder="کد تصویر مقابل را وارد کنید"
                />
                <Box
                  p="2px"
                  width="150px"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="black"
                  onClick={() => handleGeneratCaptcha()}
                >
                  <Image
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    src={captchaImage}
                    onClick={() => handleGeneratCaptcha()}
                  />
                </Box>
              </Flex>
            </FormControl>
          )}
          <Button
            colorScheme="teal"
            variant="outline"
            leftIcon={<DoorOpen />}
            type="submit"
            width="full"
            disabled={isFormDisabled}
          >
            ورودبه حسابیار
          </Button>
        </VStack>
        <Divider marginTop={10} marginBottom={5} />

        <VStack spacing={2}>
          <Link
            mr="auto"
            ml="auto"
            href="#"
            onClick={handleClick}
            textColor="blue.300"
          >
            فراموشی نام کاربری/رمز
          </Link>
          <Link
            mr="auto"
            ml="auto"
            href="#"
            onClick={handleHomeClick}
            textColor="blue.300"
          >
            خانه
          </Link>
        </VStack>
      </Box>
      <Box></Box>
    </SimpleGrid>
  );
};
