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
  Box,
  Heading,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  Flex,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import jalali from "jalali-dayjs";

import { ShowInvoiceByToken } from "../api/services/invoiceService";

export const InvoicePdf = ({ ref }) => {
  const toast = useToast();
  const [itemsCount, setItemsCount] = useState(0);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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

  return (
    <Box
      ref={ref}
      borderTopRadius="md"
      p={2}
      borderColor="gray.100"
      borderWidth="1px"
    >
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
              <SimpleGrid p={1} columns={{ base: 3 }} columnGap={5} rowGap={2}>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    نام شخصی حقیقی/حقوقی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    آسانسورلند
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره اقتصادی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    14012045705
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره ثبت/ملی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    609813
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    کدپستی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    1387836295
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره تلفن :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    021-65812952
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره همراه :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    09125793556
                  </Text>
                </HStack>
                <GridItem colSpan={3}>
                  <HStack>
                    <Text
                      fontFamily="iransans"
                      fontSize={"md"}
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
                  <Text fontFamily="iransans" fontSize={"md"}>
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
              <SimpleGrid p={1} columns={{ base: 3 }} columnGap={5} rowGap={2}>
                <GridItem colSpan={2}>
                  <HStack>
                    <Text fontFamily="iransans" fontSize={"md"}>
                      نام شخصی حقیقی/حقوقی :
                    </Text>
                    <Text fontFamily="iransans" fontSize={"xs"}>
                      {formData?.customer?.customerGender +
                        " " +
                        formData?.customer?.customerFName +
                        " " +
                        formData?.customer?.customerLName}
                    </Text>
                  </HStack>
                </GridItem>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره اقتصادی :
                  </Text>
                  <Text
                    name="customer"
                    fontFamily="iransans"
                    fontSize="xs"
                  ></Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره ثبت/ملی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerNationalCode}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    کدپستی :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerPostalCode}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره تلفن :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerPhone}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontFamily="iransans" fontSize={"md"}>
                    شماره همراه :
                  </Text>
                  <Text name="customer" fontFamily="iransans" fontSize="xs">
                    {formData?.customer?.customerMobile}
                  </Text>
                </HStack>
                <GridItem colSpan={3}>
                  <HStack>
                    <Text fontFamily="iransans" fontSize={"md"}>
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
                  <Table columnGap={5} size={"md"} variant="striped">
                    <Thead h="50px" borderBottomWidth={2}>
                      <Tr columnGap={5} bg="gray.300" textFillColor="black">
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={"md"}
                          textAlign="center"
                        >
                          ردیف
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={"md"}
                          textAlign="center"
                        >
                          نام کالا
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={"md"}
                          textAlign="center"
                        >
                          تعداد
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={"md"}
                          textAlign="center"
                        >
                          واحد
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={"md"}
                          textAlign="center"
                        >
                          فی
                        </Th>
                        <Th
                          px={2}
                          fontFamily="IranSans"
                          fontSize={"md"}
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
                              fontSize={"md"}
                              textAlign="center"
                            >
                              {index + 1}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={"md"}
                              textAlign="center"
                            >
                              {item?.good?.goodName}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={"md"}
                              textAlign="center"
                            >
                              {item?.quantity}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={"md"}
                              textAlign="center"
                            >
                              {item?.good?.goodUnit?.unitName}
                            </Text>
                          </Td>

                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={"md"}
                              textAlign="center"
                            >
                              {Number(item?.price).toLocaleString()}{" "}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              fontFamily="IranSans"
                              fontSize={"md"}
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
                              <Text fontFamily="IranSans" fontSize="md">
                                تعداد کل :
                              </Text>
                              <Text fontFamily="IranSans" fontSize={"md"}>
                                {itemsCount} مورد
                              </Text>
                            </HStack>
                            <Divider />
                            <HStack mx="auto">
                              <Text fontFamily="IranSans" fontSize={"md"}>
                                مبلغ نهایی :
                              </Text>
                              <Text fontFamily="IranSans" fontSize={"md"}>
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
                <Text fontFamily="IranSans" fontSize={"md"}>
                  توضیحات فاکتور :
                </Text>
                <Text value={formData?.description} />
              </HStack>
              <Divider />
              <HStack>
                <Checkbox
                  isChecked
                  textAlign="justify"
                  isDisabled={
                    formData?.approvedFile == null ||
                    formData?.approvedFile == ""
                  }
                  name="isAcceptedByCustomer"
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
            </SimpleGrid>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
