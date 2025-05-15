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
      <Card h={230} w={isDesktop ? 240 : 220}>
        <CardHeader bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <HandCoins />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <Box flex={1} borderRadius="md">
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
                    closeWhenSelectADay={true}
                    format={"YYYY/MM/DD"}
                    adjustPosition={"auto"}
                    input={
                      <input
                        placeholder="انتخاب تاریخ"
                        width={isDesktop ? "240px" : "200px"}
                      />
                    }
                    theme="green"
                    allowClear={true}
                    name="trustIssueDate"
                    value={formData.trustIssueDate}
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
