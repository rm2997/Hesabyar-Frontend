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
  isDesktop,
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
      <Card
        borderWidth={1}
        borderStyle="dashed"
        minH="230px"
        w={isDesktop ? 240 : 220}
      >
        <CardHeader p={2} bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <StickyNote />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody p={2}>
          <Box flex={1} borderRadius="md">
            <FormControl mb={2}>
              <HStack>
                <FormLabel
                  fontFamily="IranSans"
                  fontSize={isDesktop ? "md" : "md"}
                >
                  مبلغ
                </FormLabel>
                <NumberInput
                  isInvalid={formData?.paperMoneyAmount < 1000}
                  size="sm"
                  fontSize="md"
                  fontFamily="IranSans"
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
                  placeholder="مبلغ تهاتر"
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
                <FormLabel
                  fontFamily="IranSans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  سریال
                </FormLabel>
                <Input
                  isInvalid={
                    formData?.paperMoneySerial?.length < 3 ||
                    isNaN(Number(formData?.paperMoneySerial)) ||
                    Number(formData?.paperMoneySerial) == 0
                  }
                  size="sm"
                  fontSize="md"
                  fontFamily="IranSans"
                  w={250}
                  dir="ltr"
                  name="paperMoneySerial"
                  placeholder="سریال تهاتر"
                  value={formData.paperMoneySerial}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl mb={2}>
              <HStack>
                <FormLabel hidden={!isDesktop} w="50px">
                  تاریخ
                </FormLabel>
                <Box
                  maxW="205px"
                  borderWidth={1}
                  borderColor="gray.300"
                  borderRadius="md"
                  p={2}
                >
                  <Datepicker
                    width="150px"
                    fontSize="md"
                    fontFamily="IranSans"
                    input={
                      <input
                        style={{ borderColor: "gray", borderWidth: "1px" }}
                        placeholder="تاریخ را انتخاب کنید..."
                      />
                    }
                    id="chequeDate"
                    closeWhenSelectADay={true}
                    format={"YYYY/MM/DD"}
                    adjustPosition="auto"
                    theme="green"
                    allowClear={true}
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
          </Box>
        </CardBody>
      </Card>
    );
};
