import {
  AbsoluteCenter,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { DollarSign, Info, Package2, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowGoodByID, UpdateGood } from "../../api/services/goodsService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";
import { ShowAllUnits } from "../../api/services/unitsService";

export const EditGood = ({ id, onClose, onUpdate, Good }) => {
  const [units, setUnits] = new useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await ShowAllUnits();
      if (!res?.success) {
        toast({
          title: "خطایی در بارگزاری واحدها",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setUnits(res?.data?.items);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      const res = await ShowGoodByID(id);
      if (!res.success) {
        toast({
          title: "خطایی رخ داد",
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
        description: "اطلاعات کالا باید تکمیل گردد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.goodName?.trim().length < 2) {
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
      formData?.goodName?.trim().length > 0 &&
      !isNaN(Number(formData?.goodName))
    ) {
      toast({
        title: "توجه",
        description: "نام کالا باید از جنس حروف باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (isNaN(Number(formData?.goodPrice))) {
      toast({
        title: "توجه",
        description: "قیمت کالا صحیح نیست",
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

    const res = await UpdateGood(formData.id, formData);
    if (!res.success) {
      toast({
        title: "خطایی رخ داد",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    onUpdate(res.data);
    setFormData({
      goodName: "",
      goodUnit: "",
      goodPrice: "",
      goodInfo: "",
    });

    toast({
      title: "ثبت شد",
      description: `اطلاعات کالا بروزرسانی شد`,
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
        as="form"
        filter={loading ? "blur(10px)" : ""}
        rowGap={8}
        onSubmit={handleSubmit}
        dir="rtl"
        px={1}
      >
        <FormControl isRequired>
          <HStack>
            <FormLabel width="100px">نام کالا</FormLabel>
            <MyInputBox
              icon={Package2}
              name="goodName"
              title="نام کالا"
              value={formData?.goodName}
              onChange={handleChangeFormData}
            ></MyInputBox>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <HStack>
            <FormLabel width="100px">واحد</FormLabel>
            <Select
              dir="ltr"
              placeholder="یک واحد انتخاب کنید"
              value={formData?.goodUnit?.id}
              name="goodUnit"
              onChange={handleChangeFormData}
            >
              {units.map((unit) => (
                <option value={unit?.id} key={unit?.id}>
                  {unit?.unitName}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel width="100px">قیمت</FormLabel>
            <MyInputBox
              isInvalid={
                formData?.goodPrice?.length > 0 &&
                (isNaN(Number(formData?.goodPrice)) || formData?.goodPrice == 0)
              }
              icon={DollarSign}
              name="goodPrice"
              title="قیمت"
              size={19}
              value={formData?.goodPrice}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) e.target.value = 0;
                handleChangeFormData(e);
              }}
            ></MyInputBox>
          </HStack>
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel width="100px">توضیحات</FormLabel>
            <MyInputBox
              icon={Info}
              name="goodInfo"
              title="توضیحات"
              size={19}
              value={formData?.goodInfo}
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
