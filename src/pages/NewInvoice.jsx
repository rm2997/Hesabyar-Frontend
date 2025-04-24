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
      <CardHeader
        bg="#68C15A"
        borderBottomColor="gray.400"
        borderBottomWidth="1px"
        borderTopRadius={5}
        color="black"
      >
        ثبت فاکتور جدید
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <HStack>
                <FormLabel width="90px">ردیف</FormLabel>
                <InputGroup>
                  <InputRightElement
                    borderLeftColor="gray.200"
                    borderLeftWidth={1}
                  >
                    <Icon as={Hash} color="gray" />
                  </InputRightElement>
                  <Input
                    placeholder="ردیف"
                    htmlSize={19}
                    width="auto"
                    pr="2.8rem"
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
                    <Icon as={IdCard} color="gray" />
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
                    <Icon as={DollarSign} pointerEvents="none" color="gray" />
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
