import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  useToast,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Stack,
  Box,
  SimpleGrid,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import { Captions, CircleX, PlusCircle, User, UserSearch } from "lucide-react";
import { MyLoading } from "../MyLoading";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  ShowProformaApprovedFile,
  UpdateProforma,
} from "../../api/services/proformaService";

import { ShowAllCustomers } from "../../api/services/customerService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";
import { PaperMoneyInput } from "../../my-components/paymentStatus/PaperMoneyInput";
import { TrustInput } from "../../my-components/paymentStatus/TrustInput";
import { SearchGoods } from "../SearchGood";
import { SearchCustomer } from "../SearchCustomer";
import { MyModal } from "../MyModal";
import { MyInputBox } from "../MyInputBox";
import {
  getFiscalYear,
  showAllStocks,
} from "../../api/services/sepidarService";
import { Datepicker } from "@ijavad805/react-datepicker";

export const EditProforma = ({ onUpdate, proforma, closeMe }) => {
  dayjs.extend(jalali);
  const toast = useToast();
  const isDesktop = useBreakpointValue({ base: false, md: true, lg: true });
  const [formData, setFormData] = useState({
    title: "",
    customer: {},
    totalAmount: 0,
    paymentStatus: 0,
    stockRef: 0,
    chequeAmount: 0,
    chequeSerial: 0,
    chequeDate: "",
    paperMoneyDate: "",
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    expirationDate: "",
    proformaGoods: [],
    description: "",
    fiscalYear: 0,
    isConverted: 0,
  });
  const [fiscalYear, setFiscalYear] = useState({});
  const [proformaItems, setProformaItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [approvedFile, setApprovedFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedItem, setSelectedItem] = useState(0);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showSearchGood, setShowSearchGood] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allStocks, setAllStocks] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await ShowProformaApprovedFile(proforma.id);
      if (!res.success) {
        if (res.status != 404)
          toast({
            title: "خطایی هنگام بارگذاری تصویر رخ داد",
            description: res.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
      } else {
        const url = URL.createObjectURL(res.data);
        setApprovedFile(url);
      }

      for (let i = 0; i < proforma.proformaGoods.length; i++) {
        proforma.proformaGoods[i].no = i + 1;
        proforma.proformaGoods[i].uniqueId = Date.now().toString();
      }
      setFormData({
        ...proforma,
        proformaGoods: [...proforma.proformaGoods],
      });
      setProformaItems(proforma.proformaGoods);

      setLoading(false);
    };

    const initStocks = async () => {
      await handleShowStocks();
    };

    const initFiscalYear = async () => {
      await handleShowFiscalYear();
    };
    initStocks();
    initFiscalYear();
    loadData();
  }, []);

  useEffect(() => {
    recalculateTotal();
  }, [formData]);

  const handleShowFiscalYear = async () => {
    setLoading(true);
    const response = await getFiscalYear(proforma?.fiscalYear);
    if (!response.success) {
      toast({
        title: "خطایی رخ داد",
        description: response.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setFiscalYear(response?.data);
    setLoading(false);
  };

  const initForm = () => {
    setFormData({
      title: "",
      customer: {},
      totalAmount: 0,
      paymentStatus: 0,
      stockRef: 0,
      chequeAmount: 0,
      chequeSerial: 0,
      chequeDate: "",
      paperMoneyDate: "",
      paperMoneyAmount: 0,
      paperMoneySerial: 0,
      trustIssueDate: "",
      proformaGoods: null,
      approvedFile: "",
      description: "",
      fiscalYear: 0,
      isConverted: 0,
    });
    setProformaItems([
      {
        uniqueId: Date.now().toString(),
        createdAt: "",
        createdBy: {},
        description: "",
        good: null,
        id: 0,
        price: 0,
        quantity: 0,
        total: 0,
      },
    ]);
  };

  const validateCheque = async (data) => {
    if (!data?.chequeDate) {
      toast({
        title: "توجه",
        description: "تاریخ چک را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if ((await validateDate(data?.chequeDate)) == false) {
      toast({
        title: "توجه",
        description: "تاریخ چک صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!data?.chequeIssuerName || data?.chequeIssuerName == "") {
      toast({
        title: "توجه",
        description: "بانک عامل چک رامشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      data?.chequeAmount?.length < 3 ||
      isNaN(Number(data?.chequeAmount)) ||
      Number(data?.chequeAmount) == 0
    ) {
      toast({
        title: "توجه",
        description: "مبلغ چک صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      data?.chequeSerial?.length < 3 ||
      isNaN(Number(data?.chequeSerial)) ||
      Number(data?.chequeSerial) == 0
    ) {
      toast({
        title: "توجه",
        description: "سریال چک صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      data?.chequeSayad?.length < 3 ||
      isNaN(Number(data?.chequeSayad)) ||
      Number(data?.chequeSayad) == 0
    ) {
      toast({
        title: "توجه",
        description: "شناسه چک صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };
  const validateTahator = async (data) => {
    return true;
  };
  const validateAmani = async (data) => {
    if (!data?.trustIssueDate) {
      toast({
        title: "توجه",
        description: "تاریخ امانت را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if ((await validateDate(data?.trustIssueDate)) == false) {
      toast({
        title: "توجه",
        description: "تاریخ امانت صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };
  const validateDate = async (inputDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);

    return date >= today;
  };
  const validateForm = async (data) => {
    if (!data.customer) {
      toast({
        title: "توجه",
        description: "باید مشتری را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!data.proformaGoods || data.proformaGoods?.length < 1) {
      toast({
        title: "توجه",
        description: "باید حداقل یک کالا انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (data.paymentStatus == "چک" || data.paymentStatus == "اعتباری") {
      if ((await validateCheque(formData)) == false) return false;
    }
    if (data.paymentStatus == "تهاتر" || data.paymentStatus == "اعتباری") {
      if ((await validateTahator(formData)) == false) return false;
    }
    if (data.paymentStatus == "امانی" || data.paymentStatus == "اعتباری") {
      if ((await validateAmani(formData)) == false) return false;
    }
    const goodQCheck = data.proformaGoods.every((good) => {
      let retVal = true;
      if (!good.quantity || good.quantity == 0) {
        toast({
          title: "توجه",
          description: ` تعداد  ${good?.good?.goodName} را ثبت کنید`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        retVal = false;
      }
      return retVal;
    });
    if (!goodQCheck) return false;

    const goodACheck = data.proformaGoods.every((good) => {
      let retval = true;
      if (!good.total || good.total == 0) {
        console.log(good);

        toast({
          title: "توجه",
          description: `قیمت کل ${good?.good?.goodName} را ثبت کنید`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        retval = false;
      }
      return retval;
    });
    if (!goodACheck) return false;

    return true;
  };

  const handleShowStocks = async () => {
    setLoading(true);
    const response = await showAllStocks();
    if (!response.success) {
      toast({
        title: "خطایی رخ داد",
        description: response.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setAllStocks(response.data);
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = [...proformaItems];
    items.forEach((i) => (i.total = i.price * i.quantity));

    const data = { ...formData };
    data.proformaGoods = [...items];
    data.totalAmount = totalPrice;
    data.totalQuantity = totalQuantity;

    setFormData(data);

    if ((await validateForm(data)) == false) return;

    setLoading(true);
    const res = await UpdateProforma(formData?.id, data);
    if (!res.success) {
      toast({
        title: "خطایی رخ داد",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    onUpdate(res?.data);
    initForm();

    toast({
      title: "ثبت شد",
      description: `اطلاعات پیش فاکتور شما ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setLoading(false);
    closeMe();
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...proformaItems];
    newItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;

    if (field === "quantity" || field === "price") {
      const qty = field === "quantity" ? value : newItems[index].quantity;
      const prc = field === "price" ? value : newItems[index].goodPrice;
      newItems[index].total = qty * prc;
    }
    recalculateTotal(newItems);
    setProformaItems(newItems);
  };

  const recalculateTotal = () => {
    const total = proformaItems.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );
    const count = proformaItems.reduce((sum, i) => sum + i.quantity, 0);
    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = (good) => {
    const items = [...proformaItems];
    const newItem = {
      quantity: 1,
      total: good?.goodPrice,
      price: good?.goodPrice,
      good: good,
      description: "",
    };
    items.push(newItem);
    setProformaItems([...items]);
    setSelectedItem(items?.length);
  };

  const handleRemoveItem = (item) => {
    const items = proformaItems.filter((i) => i?.good?.id != item?.good?.id);
    setProformaItems([...items]);
    setSelectedItem(null);
    recalculateTotal();
  };

  const handleDeleteAllItems = () => {
    setProformaItems([]);
    setTotalPrice(0);
    setTotalQuantity(0);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchCustomers = async (query) => {
    const response = await ShowAllCustomers(1, 10, query);
    return response?.data?.items;
  };

  const handleSearchGoods = async (query) => {
    const response = await ShowAllGoods(1, 10, query);
    if (!response?.success) return null;
    return response?.data?.items;
  };

  const handleShowSearchGood = async (id) => {
    setSelectedItem(id);
    setShowSearchGood(true);
  };

  return (
    <Box>
      <Card
        minH={isDesktop ? "85vh" : "83vh"}
        overflowY="auto"
        m={1}
        filter={loading ? "blur(10px)" : ""}
      >
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            <Flex direction="row" gap={4} justify={"space-between"}>
              <Box>
                <Text fontFamily="IranSans">
                  ویرایش پیش فاکتور : {proforma?.proformaNumber}
                </Text>
              </Box>
              <Flex
                borderWidth={1}
                borderColor={"gray.300"}
                borderStyle={"dashed"}
                borderRadius={"md"}
                padding={1}
                direction="row"
                gap={4}
                color={"gray.200"}
                fontSize={"12px"}
              >
                <Text
                  fontFamily="IranSans"
                  borderLeftWidth={1}
                  borderLeftColor={"gray.300"}
                  borderLeftStyle={"dashed"}
                  paddingLeft={2}
                >
                  سال مالی
                </Text>
                <Text fontFamily="IranSans">{fiscalYear?.FiscalYear}</Text>
              </Flex>
            </Flex>
          </CardHeader>
        )}
        <CardBody>
          <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
            <Flex direction={{ base: "column", md: "row" }}>
              <Box>
                <Stack spacing={4} direction="column">
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} w="29%">
                        عنوان
                      </FormLabel>
                      <MyInputBox
                        icon={Captions}
                        name="title"
                        value={formData.title}
                        title="عنوان"
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} w="40%">
                        نام مشتری
                      </FormLabel>
                      <MyInputBox
                        icon={User}
                        title="لطفا یک مشتری انتخاب کنید"
                        maxW="560px"
                        onClick={() => setShowSearchCustomer(true)}
                        value={
                          formData.customer !== null
                            ? formData?.customer?.customerGender +
                              " " +
                              formData?.customer?.customerFName +
                              " " +
                              formData?.customer?.customerLName
                            : ""
                        }
                        name="customer"
                        readOnly
                      />
                      {formData?.customer && (
                        <IconButton
                          mr="-10px"
                          size="md"
                          icon={<CircleX />}
                          colorScheme="red"
                          title="انصراف"
                          variant="ghost"
                          onClick={() =>
                            setFormData({ ...formData, customer: null })
                          }
                        />
                      )}
                      <IconButton
                        size={"md"}
                        icon={<UserSearch />}
                        colorScheme="orange"
                        onClick={() => setShowSearchCustomer(true)}
                        title="جستجوی مشتری "
                      />
                    </HStack>
                  </FormControl>

                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} w="29%">
                        نوع پرداخت
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="paymentStatus"
                        placeholder="نوع پرداخت را انتخاب کنید"
                        value={formData?.paymentStatus}
                        onChange={handleChangeFormData}
                      >
                        {PaymentTypes.map((p) => (
                          <option key={p.key} value={p.value}>
                            {p.value}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} w="29%">
                        انبار
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="stockRef"
                        placeholder="انبار را انتخاب کنید"
                        value={formData.stockRef}
                        onChange={handleChangeFormData}
                      >
                        {allStocks.map((p) => (
                          <option key={p.StockID} value={p.StockID}>
                            {p.Title}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="140px">
                        اعتبار تا
                      </FormLabel>
                      <Box
                        borderWidth={1}
                        borderColor="gray.300"
                        borderRadius="md"
                        p={2}
                      >
                        <Datepicker
                          fontSize="md"
                          fontFamily="IranSans"
                          input={
                            <input
                              style={{
                                borderColor: "gray",
                                borderWidth: "1px",
                              }}
                              placeholder="تاریخ اعتبار را انتخاب کنید..."
                            />
                          }
                          id="expirationDate"
                          closeWhenSelectADay={true}
                          format={"YYYY/MM/DD"}
                          adjustPosition="auto"
                          theme="green"
                          allowClear={true}
                          name="expirationDate"
                          value={formData?.expirationDate}
                          onChange={(e) =>
                            handleChangeFormData({
                              target: {
                                value: e ? e : "",
                                name: "expirationDate",
                              },
                            })
                          }
                        />
                      </Box>
                      {/* <Text>
                        {dayjs(formData?.expirationDate)
                          .locale("fa")
                          .format("YYYY/MM/DD")}
                      </Text> */}
                    </HStack>
                  </FormControl>
                </Stack>
              </Box>
              <Box
                flex={3}
                p={4}
                borderRadius="md"
                mx={isDesktop ? "" : "auto"}
              >
                <SimpleGrid
                  alignItems="center"
                  columns={{ base: 1, md: 1, lg: 3 }}
                  spacing={4}
                  minChildWidth="260px"
                >
                  <PaperMoneyInput
                    isDesktop={isDesktop}
                    title={"اطلاعات تهاتر"}
                    display={
                      formData?.paymentStatus === "تهاتر" ||
                      formData?.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />
                  <ChequeInput
                    isDesktop={isDesktop}
                    title={"اطلاعات چک"}
                    display={
                      formData?.paymentStatus === "چک" ||
                      formData?.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />

                  <TrustInput
                    isDesktop={isDesktop}
                    title={"اطلاعات امانی"}
                    display={
                      formData?.paymentStatus === "امانی" ||
                      formData?.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />
                </SimpleGrid>
              </Box>
            </Flex>

            <FormControl isRequired>
              <HStack>
                <FormLabel width="170px">انتخاب کالا</FormLabel>
              </HStack>
            </FormControl>

            <Flex
              direction={isDesktop ? "" : "column"}
              flexWrap={isDesktop ? "wrap" : ""}
              minH="100px"
              rowGap={3}
              p={2}
              dir="ltr"
              w="full"
              columnGap={3}
              borderStyle="dashed"
              borderRadius="md"
              borderWidth={1}
            >
              {proformaItems.map((item, index) => (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  p={3}
                  w="250px"
                  boxShadow="md"
                  position="relative"
                  key={index + "-depotGood"}
                  mx={isDesktop ? "" : "auto"}
                >
                  <Flex justify="space-between" align="center">
                    <IconButton
                      colorScheme="red"
                      variant="ghost"
                      size="xs"
                      icon={<CircleX />}
                      onClick={() => {
                        handleRemoveItem(item);
                      }}
                    />

                    <Text
                      title={item?.good?.goodName}
                      mx={1}
                      dir="rtl"
                      fontFamily="IranSans"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      {item?.good?.goodName
                        ? item?.good?.goodName?.length <= 25
                          ? item?.good?.goodName
                          : item?.good?.goodName.substring(0, 22) + "..."
                        : "نا مشخص"}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" columnGap={3} mt={3} dir="rtl">
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      تعداد
                    </Text>
                    <NumberInput
                      variant="flushed"
                      size="xs"
                      textAlign="center"
                      fontFamily="IranSans"
                      defaultValue={1}
                      dir="ltr"
                      min={1}
                      name="quantity"
                      value={item?.quantity}
                      onChange={(value) =>
                        handleItemChange(index, "quantity", value)
                      }
                      placeholder="تعداد"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Text
                      dir="rtl"
                      fontFamily="iransans"
                      fontSize="xs"
                      my="auto"
                    >
                      {item?.good?.goodUnit?.unitName}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" columnGap={3} mt={3} dir="rtl">
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      قیمت
                    </Text>
                    <Input
                      isInvalid={
                        !item?.price ||
                        isNaN(Number(item?.price)) ||
                        item?.price == 0
                      }
                      size="sm"
                      variant="flushed"
                      textAlign="left"
                      fontFamily="IranSans"
                      name="price"
                      value={Number(item?.price).toLocaleString()}
                      placeholder="قیمت"
                      onChange={(e) => {
                        const rawVal = e.target.value.replaceAll(",", "");
                        if (isNaN(Number(rawVal))) {
                          handleItemChange(index, "price", 0);
                          return;
                        }
                        const numVal = Number(rawVal);
                        handleItemChange(index, "price", numVal);
                      }}
                    />
                  </Flex>
                  <Flex justify="space-between" columnGap={8} mt={3} dir="rtl">
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      جمع
                    </Text>
                    <Input
                      readOnly
                      size="sm"
                      variant="flushed"
                      textAlign="left"
                      fontFamily="IranSans"
                      name="total"
                      value={Number(
                        item?.quantity * item.price
                      ).toLocaleString()}
                      placeholder="جمع کل"
                      onChange={(e) =>
                        handleItemChange(index, "total", e.target.value)
                      }
                    />
                  </Flex>

                  <Flex justify="space-between" columnGap={3} mt={3} dir="rtl">
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      توضیحات
                    </Text>
                    <Input
                      variant="flushed"
                      size="sm"
                      name="description"
                      value={item?.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </Flex>
                </Box>
              ))}
              <IconButton
                ml={3}
                icon={<PlusCircle size="lg" strokeWidth={1.2} />}
                size="lg"
                my="auto"
                mx={isDesktop ? "" : "auto"}
                colorScheme="green"
                variant="ghost"
                onClick={() => setShowSearchGood(true)}
              />
              <Flex
                hidden={proformaItems?.length == 0}
                p={3}
                justify="space-between"
                columnGap={5}
                dir="rtl"
                mt="auto"
                mx={isDesktop ? "" : "auto"}
                borderWidth={0.5}
                borderStyle="dashed"
              >
                <Text fontSize="md" textAlign="center" fontFamily="IranSans">
                  جمع کل: {Number(totalPrice).toLocaleString()}
                </Text>

                <Text
                  px={5}
                  fontSize="md"
                  textAlign="center"
                  fontFamily="IranSans"
                  borderRightWidth={0.5}
                  borderColor="gray.300"
                >
                  تعداد کل: {totalQuantity}
                </Text>
              </Flex>
            </Flex>

            <Input
              placeholder=" توضیحات فاکتور"
              name="description"
              value={formData?.description}
              onChange={handleChangeFormData}
            />
            <Flex
              columnGap={2}
              hidden={!formData?.approvedFile}
              mt={3}
              alignItems={isDesktop ? "" : "center"}
              dir="rtl"
              direction="column"
              borderWidth={1}
              borderColor="gray.100"
              borderStyle="dashed"
              borderRadius="md"
              p={2}
              fontFamily="iransans"
              fontSize="13px"
            >
              <Text bg="gray.100" textAlign="center" fontSize="17px" w="full">
                مدارک تایید پیش فاکتور
              </Text>
              <Flex columnGap={2} p={2}>
                <Box
                  onClick={() => setShowModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={approvedFile == null || approvedFile == ""}
                  boxSize={"150px"}
                >
                  <Image
                    src={approvedFile ? approvedFile : ""}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="تاییدیه"
                  />
                </Box>
              </Flex>
            </Flex>
            {/* <Flex alignItems="center" mt={3} dir="rtl">
              <FormLabel> تصویر</FormLabel>
              {formData.approvedFile && (
                <Box
                  onClick={() => setShowModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={approvedFile == null || approvedFile == ""}
                  boxSize={"150px"}
                >
                  <Image
                    src={approvedFile ? approvedFile : ""}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="تاییدیه"
                  />
                </Box>
              )}
            </Flex> */}

            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              disabled={formData?.isConverted}
              title={
                formData?.isConverted
                  ? "این پیش فاکتور به فاکتور تبدیل شده است"
                  : ""
              }
            >
              ثبت تغییرات پیش فاکتور
            </Button>
          </Flex>
        </CardBody>
      </Card>
      <MyModal
        modalHeader=" فایل تاییدیه مشتری"
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={approvedFile == null || approvedFile == ""}
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={approvedFile ? approvedFile : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تاییدیه"
          />
        </Box>
      </MyModal>
      <SearchCustomer
        searchItems={handleSearchCustomers}
        isOpen={showSearchCustomer}
        onClose={() => setShowSearchCustomer(false)}
        onSelect={(g) => {
          handleChangeFormData({
            target: { name: "customer", value: g },
          });
          setShowSearchCustomer(false);
        }}
      />
      <SearchGoods
        searchItems={handleSearchGoods}
        isOpen={showSearchGood}
        onClose={() => setShowSearchGood(false)}
        onSelect={(g) => {
          handleAddNewItem(g);
          //handleItemChange(selectedItem, "good", g.id);
          setShowSearchGood(false);
        }}
      />
      {loading && <MyLoading />}
    </Box>
  );
};
