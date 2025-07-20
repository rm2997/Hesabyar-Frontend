import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Textarea,
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

import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";

export const NewCustomer = ({ isDesktop }) => {
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(false);

  const toast = useToast();

 
  const validateForm = async () => {
    if (!formData) {
      toast({
        title: "توجه",
        description: "اطلاعات مشتری باید تکمیل گردد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerFName?.trim().length < 2 ) {
      toast({
        title: "توجه",
        description: "لطفا نام صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerLName.trim()?.length < 2 ) {
      toast({
        title: "توجه",
        description: "لطفا نام خانوادگی صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (formData?.customerNationalCode?.trim().length > 0 && (formData?.customerNationalCode.trim()?.length != 10 || isNaN(Number(formData?.customerNationalCode)))) {
      toast({
        title: "توجه",
        description: "کد ملی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerMobile?.trim().length != 11 || isNaN(Number(formData?.customerMobile))) {
      toast({
        title: "توجه",
        description: "موبایل صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerPhone?.trim().length > 0 && (formData?.customerPhone?.trim().length < 5 || isNaN(Number(formData?.customerPhone)))) {
      toast({
        title: "توجه",
        description: "شماره تلفن صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerPostalCode?.trim().length > 0 && (formData?.customerPostalCode?.trim().length != 10 || isNaN(Number(formData?.customerPostalCode)))) {
      toast({
        title: "توجه",
        description: "کد پستی صحیح نیست",
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
    if (await validateForm() == false)
      return;
    setLoading(true);
    console.log(formData);
    const response = await CreateCustomer(formData);
    if (!response.success) {
      toast({
        title: "خطایی رخ داد",
        description: response.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setFormData({
      customerFName: "",
      customerLName: "",
      customerNationalCode: "",
      customerPhone: "",
      customerAddress: "",
      customerMobile: "",
      customerPostalCode: "",
      customerGender: "",
    });
    toast({
      title: "ثبت شد",
      description: `اطلاعات مشتری ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Card
        h="105vh"
        borderWidth={1}
        m={1}
        borderColor="gray.200"
        filter={loading ? "blur(10px)" : ""}
      >
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            ثبت مشتری جدید
          </CardHeader>
        )}
        <CardBody>
          <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
              spacing={4}
            >
              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="150px">
                    هویت
                  </FormLabel>
                  <Select
                    dir="ltr"
                    name="customerGender"
                    placeholder="هویت را انتخاب کنید"
                    value={formData.customerGender}
                    onChange={handleChangeFormData}
                  >
                    <option>شرکت</option>
                    <option>آقای</option>
                    <option>خانم</option>
                  </Select>
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="150px">
                    نام مشتری
                  </FormLabel>
                  <MyInputBox
                    icon={IdCard}
                    name="customerFName"
                    title="نام"
                    value={formData.customerFName}
                    onChange={handleChangeFormData}
                  />
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
                    value={formData.customerLName}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <HStack>
                  <FormLabel hidden={!isDesktop} width="150px">
                    شماره ملی
                  </FormLabel>
                  <MyInputBox
                    maxLength="10"
                    type="number"
                    icon={IdCard}
                    name="customerNationalCode"
                    title="شماره ملی"
                    value={formData.customerNationalCode}
                    onChange={handleChangeFormData}
                  />
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
                    value={formData.customerPostalCode}
                    onChange={handleChangeFormData}
                  />
                </HStack>
              </FormControl>
            </SimpleGrid>
            <FormControl >
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
      {loading && <MyLoading />}
    </Box>
  );
};
