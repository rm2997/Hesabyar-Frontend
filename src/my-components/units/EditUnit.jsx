import {
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
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";

export const EditUnit = ({ id, onClose, onUpdate, Unit }) => {
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
    await UpdateUnit(formData.id, formData)
      .then((result) => {
        console.log({ ...result });
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
      <FormControl isRequired>
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
      >
        تایید
      </Button>
    </VStack>
  );
};
