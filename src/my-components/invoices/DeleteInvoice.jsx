import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, DollarSign, Hash, IdCard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  RemoveInvoice,
  ShowInvoicesByID,
} from "../../api/services/invoiceService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";

export const DeleteInvoice = ({ id, onClose }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await RemoveInvoice(formData.id)
      .then((result) => {
        setFormData({
          id: "",
          customerName: "",
          totalAmount: "",
        });
        onClose();
        toast({
          title: "حذف شد",
          description: `فاکتور شما با موفقیت حذف شد`,
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
            title="کد"
            value={formData.id}
            icon={Hash}
            size={19}
          />
        </HStack>
      </FormControl>
      <FormControl isRequired isDisabled>
        <HStack>
          <FormLabel width={110}>نام مشتری</FormLabel>
          <MyInputBox
            name="customerName"
            title="نام مشتری"
            value={formData.customerName}
            icon={IdCard}
            size={19}
          />
        </HStack>
      </FormControl>
      <FormControl isRequired isDisabled>
        <HStack>
          <FormLabel width={110}>مبلغ نهایی</FormLabel>
          <MyInputBox
            name="totalAmount"
            title="مبلغ نهایی"
            value={formData.totalAmount}
            icon={IdCard}
            size={19}
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
