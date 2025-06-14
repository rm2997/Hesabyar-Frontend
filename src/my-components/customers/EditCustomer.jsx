import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { IdCard, Mailbox, Phone, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ShowCustomerByID,
  UpdateCustomer,
} from "../../api/services/customerService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";

export const EditCustomer = ({ id, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      await ShowCustomerByID(id)
        .then((result) => {
          setFormData({ ...result.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    loadFormData(id);
  }, [id]);

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await UpdateCustomer(formData.id, formData)
      .then((result) => {
        console.log({ ...result });
        onUpdate(id, result.data);
        setFormData({
          customerFName: "",
          customerLName: "",
          customerNationalCode: "",
          customerPhone: "",
          customerMobile: "",
          customerAddress: "",
          customerPostalCode: "",
          customerGender: "",
        });

        toast({
          title: "ثبت شد",
          description: `اطلاعات مشتری بروزرسانی شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      })
      .catch((err) => {
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
        spacing={4}
      >
        {loading && <MyLoading />}
        <FormControl isRequired>
          <HStack>
            <FormLabel width="150px">هویت</FormLabel>
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
            <FormLabel width="150px">نام مشتری</FormLabel>
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
            <FormLabel width="150px">نام خانوادگی</FormLabel>
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
            <FormLabel width="150px">شماره ملی</FormLabel>
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
            <FormLabel width="150px">شماره موبایل</FormLabel>
            <MyInputBox
              icon={Phone}
              name="customerMobile"
              title="شماره موبایل"
              size={19}
              value={formData.customerMobile}
              onChange={handleChangeFormData}
            ></MyInputBox>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <HStack>
            <FormLabel width="150px">شماره تلفن</FormLabel>
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
        <FormControl>
          <HStack>
            <FormLabel width="150px">کد پستی</FormLabel>
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
          <FormLabel width="128px">آدرس</FormLabel>
          <Textarea
            placeholder="آدرس"
            name="customerAddress"
            resize="horizontal"
            size="lg"
            maxW="780px"
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
  );
};
