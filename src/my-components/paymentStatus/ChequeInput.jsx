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
  Box,
  TagLabel,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { Datepicker } from "@ijavad805/react-datepicker";
import { Banknote, Database } from "lucide-react";

import { useEffect } from "react";
import { Label } from "recharts";

export const ChequeInput = ({
  title,
  display,
  formData,
  handleChangeFormData,
  isDesktop,
}) => {
  useEffect(() => {
    if (!display) {
      handleChangeFormData({ target: { value: 0, name: "chequeAmount" } });
      handleChangeFormData({ target: { value: 0, name: "chequeSerial" } });
      handleChangeFormData({ target: { value: "", name: "chequeDate" } });
    }
  }, [display]);
  if (display)
    return (
      <Card h={230} w={isDesktop ? 240 : 220}>
        <CardHeader bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <Banknote />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <Box flex={1} borderRadius="md">
            <FormControl mb={2}>
              <HStack>
                <FormLabel hidden={!isDesktop} w="50px">
                  مبلغ
                </FormLabel>
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
                <FormLabel hidden={!isDesktop} w="50px">
                  سریال
                </FormLabel>
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
                <FormLabel hidden={!isDesktop} w="50px">
                  تاریخ
                </FormLabel>

                <Box
                  alignItems="end"
                  borderWidth={1}
                  borderColor="gray.200"
                  bg="gray.100"
                >
                  <Datepicker
                    input={<input placeholder="تاریخ را انتخاب کنید..." />}
                    id="chequeDate"
                    closeWhenSelectADay={true}
                    format={"YYYY/MM/DD"}
                    adjustPosition="auto"
                    theme="green"
                    allowClear={true}
                    name="chequeDate"
                    value={formData.chequeDate}
                    onChange={(e) =>
                      handleChangeFormData({
                        target: { value: e, name: "chequeDate" },
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
