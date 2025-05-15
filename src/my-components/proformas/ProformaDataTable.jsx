import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  FilePenLine,
  Send,
  Trash2,
  SquareArrowUp,
  CircleFadingArrowUp,
} from "lucide-react";

import { useState } from "react";
import { EditProforma } from "./EditProforma";

export const ProformaDataTable = ({ DataRows, isDesktop }) => {
  const [selectedID, setSelectedID] = useState(0);
  const [modalContetnt, setModalContetnt] = useState(null);
  const [modalHeader, setModalHeader] = useState("");

  dayjs.extend(jalali);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: AlertIsOpen,
    onOpen: AlertOnOpen,
    onClose: AlertOnClose,
  } = useDisclosure();

  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    // setModalHeader("آیا از حذف پیش فاکتور زیر اطمینان دارید؟");
    // setModalContetnt(<DeleteProforma id={id} onClose={AlertOnClose} />);
    AlertOnOpen();
  };
  const handleEditProforma = (id) => {
    if (id === 0) return;

    setSelectedID(id);
    // setModalHeader("ویرایش پیش فاکتور");
    // setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };
  return (
    <>
      <Stack direction={["column", "row"]} spacing={5} m={5}>
        {DataRows.map((row) => (
          <Card
            _hover={{
              cursor: "",
              borderColor: "orange",
            }}
            borderWidth="1px"
            borderColor="gray.300"
          >
            <CardHeader
              borderTopRadius={5}
              bg={row?.isAccepted ? "green.200" : "orange.200"}
            >
              <HStack>
                <Text> پیش فاکتور شماره :{row.id}</Text>
                <Box mr="auto">
                  {row.isSent ? (
                    <SquareArrowUp color="green" />
                  ) : (
                    <CircleFadingArrowUp />
                  )}
                </Box>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={2} align="stretch">
                <HStack>
                  <Text>تاریخ : </Text>
                  <Text>
                    {dayjs(row.createdAt).locale("fa").format("YYYY/MM/DD")}
                  </Text>
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
                  <Text fontSize={"xl"}>
                    {Number(row.totalAmount).toLocaleString()}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
            <CardFooter borderBottomRadius={5} bg="gray.100">
              <Stack
                direction={["row"]}
                spacing={2}
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
                  <FilePenLine />
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

              <Modal dir="rtl" onClose={onClose} size={"full"} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>ویرایش پیش فاکتور</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody dir="rtl">
                    <EditProforma
                      isDesktop={isDesktop}
                      proforma={DataRows.find(
                        (proforma) => proforma.id === selectedID
                      )}
                      onClose={onclose}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <AlertDialog
                motionPreset="slideInBottom"
                onClose={AlertOnClose}
                isOpen={AlertIsOpen}
                isCentered
              >
                <AlertDialogOverlay />

                <AlertDialogContent>
                  <AlertDialogHeader>حدف پیش فاکتور</AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody dir="rtl">
                    آیا واقعا می خواهید این پیش فاکتور را حذف کنید؟
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button onClick={AlertOnClose}>خیر</Button>
                    <Button colorScheme="red" ml={3}>
                      بله
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
