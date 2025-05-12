import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ShowInvoicesByID,
  UpdateInvoice,
} from "../../api/services/invoiceService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";

export const EditInvoice = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      await ShowInvoicesByID(id)
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
    await UpdateInvoice(formData.id, formData)
      .then((result) => {
        setFormData({
          id: "",
          customerName: "",
          totalAmount: "",
        });
        onClose();
        toast({
          title: "ثبت شد",
          description: `اطلاعات فاکتور شما بروزرسانی شد`,
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
          <FormLabel width={110}>کد</FormLabel>
          <MyInputBox
            name="id"
            size={19}
            icon={Hash}
            title="کد"
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
