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
      <Card h={240} w={360}>
        <CardHeader bg="blue.500" color={"white"} borderTopRadius={5}>
          <HStack>
            <HandCoins />
            <Text>{title}</Text>
          </HStack>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    );
};
