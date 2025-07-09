import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Info, Ruler, SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { CreateUnit } from "../../api/services/unitsService";
import { MyInputBox } from "../../my-components/MyInputBox";

export const NewUnit = ({ isDesktop }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await CreateUnit(formData);
    setLoading(true);
    if (!response.success) {
      toast({
        title: "خطایی رخ داد",
        description: response.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setFormData({
      unitName: "",
      unitUnit: "",
      unitInfo: "",
    });
    toast({
      title: "ثبت شد",
      description: `اطلاعات واحد ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card m={10} filter={loading ? "blur(10px)" : ""}>
      <CardHeader
        bg="#68C15A"
        borderBottomColor="gray.400"
        borderBottomWidth="1px"
        borderTopRadius={5}
        color="black"
      >
        ثبت واحد جدید
      </CardHeader>
      <CardBody borderTopWidth={2}>
        <VStack
          align={"stretch"}
          direction={["column", "row"]}
          as="form"
          rowGap={8}
          px={5}
          onSubmit={handleSubmit}
        >
          <FormControl isRequired>
            <HStack>
              <FormLabel hidden={!isDesktop} width="150px">
                نام واحد
              </FormLabel>
              <MyInputBox
                icon={Ruler}
                name="unitName"
                title="نام واحد"
                size={19}
                value={formData.unitName}
                onChange={handleChangeFormData}
              ></MyInputBox>
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack>
              <FormLabel hidden={!isDesktop} width="150px">
                توضیحات
              </FormLabel>
              <MyInputBox
                icon={Info}
                name="unitInfo"
                title="توضیحات"
                size={19}
                value={formData.unitInfo}
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
