import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { IdCard, Phone, SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { CreateCustomer } from "../../api/services/customerService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";

export const NewCustomer = () => {
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
        <VStack as="form" spacing={5} onSubmit={handleSubmit}>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="100px">نام مشتری</FormLabel>
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
              <FormLabel width="100px">نام خانوادگی</FormLabel>
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
              <FormLabel width="100px">شماره ملی</FormLabel>
              <MyInputBox
                icon={IdCard}
                name="customerNationalCode"
                title="شماره ملی"
                size={19}
                value={formData.customerNationalCode}
                onChange={handleChangeFormData}
              ></MyInputBox>
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <HStack>
              <FormLabel width="100px">شماره تلفن</FormLabel>
              <MyInputBox
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
              <FormLabel width="90px">آدرس</FormLabel>
              <Textarea
                placeholder="آدرس"
                name="customerAddress"
                resize="horizontal"
                size="lg"
                w="auto"
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
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
