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
import { ShowUnitByID, RemoveUnit } from "../../api/services/unitsService";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";

export const DeleteUnit = ({ id, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      await ShowUnitByID(id)
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
    await RemoveUnit(formData.id)
      .then((result) => {
        onDelete(formData.id);
        setFormData({
          UnitFName: "",
          UnitLName: "",
          UnitNationalCode: "",
          UnitPhone: "",
          UnitAddress: "",
        });
        onClose();
        toast({
          title: "ثبت شد",
          description: "واحد موردنظر حذف شد",
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
          <FormLabel width="150px">نام واحد</FormLabel>
          <MyInputBox
            icon={IdCard}
            name="unitName"
            title="نام واحد"
            size={19}
            value={formData.unitName}
            onChange={handleChangeFormData}
          ></MyInputBox>
        </HStack>
      </FormControl>
      <FormControl isDisabled>
        <HStack>
          <FormLabel width="150px">توضیحات</FormLabel>
          <MyInputBox
            icon={IdCard}
            name="unitInfo"
            title="توضیحات"
            size={19}
            value={formData.unitInfo}
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
