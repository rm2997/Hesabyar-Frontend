import {
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Box,
  Text,
  Select,
} from "@chakra-ui/react";
import { Datepicker } from "@ijavad805/react-datepicker";
import { Banknote } from "lucide-react";

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
      handleChangeFormData({ target: { value: "", name: "chequeSerial" } });
      handleChangeFormData({ target: { value: "", name: "chequeDate" } });
      handleChangeFormData({ target: { value: "", name: "chequeSayad" } });
    }
  }, [display]);
  if (display)
    return (
      <Card
        borderWidth={1}
        borderStyle="dashed"
        minH="230px"
        w={isDesktop ? "290px" : "220px"}
      >
        <CardHeader p={2} bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <Banknote />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody p={2}>
          <Box flex={1} borderRadius="md">
            <FormControl isRequired={formData?.paymentStatus == "چک"} mb={2}>
              <HStack gap={4}>
                <FormLabel fontFamily="IranSans">مبلغ</FormLabel>
                <Input
                  isInvalid={formData?.chequeAmount < 1000}
                  size="sm"
                  title="مبلغ چک"
                  fontSize="md"
                  fontFamily="IranSans"
                  defaultValue={0}
                  dir="ltr"
                  min={0}
                  name="chequeAmount"
                  value={formData?.chequeAmount}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) e.target.value = 0;
                    handleChangeFormData({
                      target: { value: e.target.value, name: "chequeAmount" },
                    });
                  }}
                  placeholder="مبلغ چک"
                />
              </HStack>
            </FormControl>

            <FormControl isRequired={formData?.paymentStatus == "چک"} mb={2}>
              <HStack gap={1}>
                <FormLabel fontFamily="IranSans">سریال</FormLabel>
                <Input
                  isInvalid={
                    formData?.chequeSerial?.length < 3 ||
                    isNaN(Number(formData?.chequeSerial)) ||
                    Number(formData?.chequeSerial) == 0
                  }
                  size="sm"
                  title="سریال چک"
                  fontFamily="IranSans"
                  dir="ltr"
                  name="chequeSerial"
                  placeholder="سریال چک"
                  value={formData?.chequeSerial}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) e.target.value = 0;
                    handleChangeFormData({
                      target: {
                        value: e.target.value,
                        name: "chequeSerial",
                      },
                    });
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired={formData?.paymentStatus == "چک"} mb={2}>
              <HStack gap={1}>
                <FormLabel fontFamily="IranSans">شناسه</FormLabel>
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
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) e.target.value = 0;
                    handleChangeFormData({
                      target: {
                        value: e.target.value,
                        name: "chequeSayad",
                      },
                    });
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired={formData?.paymentStatus == "چک"} mb={2}>
              <HStack gpa={5}>
                <FormLabel hidden={!isDesktop} w="50px">
                  تاریخ
                </FormLabel>
                <Box
                  maxW={isDesktop ? "250px" : "205px"}
                  borderWidth={1}
                  borderColor="gray.300"
                  borderRadius="sm"
                  p={2}
                  vali
                >
                  <Datepicker
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
                    value={formData?.chequeDate}
                    onChange={(e) => {
                      handleChangeFormData({
                        target: { value: e, name: "chequeDate" },
                      });
                    }}
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl isRequired={formData?.paymentStatus == "چک"} mb={2}>
              <HStack gap={3}>
                <FormLabel hidden={!isDesktop} w="50px">
                  بانک عامل
                </FormLabel>
                <Select
                  isInvalid={!formData?.chequeIssuerName}
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
