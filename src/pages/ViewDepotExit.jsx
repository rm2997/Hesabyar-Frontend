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
import {
  ShowDepotByToken,
  ShowDepotWarehouseImagesByToken,
  UpdateDepotDriverInfo,
} from "../api/services/depotService";
import { PersianAlphabet } from "../api/services/enums/persianAlphabets.enum";
import { MyModal } from "../my-components/MyModal";

export const ViewDepotExit = ({}) => {
  const toast = useToast();
  const [itemsCount, setItemsCount] = useState(0);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [driverSignImagePreview, setDriverSignImagePreview] = useState("");
  const [showDriverSignImageModal, setShowDriverSignImageModal] =
    useState(false);

  const [carImagePreview, setCarImagePreview] = useState("");
  const [showCarImageModal, setShowCarImageModal] = useState(false);

  const [invoiceImagePreview, setInvoiceImagePreview] = useState("");
  const [showInvoiceImageModal, setShowInvoiceImageModal] = useState(false);

  const isDesktop = useBreakpointValue({ base: false, md: true });
  dayjs.extend(jalali);
  const [formData, setFormData] = useState({
    id: 0,
    depotType: "",
    description: "",
    depotInvoice: {},
    depotGoods: [],
    totalAmount: 0,
    totalQuantity: 0,
    isAccepted: false,
    driver: "",
    driverCarNumber: "",
    driverNatCode: "",
    driverMobile: "",
    createdAt: "",
    createdBy: {},
    acceptedBy: {},
    isAcceptedByCustomer: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDepotData = async () => {
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

      const res = await ShowDepotByToken(token);
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

      setFormData({ ...res?.data });
      console.log(res.data);

      await loadDepotImages(token);
      let items = 0;
      res?.data?.depotGoods?.forEach((element) => {
        items += element.quantity;
      });

      setItemsCount(items);
      setLoading(false);
    };
    loadDepotData();
  }, []);

  const loadDepotImages = async (id) => {
    const res = await ShowDepotWarehouseImagesByToken(token);
    if (!res.success) {
      if (res.status != 404)
        toast({
          title: "خطا در دریافت تصویر",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    } else {
      const { driverSignImage, carImage, invoiceImage } = res?.data;
      setDriverSignImagePreview(driverSignImage);
      setCarImagePreview(carImage);
      setInvoiceImagePreview(invoiceImage);
    }
  };

  const validateForm = async () => {
    if (formData?.driver?.length < 3 || !isNaN(Number(formData?.driver))) {
      toast({
        title: "توجه",
        description: "نام یا نام خانوادگی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.driverNatCode?.length > 0 &&
      formData?.driverNatCode?.length != 10
    ) {
      toast({
        title: "توجه",
        description: "شماره ملی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (isNaN(Number(formData?.driverNatCode))) {
      toast({
        title: "توجه",
        description: "شماره ملی باید به شکل عددی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.driverMobile?.length > 0 &&
      formData?.driverMobile?.length != 11
    ) {
      toast({
        title: "توجه",
        description: "شماره موبایل  صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (isNaN(Number(formData?.driverMobile))) {
      toast({
        title: "توجه",
        description: "شماره موبایل باید به شکل عددی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (
      formData?.driver?.length == 0 &&
      formData?.driverCarNumber?.length == 0 &&
      formData?.driverNatCode?.length == 0
    ) {
      toast({
        title: "توجه",
        description: "باید حداقل یکی از مشخصات راننده یا خودرو را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validate = await validateForm();
    if (validate == false) return;
    setLoading(true);
    const finalFormData = {
      driver: formData?.driver,
      driverCarNumber: formData?.driverCarNumber,
      driverMobile: formData?.driverMobile,
      driverNatCode: formData?.driverNatCode,
    };
    const res = await UpdateDepotDriverInfo(token, finalFormData);
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
    toast({
      title: "توجه",
      description: "مشخصات نماینده یا راننده شما تایید شد",
      status: "success",
      duration: 3000,
      isClosable: false,
    });
    console.log(res.data);

    setTimeout(() => navigate("/home"), 1000);
    setLoading(false);
  };

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
            سند خروج کالا
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
                  <Text fontFamily="iransans" fontSize="xs">
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
                  <Text fontFamily="iransans" fontSize="xs">
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
                  <Text fontFamily="iransans" fontSize="xs">
                    609813
                  </Text>
                </HStack>
                <GridItem colSpan={{ lg: 2, md: 2, sm: 1 }}>
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
                  <Text fontFamily="iransans" fontSize="xs">
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
                  <Text fontFamily="iransans" fontSize="xs">
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
                  <Text fontFamily="iransans" fontSize="xs">
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
                  <Text fontFamily="iransans" fontSize="xs">
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
                    {formData?.depotInvoice?.customer?.customerGender +
                      " " +
                      formData?.depotInvoice?.customer?.customerFName +
                      " " +
                      formData?.depotInvoice?.customer?.customerLName}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره اقتصادی :
                  </Text>
                  <Text fontFamily="iransans" fontSize="xs"></Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره ثبت/ملی :
                  </Text>
                  <Text fontFamily="iransans" fontSize="xs">
                    {formData?.depotInvoice?.customer?.customerNationalCode}
                  </Text>
                </HStack>
                <GridItem colSpan={{ lg: 2, md: 2, sm: 1 }}>
                  <HStack>
                    <Text
                      fontFamily="iransans"
                      fontSize={isDesktop ? "md" : "xs"}
                    >
                      نشانی :
                    </Text>
                    <Text
                      textAlign="justify"
                      fontFamily="iransans"
                      fontSize="xs"
                    >
                      {formData?.depotInvoice?.customer?.customerAddress}
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
                  <Text fontFamily="iransans" fontSize="xs">
                    {formData?.depotInvoice?.customer?.customerPostalCode}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره تلفن :
                  </Text>
                  <Text fontFamily="iransans" fontSize="xs">
                    {formData?.depotInvoice?.customer?.customerPhone}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontFamily="iransans"
                    fontSize={isDesktop ? "md" : "xs"}
                  >
                    شماره همراه :
                  </Text>
                  <Text fontFamily="iransans" fontSize="xs">
                    {formData?.depotInvoice?.customer?.customerMobile}
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
              mb={5}
              rowGap={5}
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
                      {formData?.depotGoods?.map((item, index) => (
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
            </SimpleGrid>
          </Flex>
          {/* <Flex px={1} borderWidth={1} my={1} dir="rtl" direction="column">
            <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
              مشخصات نماینده یا راننده
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              dir="rtl"
              mt={3}
              mb={2}
              rowGap={5}
              columnGap={5}
              as="form"
              onSubmit={handleSubmit}
            >
              <HStack>
                <Text
                  textAlign={"right"}
                  width={"150px"}
                  fontFamily="iransans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  نام و نام خانوادگی
                </Text>
                <Input
                  name="driver"
                  value={formData.driver}
                  onChange={handleChangeFormData}
                />
              </HStack>
              <HStack>
                <Text
                  textAlign={"right"}
                  width={"150px"}
                  fontFamily="iransans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  کد ملی
                </Text>
                <Input
                  name="driverNatCode"
                  value={formData?.driverNatCode}
                  onChange={handleChangeFormData}
                />
              </HStack>
              <HStack>
                <Text
                  textAlign={"right"}
                  width={"150px"}
                  fontFamily="iransans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  موبایل
                </Text>
                <Input
                  name="driverMobile"
                  value={formData?.driverMobile}
                  onChange={handleChangeFormData}
                />
              </HStack>
              <HStack>
                <Text
                  textAlign={"right"}
                  width={"150px"}
                  fontFamily="iransans"
                  fontSize={isDesktop ? "md" : "xs"}
                >
                  پلاک خودرو
                </Text>
                <Input
                  name="driverCarNumber"
                  value={formData?.driverCarNumber}
                  onChange={handleChangeFormData}
                />
              </HStack>
              <GridItem colSpan={{ lg: 3, md: 2, sm: 1 }}>
                <HStack>
                  <Checkbox
                    name="isAcceptedByCustomer"
                    isChecked={formData?.isAcceptedByCustomer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAcceptedByCustomer: e.target.checked,
                      })
                    }
                  >
                    <Text
                      fontFamily="iransans"
                      fontSize={isDesktop ? "md" : "xs"}
                      textAlign="justify"
                    >
                      اینجانب
                      {" " +
                        formData?.depotInvoice?.customer?.customerFName +
                        " " +
                        formData?.depotInvoice?.customer?.customerLName +
                        " "}
                      سند خروج کالا را مطالعه کرده و اطلاعات آن را قبول دارم.
                    </Text>
                  </Checkbox>
                </HStack>
              </GridItem>
              <GridItem colSpan={{ lg: 3, md: 2, sm: 1 }}>
                <Divider />
              </GridItem>
              <GridItem colSpan={{ lg: 3, md: 2, sm: 1 }}>
                <Flex px={1} my={1} dir="rtl" direction="column" rowGap={2}>
                  <Button
                    isDisabled={!formData?.isAcceptedByCustomer}
                    type="submit"
                    colorScheme="blue"
                    leftIcon={<CheckCircle2 />}
                  >
                    تایید
                  </Button>
                 
                </Flex>
              </GridItem>
            </SimpleGrid>
          </Flex> */}
          <Flex px={1} borderWidth={1} my={1} dir="rtl" direction="column">
            <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
              مشخصات راننده
            </Text>
            <Flex hidden={!formData?.driver} columnGap={2} p={2}>
              <Text>نام و نام خانوادگی :</Text>
              <Text>{formData?.driver}</Text>
            </Flex>
            <Flex hidden={!formData?.driverNatCode} columnGap={2} p={2}>
              <Text>شماره ملی :</Text>
              <Text>{formData?.driverNatCode}</Text>
            </Flex>
            <Flex hidden={!formData?.driverMobile} columnGap={2} p={2}>
              <Text>شماره موبایل :</Text>
              <Text>{formData?.driverMobile}</Text>
            </Flex>
            <Flex hidden={!formData?.driverCarNumber} columnGap={2} p={2}>
              <Text p={1} fontFamily="iransans">
                شماره خودرو :
              </Text>
              <Flex borderWidth={1} borderColor="gray.200" columnGap={2} p={1}>
                <Text
                  bg="gray.100"
                  fontFamily="iransans"
                  borderLeftWidth={1}
                  borderLeftColor="gray.200"
                  px={1}
                >
                  {formData?.driverCarNumber?.substring(7)}
                </Text>
                <Text fontFamily="iransans">
                  {formData?.driverCarNumber?.substring(4, 7)}
                </Text>
                <Text fontFamily="iransans" bg="gray.100">
                  {formData?.driverCarNumber
                    ? PersianAlphabet?.find(
                        (k) =>
                          k.key == formData?.driverCarNumber?.substring(2, 4)
                      )?.value
                    : ""}
                </Text>
                <Text fontFamily="iransans">
                  {formData?.driverCarNumber?.substring(0, 2)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            px={1}
            rowGap={3}
            borderWidth={1}
            my={1}
            dir="rtl"
            direction="column"
          >
            <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
              مدارک واریز وجه
            </Text>
            <Flex columnGap={5}>
              <Text fontFamily="iransans">تصویر مدارک واریز وجه</Text>
              <Flex columnGap={2} p={2}>
                <Box
                  onClick={() => setShowInvoiceImageModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={!invoiceImagePreview}
                  boxSize={"150px"}
                >
                  <Image
                    hidden={!invoiceImagePreview}
                    src={invoiceImagePreview}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="تاییدیه"
                  />
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <Flex px={1} borderWidth={1} my={1} dir="rtl" direction="column">
            <Text fontFamily="iransans" mx="auto" bg="gray.200" width="full">
              مستندات خروج کالا
            </Text>

            <Flex columnGap={5} direction="column" p={2} rowGap={5}>
              <Flex columnGap={5}>
                <Text fontFamily="iransans">تصویر خودرو حامل کالا</Text>
                <Box
                  onClick={() => setShowCarImageModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={!carImagePreview}
                  boxSize={"150px"}
                >
                  <Image
                    hidden={!carImagePreview}
                    src={carImagePreview}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="تصویر خودرو حامل کالا"
                  />
                </Box>
              </Flex>
              <Flex columnGap={5}>
                <Text fontFamily="iransans">تصویر امضای راننده</Text>
                <Box
                  onClick={() => setShowDriverSignImageModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={!driverSignImagePreview}
                  boxSize={"150px"}
                >
                  <Image
                    hidden={!driverSignImagePreview}
                    src={driverSignImagePreview}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="تصویر امضای راننده"
                  />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <MyModal
        modalHeader="تصویر مدارک"
        onClose={() => setShowInvoiceImageModal(false)}
        isOpen={showInvoiceImageModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={invoiceImagePreview == null || invoiceImagePreview == ""}
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={invoiceImagePreview ? invoiceImagePreview : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر مدارک"
          />
        </Box>
      </MyModal>
      <MyModal
        modalHeader="تصویر خودرو حامل کالا"
        onClose={() => setShowCarImageModal(false)}
        isOpen={showCarImageModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={carImagePreview == null || carImagePreview == ""}
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={carImagePreview ? carImagePreview : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر خودرو حامل کالا"
          />
        </Box>
      </MyModal>
      <MyModal
        modalHeader="تصویر امضا راننده"
        onClose={() => setShowDriverSignImageModal(false)}
        isOpen={showDriverSignImageModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={
            driverSignImagePreview == null || driverSignImagePreview == ""
          }
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={driverSignImagePreview ? driverSignImagePreview : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر امضا راننده"
          />
        </Box>
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
