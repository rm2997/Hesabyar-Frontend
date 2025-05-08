import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { IdCard, Phone, SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { CreateGood } from "../api/services/goodsService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../my-components/MyInputBox";

export const NewGood = () => {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await CreateGood(formData);
      if (!response.data) return;
      setFormData({
        GoodName: "",
        GoodUnit: "",
        GoodInfo: "",
      });
      toast({
        title: "ثبت شد",
        description: `اطلاعات کالا ذخیره شد`,
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
        ثبت کالای جدید
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <VStack as="form" spacing={5} onSubmit={handleSubmit}>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="150px">نام کالا</FormLabel>
              <MyInputBox
                icon={IdCard}
                name="goodName"
                title="نام کالا"
                size={19}
                value={formData.goodName}
                onChange={handleChangeFormData}
              ></MyInputBox>
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="150px">واحد اندازه گیری</FormLabel>
              <MyInputBox
                icon={IdCard}
                name="goodUnit"
                title="واحد اندازه گیری"
                size={19}
                value={formData.goodUnit}
                onChange={handleChangeFormData}
              ></MyInputBox>
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="150px">توضیحات</FormLabel>
              <MyInputBox
                icon={IdCard}
                name="goodInfo"
                title="توضیحات"
                size={19}
                value={formData.goodInfo}
                onChange={handleChangeFormData}
              ></MyInputBox>
            </HStack>
          </FormControl>

          <Button
            leftIcon={<SquareCheckBig />}
            colorScheme="blue"
            type="submit"
            isLoading={loading}
          >
            تایید
          </Button>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
