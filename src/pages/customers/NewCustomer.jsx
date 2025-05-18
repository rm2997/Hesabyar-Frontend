import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  SimpleGrid,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  IdCard,
  Mailbox,
  Phone,
  Smartphone,
  SquareCheckBig,
} from "lucide-react";
import { useState } from "react";
import { CreateCustomer } from "../../api/services/customerService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";

export const NewCustomer = ({ isDesktop }) => {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await CreateCustomer(formData);
      if (!response.data) return;
      setFormData({
        customerFName: "",
        customerLName: "",
        customerNationalCode: "",
        customerPhone: "",
        customerAddress: "",
        customerMobile: "",
        customerPostalCode: "",
      });
      toast({
        title: "ثبت شد",
        description: `اطلاعات مشتری ذخیره شد`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "خطایی رخ داد",
        description: `${err}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card m={10}>
      <CardHeader
        bg="#68C15A"
        borderBottomColor="gray.400"
        borderBottomWidth="1px"
        borderTopRadius={5}
        color="black"
      >
        ثبت مشتری جدید
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
            spacing={4}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  نام مشتری
                </FormLabel>
                <MyInputBox
                  icon={IdCard}
                  name="customerFName"
                  title="نام"
                  size={19}
                  value={formData.customerFName}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  نام خانوادگی
                </FormLabel>
                <MyInputBox
                  icon={IdCard}
                  name="customerLName"
                  title="نام خانوادگی"
                  size={19}
                  value={formData.customerLName}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  شماره ملی
                </FormLabel>
                <MyInputBox
                  type="number"
                  icon={IdCard}
                  name="customerNationalCode"
                  title="شماره ملی"
                  size={19}
                  value={formData.customerNationalCode}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>

            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  شماره تلفن
                </FormLabel>
                <MyInputBox
                  type="number"
                  icon={Phone}
                  name="customerPhone"
                  title="شماره تلفن"
                  size={19}
                  value={formData.customerPhone}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  شماره موبایل
                </FormLabel>
                <MyInputBox
                  type="number"
                  icon={Smartphone}
                  name="customerMobile"
                  title="شماره موبایل"
                  size={19}
                  value={formData.customerMobile}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  کد پستی
                </FormLabel>
                <MyInputBox
                  type="number"
                  icon={Mailbox}
                  name="customerPostalCode"
                  title="کد پستی"
                  size={19}
                  value={formData.customerPostalCode}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>
          </SimpleGrid>
          <FormControl isRequired>
            <HStack>
              <FormLabel hidden={!isDesktop} width="120px">
                آدرس
              </FormLabel>
              <Textarea
                placeholder="آدرس"
                name="customerAddress"
                resize="horizontal"
                size="lg"
                minW="250px"
                maxW="1045px"
                value={formData.customerAddress}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
          <Button
            leftIcon={<SquareCheckBig />}
            colorScheme="blue"
            type="submit"
            isLoading={loading}
          >
            تایید
          </Button>
        </Flex>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
