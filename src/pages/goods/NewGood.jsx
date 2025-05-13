import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  DollarSign,
  IdCard,
  Info,
  Package2,
  SquareCheckBig,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CreateGood } from "../../api/services/goodsService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { ShowAllUnits } from "../../api/services/unitsService";

export const NewGood = () => {
  const [units, setUnits] = new useState([]);
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await ShowAllUnits()
        .then((res) => setUnits(res.data))
        .finally(setLoading(false));
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await CreateGood(formData);
      if (!response.data) return;
      setFormData({
        goodName: "",
        goodUnit: "",
        goodPrice: "",
        goodInfo: "",
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
              <FormLabel width="170px">نام کالا</FormLabel>
              <MyInputBox
                icon={Package2}
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
              <Select
                dir="ltr"
                name="goodUnit"
                w={295}
                placeholder="انتخاب کنید"
                value={formData.goodUnit}
                onChange={handleChangeFormData}
              >
                {units.map((unit) => (
                  <option value={unit.id} key={unit.id}>
                    {unit.unitName}
                  </option>
                ))}
              </Select>
              {/* <MyInputBox
                icon={IdCard}
                name="goodUnit"
                title="واحد اندازه گیری"
                size={19}
                value={formData.goodUnit}
                onChange={handleChangeFormData}
              ></MyInputBox> */}
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack>
              <FormLabel width="170px">قیمت</FormLabel>
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
              <FormLabel width="170px">توضیحات</FormLabel>
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
          >
            تایید
          </Button>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
