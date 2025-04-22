import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
      <CardHeader>ثبت پیش فاکتور جدید</CardHeader>
      <CardBody>
        <VStack as="form" spacing={4} onSubmit={handleSubmit}>
          <FormControl>
            <InputGroup>
              <InputRightElement>
                <Hash color="gray" />
              </InputRightElement>
              <Input placeholder="ردیف" htmlSize={19} width="auto" />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <IdCard />
              </InputRightElement>
              <Input
                name="customerName"
                placeholder="نام مشتری"
                type="text"
                htmlSize={19}
                width="auto"
                value={formData.customerName}
                onChange={handleChangeFormData}
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <DollarSign pointerEvents="none" />
              </InputRightElement>
              <Input
                name="totalAmount"
                placeholder="مبلغ نهایی"
                type="number"
                htmlSize={19}
                width="auto"
                value={formData.totalAmount}
                onChange={handleChangeFormData}
              />
            </InputGroup>
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
