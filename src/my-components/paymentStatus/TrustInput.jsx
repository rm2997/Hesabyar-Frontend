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
  Text,
} from "@chakra-ui/react";
import { Datepicker } from "@ijavad805/react-datepicker";
import { HandCoins } from "lucide-react";

import { useEffect } from "react";

export const TrustInput = ({
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
        w={isDesktop ? "290px" : "220px"}
      >
        <CardHeader p={2} bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <HandCoins />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody p={2}>
          <Box flex={1} borderRadius="md">
            <FormControl mb={2}>
              <HStack>
                <FormLabel hidden={!isDesktop}>تاریخ</FormLabel>
                <Box
                  maxW={isDesktop ? "270px" : "205px"}
                  borderWidth={1}
                  borderColor="gray.300"
                  borderRadius="sm"
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
                    name="trustIssueDate"
                    value={formData?.trustIssueDate}
                    onChange={(e) =>
                      handleChangeFormData({
                        target: { value: e, name: "trustIssueDate" },
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
