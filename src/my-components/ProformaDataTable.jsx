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

export const ProformaDataTable = ({ HeadLables, DataRows }) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="whiteAlpha">
        <TableCaption>جدول اطلاعات بیش فاکتور های کاربر جاری</TableCaption>
        <Thead>
          <Tr>
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
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
                {" "}
                {label}
              </Th>
            ))}
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
