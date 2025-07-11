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
      if (!res.success) {
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
      setUnits(res.data.items);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      await ShowGoodByID(id)
        .then((result) => {
          setFormData({ ...result.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
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

    await UpdateGood(formData.id, formData)
      .then((result) => {
        onUpdate(result.data);
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
      })
      .catch((err) => {
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
              value={formData.goodName}
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
              value={formData.goodUnit?.id}
              name="goodUnit"
              onChange={handleChangeFormData}
            >
              {units.map((unit) => (
                <option value={unit.id} key={unit.id}>
                  {unit.unitName}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <HStack>
            <FormLabel width="100px">قیمت</FormLabel>
            <MyInputBox
              icon={DollarSign}
              name="goodPrice"
              title="قیمت"
              size={19}
              value={formData.goodPrice}
              onChange={handleChangeFormData}
            ></MyInputBox>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <HStack>
            <FormLabel width="100px">توضیحات</FormLabel>
            <MyInputBox
              icon={Info}
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
          width="full"
        >
          تایید
        </Button>
      </VStack>
      {loading && (
        <AbsoluteCenter>
          <Spinner size="xl" color="red.500" />
        </AbsoluteCenter>
      )}
    </Box>
  );
};
