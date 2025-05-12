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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { IdCard, MapPin, Phone, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ShowCustomerByID,
  UpdateCustomer,
} from "../../api/services/customerService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";

export const EditCustomer = ({ id, onClose, onUpdate, customer }) => {
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
        onUpdate(result.data);
        setFormData({
          customerFName: "",
          customerLName: "",
          customerNationalCode: "",
          customerPhone: "",
          customerAddress: "",
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
    <VStack as="form" spacing={2} onSubmit={handleSubmit} dir="rtl">
      {loading} && <MyLoading />
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
      <FormControl isRequired>
        <HStack>
          <FormLabel width="110px">آدرس</FormLabel>
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
  );
};
