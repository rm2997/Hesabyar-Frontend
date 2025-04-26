import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ShowProformasByID,
  UpdateProforma,
} from "../api/services/proformaService";
import { MyLoading } from "./MyLoading";
import { MyInputBox } from "./MyInputBox";

export const EditProforma = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      await ShowProformasByID(id)
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
    const response = await UpdateProforma(formData.id, formData)
      .then((result) => {
        setFormData({
          id: "",
          customerName: "",
          totalAmount: "",
        });
        onClose();
        toast({
          title: "ثبت شد",
          description: `اطلاعات پیش فاکتور شما بروزرسانی شد`,
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
    <VStack as="form" spacing={5} onSubmit={handleSubmit} dir="rtl">
      {loading} && <MyLoading />
      <FormControl isRequired isDisabled>
        <HStack>
          <FormLabel width={110}>ردیف</FormLabel>
          <MyInputBox
            name="id"
            size={19}
            icon={Hash}
            title="ردیف"
            value={formData.id}
          />
        </HStack>
      </FormControl>
      <FormControl isRequired>
        <HStack>
          <FormLabel width={110}>نام مشتری</FormLabel>
          <MyInputBox
            onChange={(e) => handleChangeFormData(e)}
            size={19}
            icon={IdCard}
            name="customerName"
            title="نام مشتری"
            value={formData.customerName}
          />
        </HStack>
      </FormControl>
      <FormControl isRequired>
        <HStack>
          <FormLabel width={110}>مبلغ نهایی</FormLabel>
          <MyInputBox
            size={19}
            icon={DollarSign}
            title="مبلغ نهایی"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChangeFormData}
          />
        </HStack>
      </FormControl>
      <HStack>
        <Button onClick={onClose}>انصراف</Button>
        <Button colorScheme="blue" type="submit" isLoading={loading}>
          تایید
        </Button>
      </HStack>
    </VStack>
  );
};
