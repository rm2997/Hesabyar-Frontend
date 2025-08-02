import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Info, Ruler, SquareCheckBig, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateUnit } from "../../api/services/unitsService";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
export const NewUnit = ({ isDesktop }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const validateForm = async () => {
    if (!formData) {
      toast({
        title: "توجه",
        description: "اطلاعات واحد باید تکمیل گردد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.unitName?.trim().length < 2) {
      toast({
        title: "توجه",
        description: "لطفا نام صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.unitName?.trim().length > 0 &&
      !isNaN(Number(formData?.unitName))
    ) {
      toast({
        title: "توجه",
        description: "نام واحد باید از جنس حروف باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((await validateForm()) == false) return;
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
    <Box>
      <Card
        m={1}
        filter={loading ? "blur(10px)" : ""}
        overflowY="auto"
        minH={isDesktop ? "40vh" : "30vh"}
      >
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            ثبت واحد جدید
          </CardHeader>
        )}
        <CardBody borderTopWidth={2}>
          <VStack
            align={"stretch"}
            direction={["column", "row"]}
            as="form"
            rowGap={8}
            px={1}
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
                  value={formData.unitName}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  توضیحات
                </FormLabel>
                <MyInputBox
                  icon={Info}
                  name="unitInfo"
                  title="توضیحات"
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
      {loading && <MyLoading />}
    </Box>
  );
};
