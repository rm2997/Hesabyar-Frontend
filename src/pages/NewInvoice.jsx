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
  VStack,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard } from "lucide-react";
import { useState } from "react";

export const NewInvoice = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    totalAmount: 0,
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card m={10}>
      <CardHeader>ثبت فاکتور جدید</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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

            <Button colorScheme="blue" type="submit">
              تایید
            </Button>
          </VStack>
        </form>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
