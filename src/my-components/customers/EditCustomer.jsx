import {
  AbsoluteCenter,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  IdCard,
  Mailbox,
  Phone,
  Smartphone,
  SquareCheckBig,
} from "lucide-react";
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
    const result = await UpdateCustomer(formData.id, formData);
    if (!result.success) {
      toast({
        title: "خطایی رخ داد",
        description: result.error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

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
    setLoading(false);
  };

  return (
    <Box>
      <Flex
        filter={loading ? "blur(10px)" : ""}
        direction="column"
        gap={4}
        as="form"
        onSubmit={handleSubmit}
      >
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
          rowGap={4}
          columnGap={4}
        >
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
                value={formData.customerFName}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="150px">نام خانوادگی</FormLabel>
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
              <FormLabel width="150px">شماره ملی</FormLabel>
              <MyInputBox
                icon={IdCard}
                name="customerNationalCode"
                title="شماره ملی"
                value={formData.customerNationalCode}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="150px">شماره موبایل</FormLabel>
              <MyInputBox
                icon={Smartphone}
                name="customerMobile"
                title="شماره موبایل"
                value={formData.customerMobile}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack>
              <FormLabel width="150px">شماره تلفن</FormLabel>
              <MyInputBox
                icon={Phone}
                name="customerPhone"
                title="شماره تلفن"
                value={formData.customerPhone}
                onChange={handleChangeFormData}
              />
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
                value={formData.customerPostalCode}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
        </SimpleGrid>
        <FormControl isRequired>
          <HStack>
            <FormLabel width="160px">آدرس</FormLabel>
            <Textarea
              placeholder="آدرس"
              name="customerAddress"
              resize="horizontal"
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
      {loading && <MyLoading />}
    </Box>
  );
};
