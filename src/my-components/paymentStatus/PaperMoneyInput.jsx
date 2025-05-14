import {
  Box,
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
  Text,
} from "@chakra-ui/react";
import { Datepicker } from "@ijavad805/react-datepicker";
import { StickyNote } from "lucide-react";
import { useEffect } from "react";

export const PaperMoneyInput = ({
  title,
  display,
  formData,
  handleChangeFormData,
}) => {
  useEffect(() => {
    if (!display) {
      handleChangeFormData({ target: { value: 0, name: "paperAmount" } });
      handleChangeFormData({ target: { value: 0, name: "paperSerial" } });
      handleChangeFormData({ target: { value: "", name: "paperDate" } });
    }
  }, [display]);

  if (display)
    return (
      <Card borderTopRadius={5} h={240} w={360}>
        <CardHeader bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <StickyNote />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <FormControl mb={2}>
            <HStack>
              <FormLabel w="50px">مبلغ</FormLabel>
              <NumberInput
                defaultValue={0}
                w={250}
                dir="ltr"
                min={0}
                name="paperMoneyAmount"
                value={formData.paperMoneyAmount}
                onChange={(value) => {
                  handleChangeFormData({
                    target: { value: value, name: "paperMoneyAmount" },
                  });
                }}
                placeholder="مبلغ سفته"
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
                name="paperMoneySerial"
                placeholder="سریال سفته"
                value={formData.paperMoneySerial}
                onChange={handleChangeFormData}
              />
            </HStack>
          </FormControl>
          <FormControl mb={2}>
            <HStack>
              <FormLabel w="50px">تاریخ</FormLabel>
              <Box
                alignItems="end"
                borderWidth={1}
                borderColor="gray.200"
                bg="gray.100"
              >
                <Datepicker
                  closeWhenSelectADay={true}
                  format={"YYYY/MM/DD"}
                  adjustPosition={"auto"}
                  input={<input placeholder="انتخاب تاریخ" />}
                  theme="green"
                  allowClear={true}
                  style={{ backgroundColor: "yellow" }}
                  name="paperMoneyDate"
                  value={formData.paperMoneyDate}
                  onChange={(e) =>
                    handleChangeFormData({
                      target: { value: e, name: "paperMoneyDate" },
                    })
                  }
                />
              </Box>
            </HStack>
          </FormControl>
        </CardBody>
      </Card>
    );
};
