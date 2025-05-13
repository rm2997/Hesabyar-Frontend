import {
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";

export const ChequeInput = ({
  title,
  display,
  formData,
  handleChangeFormData,
}) => {
  useEffect(() => {
    if (!display) {
      handleChangeFormData({ target: { value: 0, name: "chequeAmount" } });
      handleChangeFormData({ target: { value: 0, name: "chequeSerial" } });
      handleChangeFormData({ target: { value: "", name: "chequeDate" } });
    }
  }, [display]);

  return (
    <Card hidden={!display}>
      <CardHeader bg="yellow">{title}</CardHeader>
      <CardBody>
        <FormControl mb={2}>
          <HStack>
            <FormLabel w="50px">مبلغ</FormLabel>
            <NumberInput
              defaultValue={0}
              w={250}
              dir="ltr"
              min={0}
              name="chequeAmount"
              value={formData.chequeAmount}
              onChange={(value) => {
                handleChangeFormData({
                  target: { value: value, name: "chequeAmount" },
                });
              }}
              placeholder="مبلغ چک"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>

        <FormControl mb={2}>
          <HStack>
            <FormLabel w="50px">سریال</FormLabel>
            <Input
              w={250}
              dir="ltr"
              name="chequeSerial"
              placeholder="سریال چک"
              value={formData.chequeSerial}
              onChange={handleChangeFormData}
            />
          </HStack>
        </FormControl>
        <FormControl mb={2}>
          <HStack>
            <FormLabel w="50px">تاریخ</FormLabel>
            <Input
              w={250}
              dir="ltr"
              name="chequeDate"
              placeholder="تاریخ چک"
              value={formData.chequeDate}
              onChange={handleChangeFormData}
            />
          </HStack>
        </FormControl>
      </CardBody>
    </Card>
  );
};
