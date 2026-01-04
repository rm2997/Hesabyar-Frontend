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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { Phone, Send } from "lucide-react";
import { MdOutlinePhoneIphone } from "react-icons/md";
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
                    <Tooltip label={phone?.phoneType}>
                      {phone?.phoneType == "تلفن همراه" ? (
                        <MdOutlinePhoneIphone size={"24px"} color="orange" />
                      ) : (
                        <Phone color="orange" />
                      )}
                    </Tooltip>
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
                    isDisabled={phone?.phoneType != "تلفن همراه"}
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
