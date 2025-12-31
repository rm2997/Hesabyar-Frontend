import {
  Box,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MicVocal, Phone, Send } from "lucide-react";

export const SelectPhoneNumer = ({ id, phoneNumbers, handleSend }) => {
  return (
    <Box bgColor={"white"} textColor={"black"}>
      <TableContainer>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Td>نوع</Td>
              <Td>شماره</Td>
              <Td>پیش فرض</Td>
              <Td></Td>
            </Tr>
          </Thead>
          <Tbody>
            {phoneNumbers.map((phone) => (
              <Tr>
                <Td>
                  <Flex direction={"row"} columnGap={5}>
                    {phone?.phoneType == "تلفن همراه" ? (
                      <Phone color="orange" />
                    ) : (
                      <MicVocal />
                    )}
                    <Text>{phone?.phoneType}</Text>
                  </Flex>
                </Td>
                <Td>{phone?.phoneNumber}</Td>
                <Td>{phone?.isPrimary ? "بله" : "خیر"}</Td>
                <Td>
                  <IconButton
                    title="ارسال"
                    variant={"ghost"}
                    colorScheme="blue"
                    icon={<Send />}
                    onClick={() => handleSend(id, phone?.phoneNumber)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
