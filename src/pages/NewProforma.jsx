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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard } from "lucide-react";
import { useState } from "react";
import { createProforma } from "../api/services/proformaService";
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

    const response = await createProforma(formData)
      .then((result) => {})
      .catch((err) => {
        if (err.status === 401) navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
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
        bg="#7bfb32"
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
                <InputRightElement pointerEvents="none">
                  <Icon as={Hash} pointerEvents="none" color="gray.500" />
                </InputRightElement>
                <Input
                  pr="2.5rem"
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
                <InputRightElement pointerEvents="none">
                  <Icon as={IdCard} pointerEvents="none" color="gray.500" />
                </InputRightElement>
                <Input
                  pr="2.5rem"
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
                <InputRightElement pointerEvents="none">
                  <Icon as={DollarSign} pointerEvents="none" color="gray.500" />
                </InputRightElement>
                <Input
                  pr="2.5rem"
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
