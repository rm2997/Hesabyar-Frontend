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
import {
  ChevronRight,
  IdCard,
  MapPin,
  Phone,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ShowCustomerByID,
  RemoveCustomer,
} from "../api/services/customerService";
import { MyLoading } from "./MyLoading";
import { MyInputBox } from "./MyInputBox";

export const DeleteCustomer = ({ id, onClose, onDelete }) => {
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
    await RemoveCustomer(formData.id)
      .then((result) => {
        onDelete(formData.id);
        setFormData({
          customerFName: "",
          customerLName: "",
          customerNationalCode: "",
          customerPhone: "",
          customerAddress: "",
        });
        onClose();
        toast({
          title: "ثبت شد",
          description: "مشتری موردنظر حذف شد",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
      <FormControl isDisabled>
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
      <FormControl isDisabled>
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
      <FormControl isDisabled>
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
      <FormControl isDisabled>
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
      <FormControl isDisabled>
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
      <HStack>
        <Button leftIcon={<ChevronRight />} onClick={onClose}>
          انصراف
        </Button>
        <Button
          leftIcon={<Trash2 />}
          colorScheme="red"
          type="submit"
          isLoading={loading}
        >
          حذف
        </Button>
      </HStack>
    </VStack>
  );
};
