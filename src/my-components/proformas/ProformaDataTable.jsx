import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  Divider,
  Flex,
  HStack,
  Link,
  Spinner,
  Stack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Check,
  CheckCheck,
  Edit,
  Ellipsis,
  FileCheck,
  Send,
  Trash2,
} from "lucide-react";
import { MyModalContainer } from "../MyModalContainer";
import { useState } from "react";
import { EditProforma } from "./EditProforma";
import { DeleteProforma } from "./DeleteProforma";
import { Label } from "recharts";

export const ProformaDataTable = ({ HeadLables, DataRows }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    setModalHeader("آیا از حذف پیش فاکتور زیر اطمینان دارید؟");
    setModalContetnt(<DeleteProforma id={id} onClose={onClose} />);
    onOpen();
  };
  const handleEditProforma = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    setModalHeader("ویرایش پیش فاکتور");
    setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };
  return (
    <>
      <Stack direction={["column", "row"]} spacing={5} m={5}>
        {DataRows.map((row) => (
          <Card
            _hover={{
              cursor: "pointer",
              borderColor: "orange",
            }}
            borderWidth="1px"
            borderColor="gray.300"
          >
            <CardHeader
              borderTopRadius={5}
              bg={row?.isAccepted ? "green.200" : "orange.200"}
            >
              پیش فاکتور شماره :{row.id}
              <Stat float={"left"}>
                <StatHelpText>
                  {row?.isSent ? (
                    row.isAccepted ? (
                      <CheckCheck />
                    ) : (
                      <Check />
                    )
                  ) : (
                    <CircularProgress
                      isIndeterminate
                      color="purple.300"
                      size="20px"
                    />
                  )}
                </StatHelpText>
              </Stat>
            </CardHeader>
            <CardBody>
              <VStack spacing={2} align="stretch">
                <HStack>
                  <Text>تاریخ : </Text>
                  <Text>{row.createdAt}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>نام مشتری : </Text>
                  <Text>
                    {row.customer?.customerFName +
                      " " +
                      row.customer?.customerLName}
                  </Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text>نوع پرداخت : </Text>
                  <Text>{row.paymentStatus}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text> تایید مشتری : </Text>
                  <Text>{row.approvedFile ? "دارد" : "ندارد"}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Text> جمع کل : </Text>
                  <Text>{Number(row.totalAmount).toLocaleString()}</Text>
                </HStack>
              </VStack>
            </CardBody>
            <CardFooter borderBottomRadius={5} bg="gray.100">
              <Stack
                direction={["row"]}
                spacing={5}
                align={"stretch"}
                mr="auto"
                ml="auto"
              >
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
                  _disabled={true}
                  _hover={{ color: "#ffd54f" }}
                  color="green.600"
                  onClick={(e) => handleDeleteProforma(row.id)}
                >
                  <Send />
                </Link>
                <Link
                  _hover={{ color: "#ffd54f" }}
                  color="red.600"
                  onClick={(e) => handleDeleteProforma(row.id)}
                >
                  <Trash2 />
                </Link>
              </Stack>
            </CardFooter>
          </Card>
        ))}
      </Stack>

      {/* <TableContainer>
        <Table
          color="black"
          colorScheme="blackAlpha"
          borderWidth="1px"
          borderColor="gray.600"
        >
          <TableCaption>جدول اطلاعات پیش فاکتور های کاربر جاری</TableCaption>
          <Thead bg="#50b742" color="white" borderTopRadius={50} height={50}>
            <Tr color="white">
              {HeadLables.map((label) => (
                <Th id={label}>{label}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {DataRows.map((row) => (
              <Tr
                _hover={{ bg: "#f5f5f5" }}
                cursor="pointer"
                bg={row?.isAccepted ? "green.200" : "orange.200"}
              >
                <Td id={row.id}>
                  <Text>{row.id}</Text>
                </Td>
                <Td>{row.createdAt}</Td>
                <Td>
                  {row.customer?.customerFName +
                    " " +
                    row.customer?.customerLName}
                </Td>
                <Td>{row.paymentStatus}</Td>
                <Td>{row.approvedFile ? "دارد" : "ندارد"}</Td>
                <Td>{row.totalAmount}</Td>
                <Td>{row?.isAccepted ? "بله" : "خیر"}</Td>
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
                      color="green.600"
                      onClick={(e) => handleDeleteProforma(row.id)}
                    >
                      <Send />
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
      </TableContainer> */}
    </>
  );
};
