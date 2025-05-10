import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, IdCard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowGoodByID, RemoveGood } from "../api/services/goodsService";
import { MyLoading } from "./MyLoading";
import { MyInputBox } from "./MyInputBox";

export const DeleteGood = ({ id, onClose, onDelete }) => {
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
    await RemoveGood(formData.id)
      .then((result) => {
        onDelete(formData.id);
        setFormData({
          GoodFName: "",
          GoodLName: "",
          GoodNationalCode: "",
          GoodPhone: "",
          GoodAddress: "",
        });
        onClose();
        toast({
          title: "ثبت شد",
          description: "کالای موردنظر حذف شد",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
      <FormControl isDisabled>
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
      <FormControl isDisabled>
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
      <FormControl isDisabled>
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
      <HStack>
        <Button leftIcon={<ChevronRight />} onClick={onClose}>
          انصراف
        </Button>
        <Button
          leftIcon={<Trash2 />}
          colorScheme="red"
          type="submit"
          isLoading={loading}
        >
          حذف
        </Button>
      </HStack>
    </VStack>
  );
};
