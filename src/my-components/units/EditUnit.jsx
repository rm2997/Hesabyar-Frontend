import {
  AbsoluteCenter,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Info, Ruler, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowUnitByID, UpdateUnit } from "../../api/services/unitsService";
import { MyInputBox } from "../MyInputBox";
import { MyLoading } from "../MyLoading";
export const EditUnit = ({ id, onClose, onUpdate, Unit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      const res = await ShowUnitByID(id);
      if (!res.success) {
        toast({
          title: "خطایی در بارگزاری داده ها",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setFormData({ ...res.data });
      setLoading(false);
    };
    loadFormData(id);
  }, [id]);

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    const result = await UpdateUnit(formData.id, formData);
    if (!result.success) {
      toast({
        title: "خطایی رخ داد",
        description: result.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    onUpdate(result.data);
    setFormData({
      unitName: "",
      unitInfo: "",
    });

    toast({
      title: "ثبت شد",
      description: `اطلاعات واحد بروزرسانی شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    setLoading(false);
  };

  return (
    <Box>
      <VStack
        filter={loading ? "blur(10px)" : ""}
        as="form"
        rowGap={8}
        onSubmit={handleSubmit}
        dir="rtl"
        px={2}
      >
        <FormControl isRequired>
          <HStack>
            <FormLabel width="150px">نام واحد</FormLabel>
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
        <FormControl>
          <HStack>
            <FormLabel width="150px">توضیحات</FormLabel>
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
          width="full"
        >
          تایید
        </Button>
      </VStack>
      {loading && <MyLoading />}
    </Box>
  );
};
