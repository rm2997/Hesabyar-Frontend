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
  Link2,
} from "lucide-react";

import { EditProforma } from "./EditProforma";
import {
  ConvertProformaToInvoice,
  GenerateNewToken,
  RemoveProforma,
  SendUpdateProformaSms,
  ShowUserAllProformas,
} from "../../api/services/proformaService";
import { useEffect, useState } from "react";
import { CreateInvoice } from "../../api/services/invoiceService";
import { MyModal } from "../MyModal";
import { MyAlert } from "../MyAlert";
import { sendUpdateProformaSms } from "../../api/smsUtils";

export const ProformaDataTable = ({ isDesktop }) => {
  const [proformas, setProformas] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedID, setSelectedID] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [dialogGears, setDialogGears] = useState({
    title: "",
    text: "",
    callBack: null,
  });

  useEffect(() => {
    const loadData = async () => {
      setShowLoading(true);
      await ShowUserAllProformas()
        .then((res) => {
          setProformas(res.data);
          console.log(res.data);
        })
        .finally(setShowLoading(false));
    };

    loadData();
  }, []);

  dayjs.extend(jalali);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDialogClose = (result) => {
    setIsDialogOpen(false);
    if (result === "Confirm") dialogGears.callBack(selectedID);
  };

  const handleSendCustomerLink = (id) => {
    const proforma = proformas.find((p) => p.id == id);
    console.log(proforma);
    if (!proforma) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "اطلاعات مشتری در دسترس نیست",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!proforma?.customer?.customerMobile) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "شماره موبایل مشتری ثبت نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!proforma?.customerLink) {
      toast({
        title: "امکان ارسال وجود ندارد",
        description: "لینک موقت مشتری ساخته نشده است",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const customer =
      proforma?.customer?.customerGender +
      " " +
      proforma?.customer?.customerFName +
      " " +
      proforma?.customer?.customerLName;
    SendUpdateProformaSms(
      customer,
      proforma?.customer?.customerMobile,
      "www.hesab-yaar.ir/upload-proforma-document?token=" +
        proforma?.customerLink
    )
      .then((res) => {
        toast({
          title: "توجه",
          description:
            "لینک تاییدیه به شماره موبایل" +
            " " +
            proforma.customer.customerMobile +
            " به نام " +
            proforma.customer.customerFName +
            " " +
            proforma.customer.customerLName +
            " ارسال شد. ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) =>
        toast({
          title: "خطا بعد از ارسال",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      );
  };

  const handleConvertToInvoice = (id) => {
    const proforma = proformas.find((p) => (p.id = id));
    // const newInvoice = {
    //   chequeAmount: 0,
    //   chequeDate: "",
    //   chequeSerial: 0,
    //   customer: {},
    //   description: "",
    //   id: 0,
    //   invoiceGoods: [],
    //   paperMoneyAmount: 0,
    //   paperMoneySerial: 0,
    //   paymentStatus: "",
    //   proforma: {},
    //   title: "",
    //   totalAmount: 0,
    //   trustIssueDate: "",
    // };

    if (!proforma) return;
    const newInvoice = {
      ...proforma,
      customer: { ...proforma.customer },
      invoiceGoods: proforma.proformaGoods,
      proforma: { ...proforma },
    };
    setLoading(true);
    CreateInvoice(newInvoice)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          ConvertProformaToInvoice(proforma.id).then((res) => {
            const newProformas = proformas.filter((p) => p.id != proforma.id);
            proforma.isConverted = true;
            newProformas.push(proforma);
            setProformas(newProformas);
          });
          toast({
            title: "توجه",
            description: ` پیش فاکتور شما به فاکتور تبدیل شد`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
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
  };

  const handleGenerateNewLink = (id) => {
    setSelectedID(id);
    setLoading(true);
    GenerateNewToken(id)
      .then((res) => {
        toast({
          title: "توجه",
          description: ` لینک جدید ساخته شد می توانید آن را دوباره به مشتری ارسال کنید`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setProformas((prev) =>
          prev.map((p) => (p.id == id ? { ...p, customerLink: res.data } : p))
        );
      })
      .catch((err) => {
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(setLoading(false));
  };

  const handleDeleteProforma = (id) => {
    setSelectedID(id);
    setLoading(true);
    RemoveProforma(id)
      .then(() => {
        const newProformas = proformas.filter((p) => p.id != id);
        setProformas(newProformas);
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
    // setModalContetnt(<DeleteProforma id={id} onClose={AlertOnClose} />);
  };
  const handleEditProforma = (id) => {
    if (id === 0) return;
    setSelectedID(id);
    // setModalHeader("ویرایش پیش فاکتور");
    // setModalContetnt(<EditProforma id={id} onClose={onClose} />);
    onOpen();
  };
  if (proformas)
    return (
      <SimpleGrid
        mr={1}
        columns={{ base: 1, md: 2, lg: 5 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
        spacing={3}
      >
        {proformas.map((row) => (
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
              bg={row?.isConverted ? "green.200" : "orange.200"}
            >
              <HStack>
                <Text> پیش فاکتور شماره :{row.id}</Text>
                <Box mr="auto">
                  <HStack>
                    {row.isSent ? (
                      <SquareArrowUp color="green" />
                    ) : (
                      <Tooltip label="منتظر ارسال">
                        <Icon
                          as={CircleFadingArrowUp}
                          color="orange"
                          _hover={{
                            color: "green",
                          }}
                        />
                      </Tooltip>
                    )}
                    {row.isConverted ? (
                      <Tooltip label="فاکتور شده">
                        <Icon
                          color="purple.500"
                          as={Replace}
                          _hover={{
                            color: "green",
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </HStack>
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
                  onClick={(e) => handleEditProforma(row.id)}
                >
                  <Tooltip label="ویرایش">
                    <Icon w={6} h={6} as={FilePenLine} />
                  </Tooltip>
                </Link>

                <Link
                  _hover={{
                    color: "orange",
                  }}
                  color="blue.600"
                  onClick={(e) => handleGenerateNewLink(row.id)}
                >
                  <Tooltip label="تولید لینک جدید">
                    <Icon w={6} h={6} as={Link2} />
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
                      text: `آیا می خواهید لینک به شماره ${
                        row.customer.customerMobile
                      } به نام ${
                        row.customer.customerGender +
                        " " +
                        row.customer.customerFName +
                        " " +
                        row.customer.customerLName
                      } ارسال گردد؟`,
                      callBack: () => handleSendCustomerLink(row.id),
                    });

                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="ارسال لینک به مشتری">
                    <Icon w={6} h={6} as={Send} />
                  </Tooltip>
                </Link>
                {!row.isConverted && (
                  <Link
                    _hover={{ color: "#ffd54f" }}
                    color="purple.600"
                    onClick={() => handleConvertToInvoice(row.id)}
                  >
                    <Tooltip label="تبدیل به فاکتور">
                      <Icon w={6} h={6} as={Replace} />
                    </Tooltip>
                  </Link>
                )}
                <Link
                  _hover={{ color: "#ffd54f" }}
                  color="red.600"
                  onClick={(e) => {
                    setSelectedID(row.id);
                    setDialogGears({
                      title: "حذف پیش فاکتور",
                      text: "آیا واقعا می خواهید این پیش فاکتور را حذف کنید؟",
                      callBack: handleDeleteProforma,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  <Tooltip label="حذف">
                    <Icon w={6} h={6} as={Trash2} />
                  </Tooltip>
                </Link>
              </Stack>
            </CardFooter>
          </Card>
        ))}
        <MyModal
          modalHeader="ویرایش پیش فاکتور"
          onClose={onClose}
          isOpen={isOpen}
        >
          <EditProforma
            isDesktop={isDesktop}
            setProformas={setProformas}
            proformas={proformas}
            proforma={proformas.find((proforma) => proforma.id === selectedID)}
          />
        </MyModal>
        <MyAlert
          onClose={handleDialogClose}
          isOpen={isDialogOpen}
          AlertHeader={dialogGears.title}
          AlertMessage={dialogGears.text}
        />
      </SimpleGrid>
    );
};
