import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard } from "lucide-react";
import { useState } from "react";
import { CreateProforma } from "../api/services/proformaService";
import { useNavigate } from "react-router-dom";

export const NewProForma = () => {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await CreateProforma(formData);
      if (!response.data) return;
      setFormData({
        id: "",
        customerName: "",
        totalAmount: "",
      });
      toast({
        title: "ثبت شد",
        description: `اطلاعات پیش فاکتور شما ذخیره شد`,
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
        ثبت پیش فاکتور جدید
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <VStack as="form" spacing={5} onSubmit={handleSubmit}>
          <FormControl>
            <HStack>
              <FormLabel width="90px">ردیف</FormLabel>
              <InputGroup>
                <InputRightElement
                  pointerEvents="none"
                  borderLeftColor="gray.200"
                  borderLeftWidth={1}
                >
                  <Icon as={Hash} pointerEvents="none" color="gray.500" />
                </InputRightElement>
                <Input
                  pr="2.8rem"
                  placeholder="ردیف"
                  htmlSize={19}
                  width="auto"
                />
              </InputGroup>
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <HStack>
              <FormLabel width="90px">نام مشتری</FormLabel>
              <InputGroup>
                <InputRightElement
                  pointerEvents="none"
                  borderLeftColor="gray.200"
                  borderLeftWidth={1}
                >
                  <Icon as={IdCard} color="gray.500" />
                </InputRightElement>
                <Input
                  pr="2.8rem"
                  name="customerName"
                  placeholder="نام مشتری"
                  type="text"
                  htmlSize={19}
                  width="auto"
                  value={formData.customerName}
                  onChange={handleChangeFormData}
                />
              </InputGroup>
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <HStack>
              <FormLabel width="90px">مبلغ نهایی</FormLabel>
              <InputGroup>
                <InputRightElement
                  pointerEvents="none"
                  borderLeftColor="gray.200"
                  borderLeftWidth={1}
                >
                  <Icon as={DollarSign} color="gray.500" />
                </InputRightElement>
                <Input
                  pr="2.8rem"
                  name="totalAmount"
                  placeholder="مبلغ نهایی"
                  type="number"
                  htmlSize={19}
                  width="auto"
                  value={formData.totalAmount}
                  onChange={handleChangeFormData}
                />
              </InputGroup>
            </HStack>
          </FormControl>

          <Button colorScheme="blue" type="submit" isLoading={loading}>
            تایید
          </Button>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
