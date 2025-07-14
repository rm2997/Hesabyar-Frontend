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
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DollarSign, Info, Package2, SquareCheckBig } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateGood } from "../../api/services/goodsService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowAllUnits } from "../../api/services/unitsService";

export const NewGood = ({ isDesktop }) => {
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
      const res = await ShowAllUnits();
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
      setUnits(res?.data?.items);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setLoading(true);
      const response = await CreateGood(formData);
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
      setLoading(false);
    } catch (err) {
      toast({
        title: "خطایی رخ داد",
        description: `${err}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Card m={1} filter={loading ? "blur(10px)" : ""}>
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            ثبت کالای جدید
          </CardHeader>
        )}
        <CardBody borderTopWidth={2}>
          <VStack
            align={"stretch"}
            direction={["column", "row"]}
            as="form"
            spacing={5}
            onSubmit={handleSubmit}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  نام کالا
                </FormLabel>
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
                <FormLabel hidden={!isDesktop} width="170px">
                  واحد اندازه گیری
                </FormLabel>
                <Select
                  dir="ltr"
                  name="goodUnit"
                  placeholder="یک واحد انتخاب کنید"
                  value={formData.goodUnit}
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
                <FormLabel hidden={!isDesktop} width="170px">
                  قیمت
                </FormLabel>
                <MyInputBox
                  icon={DollarSign}
                  name="goodPrice"
                  title="قیمت"
                  value={formData.goodPrice}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  توضیحات
                </FormLabel>
                <MyInputBox
                  icon={Info}
                  name="goodInfo"
                  title="توضیحات"
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
      {loading && <MyLoading />}
    </Box>
  );
};
