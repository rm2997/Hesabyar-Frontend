import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { IdCard, SquareCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowGoodByID, UpdateGood } from "../api/services/goodsService";
import { MyLoading } from "./MyLoading";
import { MyInputBox } from "./MyInputBox";

export const EditGood = ({ id, onClose, onUpdate, Good }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

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
        console.log({ ...result });
        onUpdate(result.data);
        setFormData({
          GoodFName: "",
          GoodLName: "",
          GoodNationalCode: "",
          GoodPhone: "",
          GoodAddress: "",
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
    <VStack as="form" spacing={2} onSubmit={handleSubmit} dir="rtl">
      {loading} && <MyLoading />
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
  );
};
