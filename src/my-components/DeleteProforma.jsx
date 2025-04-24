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
import { ChevronRight, DollarSign, Hash, IdCard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  RemoveProforma,
  ShowProformasByID,
} from "../api/services/proformaService";
import { MyLoading } from "./MyLoading";

export const DeleteProforma = ({ id, onClose }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await RemoveProforma(formData.id)
      .then((result) => {
        setFormData({
          id: "",
          customerName: "",
          totalAmount: "",
        });
        onClose();
        toast({
          title: "حذف شد",
          description: ` پیش فاکتور شما با موفقیت حذف شد`,
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
          <InputGroup>
            <InputRightElement
              pointerEvents="none"
              borderLeftColor="gray.200"
              borderLeftWidth={1}
            >
              <Icon as={Hash} pointerEvents="none" color="gray.500" />
            </InputRightElement>
            <Input
              pr="2.9rem"
              placeholder="ردیف"
              htmlSize={19}
              width="auto"
              value={formData.id}
            />
          </InputGroup>
        </HStack>
      </FormControl>
      <FormControl isRequired isDisabled>
        <HStack>
          <FormLabel width={110}>نام مشتری</FormLabel>
          <InputGroup>
            <InputRightElement
              pointerEvents="none"
              borderLeftColor="gray.200"
              borderLeftWidth={1}
            >
              <Icon as={IdCard} pointerEvents="none" color="gray.500" />
            </InputRightElement>
            <Input
              pr="2.9rem"
              name="customerName"
              placeholder="نام مشتری"
              type="text"
              htmlSize={19}
              width="auto"
              value={formData.customerName}
            />
          </InputGroup>
        </HStack>
      </FormControl>
      <FormControl isRequired isDisabled>
        <HStack>
          <FormLabel width={110}>مبلغ نهایی</FormLabel>
          <InputGroup>
            <InputRightElement
              pointerEvents="none"
              borderLeftColor="gray.200"
              borderLeftWidth={1}
            >
              <Icon as={DollarSign} pointerEvents="none" color="gray.500" />
            </InputRightElement>
            <Input
              pr="2.9rem"
              name="totalAmount"
              placeholder="مبلغ نهایی"
              type="number"
              htmlSize={19}
              width="auto"
              value={formData.totalAmount}
            />
          </InputGroup>
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
