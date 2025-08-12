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
  Select,
} from "@chakra-ui/react";
import { Datepicker } from "@ijavad805/react-datepicker";
import { Banknote, Database } from "lucide-react";

import { useEffect } from "react";
import { Banks } from "../../api/services/enums/banks.enum";

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
      <Card
        borderWidth={1}
        borderStyle="dashed"
        minH="230px"
        w={isDesktop ? 240 : 220}
      >
        <CardHeader p={2} bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <Banknote />
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
                  isInvalid={formData?.chequeAmount < 1000}
                  size="sm"
                  title="مبلغ چک"
                  fontSize="md"
                  fontFamily="IranSans"
                  defaultValue={0}
                  w={250}
                  dir="ltr"
                  min={0}
                  name="chequeAmount"
                  value={formData?.chequeAmount}
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
                <FormLabel
                  fontFamily="IranSans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  سریال
                </FormLabel>
                <Input
                  isInvalid={
                    formData?.chequeSerial?.length < 3 ||
                    isNaN(Number(formData?.chequeSerial)) ||
                    Number(formData?.chequeSerial) == 0
                  }
                  size="sm"
                  title="سریال چک"
                  fontFamily="IranSans"
                  w={250}
                  dir="ltr"
                  name="chequeSerial"
                  placeholder="سریال چک"
                  value={formData?.chequeSerial}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl mb={2}>
              <HStack>
                <FormLabel
                  fontFamily="IranSans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  شناسه
                </FormLabel>
                <Input
                  isInvalid={
                    formData?.chequeSayad?.length < 3 ||
                    isNaN(Number(formData?.chequeSayad)) ||
                    Number(formData?.chequeSayad) == 0
                  }
                  fontFamily="IranSans"
                  title="شناسه سیادی"
                  placeholder="شناسه سیادی"
                  size="sm"
                  dir="ltr"
                  name="chequeSayad"
                  value={formData?.chequeSayad}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired={formData?.paymentStatus == "چک"} mb={2}>
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
                  vali
                >
                  <Datepicker
                    width="150px"
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
            <FormControl mb={2}>
              <HStack>
                <FormLabel hidden={!isDesktop} w="50px">
                  بانک عامل
                </FormLabel>
                <Select
                  isInvalid={!formData.chequeIssuerName}
                  placeholder="بانک عامل"
                  size="sm"
                  dir="ltr"
                  name="chequeIssuerName"
                  value={formData?.chequeIssuerName}
                  onChange={handleChangeFormData}
                >
                  {Banks.map((b) => (
                    <option key={b.key} value={b.value}>
                      {b.value}
                    </option>
                  ))}
                </Select>
              </HStack>
            </FormControl>
          </Box>
        </CardBody>
      </Card>
    );
};
