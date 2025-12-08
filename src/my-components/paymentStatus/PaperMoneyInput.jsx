import {
  Box,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Input,
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
      handleChangeFormData({ target: { value: "", name: "paperSerial" } });
      handleChangeFormData({ target: { value: "", name: "paperDate" } });
    }
  }, [display]);

  if (display)
    return (
      <Card
        borderWidth={1}
        borderStyle="dashed"
        minH="230px"
        maxW={isDesktop ? "290px" : "220px"}
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
              <HStack gap={5}>
                <FormLabel fontFamily="IranSans">مبلغ</FormLabel>
                <Input
                  isInvalid={Number(formData?.paperMoneyAmount) < 1000}
                  size="sm"
                  fontSize="md"
                  fontFamily="IranSans"
                  defaultValue={0}
                  dir="ltr"
                  min={0}
                  name="paperMoneyAmount"
                  value={formData?.paperMoneyAmount}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) e.target.value = 0;
                    handleChangeFormData({
                      target: {
                        value: e.target.value,
                        name: "paperMoneyAmount",
                      },
                    });
                  }}
                  placeholder="مبلغ تهاتر"
                />
              </HStack>
            </FormControl>

            <FormControl mb={2}>
              <HStack gap={2}>
                <FormLabel fontFamily="IranSans">سریال</FormLabel>
                <Input
                  isInvalid={
                    formData?.paperMoneySerial?.length < 3 ||
                    isNaN(Number(formData?.paperMoneySerial)) ||
                    Number(formData?.paperMoneySerial) == 0
                  }
                  size="sm"
                  fontSize="md"
                  fontFamily="IranSans"
                  dir="ltr"
                  name="paperMoneySerial"
                  placeholder="سریال تهاتر"
                  value={formData?.paperMoneySerial}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) e.target.value = 0;
                    handleChangeFormData({
                      target: {
                        value: e.target.value,
                        name: "paperMoneySerial",
                      },
                    });
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl mb={2}>
              <HStack gap={4}>
                <FormLabel hidden={!isDesktop}>تاریخ</FormLabel>
                <Box
                  maxW={isDesktop ? "240px" : "205px"}
                  borderWidth={1}
                  borderColor="gray.300"
                  borderRadius="sm"
                  p={2}
                >
                  <Datepicker
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
                    value={formData?.paperMoneyDate}
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
