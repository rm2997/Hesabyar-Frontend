export const NotificationDataTable = ({ HeadLables, DataRows }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف پیام زیر اطمینان دارید؟");
    setModalContetnt(<DeleteProforma id={id} onClose={onClose} />);
    onOpen();
  };
  const handleEditNotification = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش پیام");
    setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };

  return (
    <TableContainer>
      <Table color="black" colorScheme="blackAlpha">
        <TableCaption> پیام های شما</TableCaption>
        <Thead
          bg="#68C15A"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={50}
          color="black"
          height={50}
        >
          <Tr>
            {HeadLables.map((label) => (
              <Th id={label}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {DataRows.map((row) => (
            <Tr _hover={{ bg: "#EEEE", color: "orange" }}>
              <Td id={row.id}>
                <Text>{row.id}</Text>
              </Td>
              <Td>{row.createdAt}</Td>
              <Td>{row.customerName}</Td>
              <Td>{row.approvedFile ? "دارد" : "ندارد"}</Td>
              <Td>{row.totalAmount}</Td>
              <Td>
                <HStack>
                  <Link
                    _hover={{
                      color: "orange",
                    }}
                    color="blue.600"
                    onClick={(e) => handleEditProforma(row.id)}
                  >
                    <Edit />
                  </Link>
                  <Link
                    _hover={{ color: "#ffd54f" }}
                    color="red.600"
                    onClick={(e) => handleDeleteProforma(row.id)}
                  >
                    <Trash2 />
                  </Link>
                </HStack>
              </Td>
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

      <MyModalContainer
        onClose={onClose}
        isOpen={isOpen}
        onOpen={onOpen}
        proformaID={selectedID}
        modalHeader={modalHeader}
      >
        {modalContetnt}
      </MyModalContainer>
    </TableContainer>
  );
};
