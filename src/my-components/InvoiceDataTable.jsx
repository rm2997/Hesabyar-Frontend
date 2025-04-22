import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export const InvoiceDataTable = ({ HeadLables, DataRows }) => {
  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption>جدول اطلاعات فاکتور های کاربر جاری</TableCaption>
        <Thead bg="#2b0b8a">
          <Tr>
            {HeadLables.map((label) => (
              <Th color="white" id={label}>
                {label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {DataRows.map((row) => (
            <Tr>
              <Td id={row.id}>{row.id}</Td>
              <Td id={row.Date}>{row.Date}</Td>
              <Td id={row.Customer}>{row.Customer}</Td>
              <Td id={row.SaleTaype}>{row.SaleTaype}</Td>
              <Td id={row.GoodsCount}>{row.GoodsCount}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            {HeadLables.map((label, idx, isNumeric) => (
              <Th id={idx} isNumeric={isNumeric}>
                {label}
              </Th>
            ))}
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
