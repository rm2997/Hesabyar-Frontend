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
  useToast,
  SimpleGrid,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  FilePenLine,
  Send,
  Trash2,
  SquareArrowUp,
  CircleFadingArrowUp,
  Replace,
} from "lucide-react";

import { EditInvoice } from "./EditInvoice";
import {
  RemoveInvoice,
  ShowUserAllInvoices,
} from "../../api/services/invoiceService";
import { useEffect, useState } from "react";

export const InvoiceDataTable = ({ isDesktop }) => {
  const [invoices, setInvoices] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedID, setSelectedID] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [deleteDialogResult, setDeleteDialogResult] = useState(null);
  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });

  useEffect(() => {
    const loadData = async () => {
      setShowLoading(true);
      await ShowUserAllInvoices()
        .then((res) => {
          setInvoices(res.data);
        })
        .finally(setShowLoading(false));
    };

    loadData();
  }, []);

  dayjs.extend(jalali);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDialogClose = (result) => {
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const handleSendCustomerLink = (id) => {
    toast({
      title: "توجه",
      description: `لینک تاییدیه به مشتری ارسال شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteInvoice = (id) => {
    setSelectedID(id);
    setLoading(true);
    RemoveInvoice(id)
      .then(() => {
        const newInvoices = invoices.filter((p) => p.id != id);
        setInvoices(newInvoices);
        toast({
          title: "توجه",
          description: `اطلاعات پیش فاکتور شما حذف شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(setLoading(false));
    // setModalHeader("آیا از حذف پیش فاکتور زیر اطمینان دارید؟");
    // setModalContetnt(<DeleteInvoice id={id} onClose={AlertOnClose} />);
  };
  const handleEditInvoice = (id) => {
    if (id === 0) return;
    setSelectedID(id);
    // setModalHeader("ویرایش پیش فاکتور");
    // setModalContetnt(<EditInvoice id={id} onClose={onClose} />);
    onOpen();
  };
  if (invoices)
    return (
      <SimpleGrid
        mr={1}
        columns={{ base: 1, md: 2, lg: 5 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
        spacing={3}
      >
        {invoices.map((row) => (
          <Card
            maxW="350px"
            _hover={{
              cursor: "",
              borderColor: "green.500",
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
                    <Tooltip label="منتظر ارسال">
                      <Icon
                        as={CircleFadingArrowUp}
                        _hover={{
                          color: "green",
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={2} align="stretch">
                <HStack>
                  <Text>عنوان : </Text>
                  <Text>{row.title}</Text>
                </HStack>
                <Divider />
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
              >
                <Link
                  _hover={{
                    color: "orange",
                  }}
                  color="blue.600"
                  onClick={(e) => handleEditInvoice(row.id)}
                >
                  <Tooltip label="ویرایش">
                    <Icon w={6} h={6} as={FilePenLine} />
                  </Tooltip>
                </Link>
                <Link
                  _disabled={true}
                  _hover={{ color: "#ffd54f" }}
                  color="green.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "ارسال لینک به مشتری",
                      text: `آیا می خواهید لینک به شماره ${row.customer.customerPhone} به نام ${row.customer.customerLName} ارسال گردد؟`,
                      callBack: handleSendCustomerLink,
                    });

                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="ارسال به مشتری">
                    <Icon w={6} h={6} as={Send} />
                  </Tooltip>
                </Link>

                <Link
                  _hover={{ color: "#ffd54f" }}
                  color="red.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "حذف پیش فاکتور",
                      text: "آیا واقعا می خواهید این پیش فاکتور را حذف کنید؟",
                      callBack: handleDeleteInvoice,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="حذف">
                    <Icon w={6} h={6} as={Trash2} />
                  </Tooltip>
                </Link>
              </Stack>

              <Modal dir="rtl" onClose={onClose} size={"full"} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>ویرایش پیش فاکتور</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody dir="rtl">
                    <EditInvoice
                      isDesktop={isDesktop}
                      setInvoices={setInvoices}
                      invoices={invoices}
                      invoice={invoices.find(
                        (invoice) => invoice.id === selectedID
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
                motionPreset="slideInTop"
                onClose={handleDialogClose}
                isOpen={isDialogOpen}
                isCentered
              >
                <AlertDialogOverlay />
                <AlertDialogContent>
                  <AlertDialogHeader>{dialogGears.title}</AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody dir="rtl">
                    {dialogGears.text}
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button
                      onClick={(e) => {
                        setIsDialogOpen(false);
                        handleDialogClose("Cancel");
                      }}
                    >
                      خیر
                    </Button>
                    <Button
                      colorScheme="red"
                      ml={3}
                      onClick={(e) => {
                        setIsDialogOpen(false);
                        handleDialogClose("Confirm");
                      }}
                    >
                      بله
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    );
};
