import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DollarSign, Hash, IdCard } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowProformasByID } from "../api/services/proformaService";
import { MyLoading } from "./MyLoading";

export const EditProforma = ({ id, setId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      await ShowProformasByID(id)
        .then((result) => {
          console.log("Proforma Data is:" + result);
          setFormData({ ...result });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    console.log(`Proforma ID is:${id}`);

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
    // const response = await createProforma(formData)
    //   .then((result) => {})
    //   .catch((err) => {
    //     if (err.status === 401) navigate("/login");
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  if (loading) {
    return <MyLoading />;
  } else
    return (
      <VStack as="form" spacing={5} onSubmit={handleSubmit}>
        <FormControl isRequired isDisabled>
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
    );
};
