import {
  Box,
  Button,
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MyInputBox } from "../../my-components/MyInputBox";
import { useEffect, useState } from "react";
import { Database, KeyIcon, Network, User2 } from "lucide-react";
import {
  getSepidarConnectionData,
  sepidarTest,
} from "../../api/services/sepidarService";

export default function SepidarConnection() {
  const [formError, setFormError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadCnnData = async () => {
      setLoading(true);
      const res = await getSepidarConnectionData();
      if (!res.success) {
        toast({
          title: "خطایی رخ داد",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFormData(res?.data);
      setLoading(false);
    };
    loadCnnData();
  }, []);

  const validateForm = async (data) => {
    if (!data?.ip || data.ip.length < 7) {
      return { result: false, msg: "آدرس سرور را مشخص کنید", field: "ip" };
    }
    if (!data?.databaseName || data.databaseName.length < 2) {
      return {
        result: false,
        msg: "نام دیتابیس را مشخص کنید",
        field: "databaseName",
      };
    }
    if (!data?.userName || data.userName.length < 2) {
      return {
        result: false,
        msg: "نام کاربری را مشخص کنید",
        field: "userName",
      };
    }
    if (!data?.password || data.password.length < 3) {
      return { result: false, msg: "رمز را مشخص کنید", field: "password" };
    }
    return { result: true, msg: "", field: "" };
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const testConnection = async (e) => {
    e.preventDefault();
    const validation = await validateForm(formData);
    setFormError(validation.msg);
    setErrorField(validation.field);
    if (validation.result == false) {
      toast({
        title: "توجه",
        description: validation.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const res = await sepidarTest();
    if (!res.success) {
      toast({
        title: "خطایی رخ داد",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (res?.data?.result == "connected")
      toast({
        title: "موفق",
        description: "ارتباط با سپیدار برقرار است",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    else
      toast({
        title: "نا موفق",
        description: "ارتباط با سپیدار برقرار نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
  };

  return (
    <Box mt={5} flex="1" overflowY="auto">
      <Flex direction="column" as="form" onSubmit={testConnection} px={2}>
        <Box borderTopRadius="md" p={3} w="full" bg="#68C15A">
          <Text>بررسی اتصال به سپیدار</Text>
        </Box>
        <SimpleGrid
          textColor="black"
          columns={{ base: 1, sm: 1, md: 2 }}
          gap={5}
          bg="white"
          p={5}
          borderBottomRadius="md"
          boxShadow={"md"}
        >
          <FormControl isRequired isInvalid={errorField == "ip"}>
            <Flex direction="row" gap={3}>
              <Text
                fontFamily="iransans"
                fontSize={["12px", "12px", "14px", "14px"]}
                flex={1}
              >
                آدرس IP
              </Text>
              <Box flex={3}>
                <MyInputBox
                  dir="ltr"
                  onChange={handleChangeFormData}
                  name="ip"
                  value={formData.ip}
                  colorScheme="blue"
                  icon={Network}
                />
              </Box>
            </Flex>
          </FormControl>
          <FormControl isRequired isInvalid={errorField == "databaseName"}>
            <Flex direction="row" gap={3}>
              <Text
                fontFamily="iransans"
                fontSize={["12px", "12px", "14px", "14px"]}
                flex={1}
              >
                نام دیتابیس
              </Text>
              <Box flex={3}>
                <MyInputBox
                  name="databaseName"
                  onChange={handleChangeFormData}
                  value={formData.databaseName}
                  dir="ltr"
                  icon={Database}
                />
              </Box>
            </Flex>
          </FormControl>
          <FormControl isRequired isInvalid={errorField == "userName"}>
            <Flex direction="row" gap={3}>
              <Text
                fontFamily="iransans"
                fontSize={["12px", "12px", "14px", "14px"]}
                flex={1}
              >
                نام کاربری
              </Text>
              <Box flex={3}>
                <MyInputBox
                  name="userName"
                  onChange={handleChangeFormData}
                  value={formData.userName}
                  dir="ltr"
                  icon={User2}
                />
              </Box>
            </Flex>
          </FormControl>
          <FormControl isRequired isInvalid={errorField == "password"}>
            <Flex direction="row" gap={3}>
              <Text
                fontFamily="iransans"
                fontSize={["12px", "12px", "14px", "14px"]}
                flex={1}
              >
                رمز
              </Text>
              <Box flex={3}>
                <MyInputBox
                  name="password"
                  onChange={handleChangeFormData}
                  value={formData.password}
                  type={"password"}
                  dir="ltr"
                  icon={KeyIcon}
                />
              </Box>
            </Flex>
          </FormControl>
          <Text
            align={"center"}
            alignContent={"center"}
            color="red.500"
            fontFamily="iransans"
            fontSize={"12px"}
          >
            {formError}
          </Text>
          <Button
            w="full"
            variant={"solid"}
            colorScheme="blue"
            type="submit"
            isLoading={loading}
          >
            بررسی ارتباط
          </Button>
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
