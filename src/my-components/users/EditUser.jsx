import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { IdCard, Phone, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../MyLoading";
import { UpdateUser } from "../../api/services/userService";
import { UserRoles } from "../../api/services/enums/roles.enum";

export const EditUser = ({ isDesktop, user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    id: 0,
    role: "",
    username: "",
    userfname: "",
    userlname: "",
    twoFactorAuthntication: false,
    usermobilenumber: "",
  });
  //const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await UpdateUser(formData.id, formData);
    if (!res.success) {
      setLoading(false);
      toast({
        title: "خطا",
        description: `${res.error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onUpdate(res.data);
    setFormData({
      id: 0,
      role: "",
      username: "",
      userfname: "",
      userlname: "",
      twoFactorAuthntication: false,
      usermobilenumber: "",
    });
    toast({
      title: "ثبت شد",
      description: `اطلاعات کاربر ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    setLoading(false);
  };

  const handleChangeFormData = (e) => {
    console.log(e.target.checked);
    if (e.target.name == "twoFactorAuthntication")
      setFormData({
        ...formData,
        twoFactorAuthntication: e.target.checked,
      });
    else
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
  };

  return (
    <Flex m={1} direction="column">
      <Box filter={loading ? "blur(10px)" : ""}>
        <Flex direction="column" gap={10} as="form" onSubmit={handleSubmit}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
            spacing={8}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  نام کاربری
                </FormLabel>
                <MyInputBox
                  icon={IdCard}
                  name="username"
                  title="نام کاربری"
                  size={30}
                  value={formData.username}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="135px">
                  نقش کاربری
                </FormLabel>
                <Select
                  placeholder="یک نقش انتخاب کنید"
                  dir="ltr"
                  value={formData?.role}
                  name="role"
                  maxW="900px"
                  onChange={handleChangeFormData}
                >
                  {UserRoles.map((r) => (
                    <option key={r?.key} value={r?.value}>
                      {r?.value}
                    </option>
                  ))}
                </Select>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  نام
                </FormLabel>
                <MyInputBox
                  icon={IdCard}
                  name="userfname"
                  title="نام"
                  size={30}
                  value={formData?.userfname}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  نام خانوادگی
                </FormLabel>
                <MyInputBox
                  icon={IdCard}
                  name="userlname"
                  title="نام خانوادگی"
                  size={30}
                  value={formData.userlname}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  شماره موبایل
                </FormLabel>
                <MyInputBox
                  icon={Phone}
                  name="usermobilenumber"
                  title="شماره موبایل"
                  size={30}
                  value={formData.usermobilenumber}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>

            <FormControl>
              <HStack>
                <FormLabel htmlFor="twoFactorAuthntication" width="140px">
                  ورود دو مرحله ای
                </FormLabel>
                <Switch
                  title="ورود دو مرحله ای"
                  ml="auto"
                  id="twoFactorAuthntication"
                  name="twoFactorAuthntication"
                  isChecked={formData.twoFactorAuthntication}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
          </SimpleGrid>
          <Button
            leftIcon={<SquareCheckBig />}
            colorScheme="blue"
            type="submit"
            isLoading={loading}
          >
            تایید
          </Button>
        </Flex>
      </Box>
      {loading && <MyLoading />}
    </Flex>
  );
};
