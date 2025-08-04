import {
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Text,
  TableContainer,
  VStack,
  Divider,
  Checkbox,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  IconButton,
  Image,
  Box,
  Heading,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  Flex,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MyLoading } from "../my-components/MyLoading";

import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { CheckCircle2, CircleX, Download } from "lucide-react";
import {
  ShowInvoiceByToken,
  UpdateInvoiceCustomerFile,
} from "../api/services/invoiceService";
import { InvoicePdf } from "./InvoicePdf";

export const UploadInvoiceDocument = ({}) => {
  const contentRef = useRef();
  const [showDownload, setShowDownload] = useState(false);
  const reactToPrintFn = useReactToPrint({ contentRef: contentRef });
  const toast = useToast();
  const [itemsCount, setItemsCount] = useState(0);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [imagePreview, setImagePreview] = useState("");
  const isDesktop = useBreakpointValue({ base: false, md: true });
  dayjs.extend(jalali);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    customer: 0,
    totalAmount: 0,
    paymentStatus: 0,
    chequeAmount: 0,
    chequeSerial: 0,
    chequeDate: "",
    paperMoneyDate: "",
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    invoiceGoods: [],
    description: "",
    isAccepted: false,
    isAcceptedByCustomer: false,
    imageFile: 0,
  });
  const [invoiceItems, setInvoiceItems] = useState([
    {
      uniqueId: Date.now().toString(),
      no: 1,
      good: 0,
      goodName: 0,
      price: 0,
      goodUnitName: "",
      quantity: 0,
      total: 0,
      description: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoiceData = async () => {
      setLoading(true);
      if (!token || token.length < 10) {
        toast({
          title: "خطا",
          description: "توکن شما در سیستم وجود ندارد",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
        setTimeout(() => navigate("/NotFound"), 1000);
        return;
      }
      const res = await ShowInvoiceByToken(token);
      if (!res.success) {
        toast({
          title: "خطا",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: false,
        });
        setLoading(false);
        setTimeout(() => navigate("/NotFound"), 1000);
        return;
      }

      setFormData({ ...res.data, approvedFile: "" });
      let items = 0;
      res?.data?.invoiceGoods.forEach((element) => {
        items += element.quantity;
      });
      setItemsCount(items);

      setLoading(false);
    };

    loadInvoiceData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("image", formData.imageFile);

    const res = await UpdateInvoiceCustomerFile(token, form);
    if (!res) {
      toast({
        title: "خطا",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setLoading(false);
      setTimeout(() => navigate("/NotFound"), 1000);
      return;
    }
    toast({
      title: "توجه",
      description: "تاییدیه شما ارسال گردید",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setTimeout(() => navigate("/home"), 40000);
    setShowDownload(true);
    setLoading(false);
  };

  // const handleDownloadPdf = async () => {
  //   const element = printRef.current;
  //   if (!element) return;

  //   const canvas = await html2canvas(element, {
  //     scale: 2,
  //     useCORS: true, // اگر تصاویر داری
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "px",
  //     format: [canvas.width, canvas.height],
  //   });

  //   pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  //   pdf.save("download.pdf");
  // };

  return (
    <Box borderTopRadius="md" p={2} borderColor="gray.100" borderWidth="1px">
      <Flex mx={2} dir="rtl">
        <Flex direction="column">
          <Text fontFamily="Aseman" fontSize="2xl">
            شرکت تجارت آسانبر علیا
          </Text>
          <Text
            mx="auto"
            fontSize="xl"
            fontFamily="EnglishHeader"
            color="gray.300"
          >
            OLIAEI GROUP
          </Text>
        </Flex>
        <Box mr="auto" mt={2} boxSize="150px" maxH={5}>
          <Image
            borderRadius="10%"
            src="/assets/images/logos/logo1.jpg"
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
          />
        </Box>
      </Flex>
      <Box
        minH={isDesktop ? "85vh" : "90vh"}
        overflowY="auto"
        m={2}
        filter={loading ? "blur(10px)" : ""}
        textAlign="center"
      >
        <Flex direction="column" rowGap={1} alignItems="baseline" my={1}>
          <Flex dir="rtl">
            <Text fontFamily="iransans" fontSize="xs" ml={1}>
              شماره سریال
            </Text>
            <Text
              px={2}
              borderRadius="md"
              borderWidth={1}
              borderColor="black"
              fontFamily="iransans"
              fontSize="xs"
            >
              {formData?.id}
            </Text>
          </Flex>
          <Flex dir="rtl">
            <Text fontFamily="iransans" fontSize="xs" ml={1}>
              تاریخ
            </Text>
            <Text
              px={2}
              borderRadius="md"
              borderWidth={1}
              borderColor="black"
              fontFamily="iransans"
              fontSize="xs"
            >
              {dayjs(formData?.createdAt).locale("fa").format("YYYY/MM/DD")}
            </Text>
          </Flex>
          <Flex dir="rtl">
            <Text fontFamily="iransans" fontSize="xs" ml={1}>
              ساعت
            </Text>
            <Text
              px={3}
              borderRadius="md"
              borderWidth={1}
              borderColor="black"
              fontFamily="iransans"
              fontSize="xs"
            >
              {dayjs(formData.createdAt).locale("fa").format("HH:mm:ss")}
            </Text>
          </Flex>
        </Flex>
        <Box
          bg="gray.100"
          borderTopRadius="md"
          p={2}
          borderColor="gray.400"
          borderWidth="1px"
        >
          <Heading fontFamily="IranSans" size="md" mx="auto">
            فاکتور فروش کالا و خدمات
          </Heading>
        </Box>
        <Box
          p={1}
          borderColor="gray.200"
          borderWidth={1}
          borderBottomRadius="md"
        >
          <Flex direction="column">
            <Flex px={1} borderWidth={1} my={1} dir="rtl" direction="column">
              <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
                مشخصات فروشنده
              </Text>
              <SimpleGrid p={1} columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    نام شخصی حقیقی/حقوقی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    آسانسورلند
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره اقتصادی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    14012045705
                  </Text>
                </HStack>

                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره ثبت/ملی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    609813
                  </Text>
                </HStack>
                <GridItem colSpan={{ sm: 1, md: 2, lg: 2 }}>
                  <HStack>
                    <Text
                      fontFamily="iransans"
                      fontSize={isDesktop ? "md" : "xs"}
                      ml={1}
                      minW="50px"
                    >
                      نشانی :
                    </Text>
                    <Text
                      textAlign="justify"
                      name="customer"
                      fontFamily="iransans"
                      fontSize="xs"
                    >
                      تهران - بزرگراه 65 متری فتح ، ابتدای لاین کندرو، جنب
                      پایگاه یکم شکاری، ساختمان شهر آسانسور یاران، طبقه 4،
                      واحد446
                    </Text>
                  </HStack>
                </GridItem>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    کدپستی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    1387836295
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره تلفن :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    021-65812952
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره همراه :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    09125793556
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    ایمیل :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    info@hesab-yaar.ir
                  </Text>
                </HStack>
              </SimpleGrid>
            </Flex>
            <Flex px={1} borderWidth={1} my={1} dir="rtl" direction="column">
              <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
                مشخصات خریدار
              </Text>
              <SimpleGrid p={1} columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    نام شخصی حقیقی/حقوقی :
                  </Text>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    {formData?.customer?.customerGender +
                      " " +
                      formData?.customer?.customerFName +
                      " " +
                      formData?.customer?.customerLName}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره اقتصادی :
                  </Text>
                  <Text
                    name="customer"
                    fontFamily="iransans"
                    fontSize="xs"
                  ></Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره ثبت/ملی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerNationalCode}
                  </Text>
                </HStack>
                <GridItem colSpan={{ sm: 1, md: 2, lg: 2 }}>
                  <HStack>
                    <Text
                      fontFamily="iransans"
                      fontSize={isDesktop ? "md" : "xs"}
                    >
                      نشانی :
                    </Text>
                    <Text
                      textAlign="justify"
                      name="customer"
                      fontFamily="iransans"
                      fontSize="xs"
                    >
                      {formData?.customer?.customerAddress}
                    </Text>
                  </HStack>
                </GridItem>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    کدپستی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerPostalCode}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره تلفن :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerPhone}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره همراه :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerMobile}
                  </Text>
                </HStack>
              </SimpleGrid>
            </Flex>
          </Flex>
          <Flex px={1} borderWidth={1} my={1} dir="rtl" direction="column">
            <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
              مشخصات کالا و خدمات
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 1 }}
              dir="rtl"
              mt={3}
              mb={10}
              rowGap={5}
              as="form"
              onSubmit={handleSubmit}
            >
              <Stack w="full" align="stretch">
                <TableContainer
                  w="full"
                  mx="auto"
                  dir="rtl"
                  borderColor="gray.300"
                  borderRadius="md"
                  borderWidth={1}
                >
                  <Table
                    columnGap={5}
                    size={isDesktop ? "md" : "xs"}
                    variant="striped"
                  >
                    <Thead h="50px" borderBottomWidth={2}>
                      <Tr columnGap={5} bg="gray.300" textFillColor="black">
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={isDesktop ? "md" : "xs"}
                          textAlign="center"
                        >
                          ردیف
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={isDesktop ? "md" : "xs"}
                          textAlign="center"
                        >
                          نام کالا
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={isDesktop ? "md" : "xs"}
                          textAlign="center"
                        >
                          تعداد
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={isDesktop ? "md" : "xs"}
                          textAlign="center"
                        >
                          واحد
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={isDesktop ? "md" : "xs"}
                          textAlign="center"
                        >
                          فی
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={isDesktop ? "md" : "xs"}
                          textAlign="center"
                        >
                          جمع کل
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {formData?.invoiceGoods?.map((item, index) => (
                        <Tr key={item.no}>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                              textAlign="center"
                            >
                              {index + 1}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                              textAlign="center"
                            >
                              {item?.good?.goodName}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                              textAlign="center"
                            >
                              {item?.quantity}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                              textAlign="center"
                            >
                              {item?.good?.goodUnit?.unitName}
                            </Text>
                          </Td>

                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                              textAlign="center"
                            >
                              {Number(item?.price).toLocaleString()}{" "}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                              textAlign="center"
                            >
                              {Number(
                                item?.quantity * item?.price
                              ).toLocaleString()}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td colSpan={4} />
                        <Td colSpan={2}>
                          <VStack bg="gray.100" m={1}>
                            <HStack mx="auto">
                              <Text
                                fontFamily="IranSans"
                                fontSize={isDesktop ? "md" : "xs"}
                              >
                                تعداد کل :
                              </Text>
                              <Text
                                fontFamily="IranSans"
                                fontSize={isDesktop ? "md" : "xs"}
                              >
                                {itemsCount} مورد
                              </Text>
                            </HStack>
                            <Divider />
                            <HStack mx="auto">
                              <Text
                                fontFamily="IranSans"
                                fontSize={isDesktop ? "md" : "xs"}
                              >
                                مبلغ نهایی :
                              </Text>
                              <Text
                                fontFamily="IranSans"
                                fontSize={isDesktop ? "md" : "xs"}
                              >
                                {Number(formData?.totalAmount).toLocaleString()}
                              </Text>
                            </HStack>
                          </VStack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
              <Divider />
              <HStack>
                <Text fontFamily="IranSans" fontSize={isDesktop ? "md" : "xs"}>
                  توضیحات فاکتور :
                </Text>
                <Text value={formData?.description} />
              </HStack>
              <Divider />
              <SimpleGrid spacing={1} columns={{ base: 1, md: 2, lg: 3 }}>
                <Text textAlign="justify">
                  لطفا بنویسید اطلاعات را قبول دارم - امضا کرده - عکس بگیرید و
                  اینجا قرار دهید.
                </Text>
                <InputGroup maxW="500px">
                  <InputLeftElement>
                    <IconButton
                      colorScheme="red"
                      variant="ghost"
                      icon={<CircleX />}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          approvedFile: "",
                          isAcceptedByCustomer: false,
                        })
                      }
                    />
                  </InputLeftElement>
                  <Input
                    accept="image/*"
                    capture="environment"
                    pt="5px"
                    pb="5px"
                    type="file"
                    name="approvedFile"
                    value={formData?.approvedFile}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        approvedFile: e.target.value,
                        imageFile: e.target.files[0],
                      });
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </InputGroup>
                <Box
                  overflow="auto"
                  borderRadius="6px"
                  borderColor="orange"
                  borderWidth="1px"
                  hidden={
                    formData.approvedFile == null || formData.approvedFile == ""
                  }
                  boxSize="20"
                >
                  <Image
                    src={imagePreview}
                    objectFit="cover"
                    alt={formData?.approvedFile}
                  />
                </Box>
              </SimpleGrid>
              <Divider />
              <HStack>
                <Checkbox
                  textAlign="justify"
                  isDisabled={
                    formData?.approvedFile == null ||
                    formData?.approvedFile == ""
                  }
                  name="isAcceptedByCustomer"
                  isChecked={formData?.isAcceptedByCustomer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAcceptedByCustomer: e.target.checked,
                    })
                  }
                >
                  اینجانب
                  {" " +
                    formData.customer.customerFName +
                    " " +
                    formData.customer.customerLName +
                    " "}
                  فاکتور را مطالعه کرده و اطلاعات آن را قبول دارم.
                </Checkbox>
              </HStack>
              <Divider />
              <Flex px={1} my={1} dir="rtl" direction="column" rowGap={2}>
                <Button
                  isDisabled={!formData?.isAcceptedByCustomer}
                  hidden={showDownload}
                  type="submit"
                  colorScheme="blue"
                  leftIcon={<CheckCircle2 />}
                >
                  تایید
                </Button>
                <Button
                  hidden={!showDownload}
                  colorScheme="green"
                  onClick={reactToPrintFn}
                  leftIcon={<Download />}
                >
                  دانلود فاکتور
                </Button>
              </Flex>
            </SimpleGrid>
          </Flex>
        </Box>
      </Box>
      {loading && <MyLoading />}
      <Box hidden={true}>
        <InvoicePdf ref={contentRef} />
      </Box>
    </Box>
  );
};
