import {
  Button,
  Card,
  CardBody,
  CardFooter,
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
  Box,
  Stack,
  SimpleGrid,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import {
  Captions,
  CircleX,
  FileText,
  Info,
  PlusCircle,
  ScanSearch,
  User,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CreateInvoice } from "../../api/services/invoiceService";
import { useNavigate } from "react-router-dom";
import { ShowAllCustomers } from "../../api/services/customerService";
import {
  ShowMyAcceptedProformas,
  ShowProformasByID,
  ShowUserAcceptedProformasByCustomerId,
  ShowUserAllProformas,
} from "../../api/services/proformaService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { MyLoading } from "../../my-components/MyLoading";
import { PaperMoneyInput } from "../../my-components/paymentStatus/PaperMoneyInput";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";
import { TrustInput } from "../../my-components/paymentStatus/TrustInput";
import { SearchGoods } from "../../my-components/SearchGood";
import { NewCustomer } from "../customers/NewCustomer";
import { MyModal } from "../../my-components/MyModal";
import { SearchCustomer } from "../../my-components/SearchCustomer";
import { SearchProforma } from "../../my-components/SearchProforma";
import { MyInputBox } from "../../my-components/MyInputBox";
import {
  getFiscalYear,
  showAllStocks,
} from "../../api/services/sepidarService";

export const NewInvoice = ({}) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    proforma: null,
    customer: null,
    totalAmount: 0,
    paymentStatus: 0,
    chequeDate: "",
    chequeAmount: 0,
    chequeSerial: 0,
    chequeSayad: "",
    chequeIssuerName: "",
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    invoiceGoods: null,
    description: "",
    fiscalYear: 0,
  });
  const [fiscalYear, setFiscalYear] = useState({});
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [allStocks, setAllStocks] = useState([]);
  const [selectedProforma, setSelectedProforma] = useState(0);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showSearchProforma, setShowSearchProforma] = useState(false);
  const [showSearchGood, setShowSearchGood] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceGoodsStatus, setInvoiceGoodsStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initStocks = async () => {
      await handleShowStocks();
    };
    const initFiscalYear = async () => {
      await handleShowFiscalYear();
    };
    initFiscalYear();
    initStocks();
  }, []);

  useEffect(() => {
    recalculateTotal();
  }, [formData]);

  const handleShowFiscalYear = async () => {
    setLoading(true);
    const response = await getFiscalYear();
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
      id: 0,
      title: "",
      proforma: null,
      customer: null,
      totalAmount: 0,
      paymentStatus: 0,
      stockRef: 0,
      chequeDate: "",
      chequeAmount: 0,
      chequeSerial: 0,
      chequeSayad: "",
      chequeIssuerName: "",
      paperMoneyAmount: 0,
      paperMoneySerial: 0,
      trustIssueDate: "",
      invoiceGoods: null,
      description: "",
    });
    setInvoiceItems([]);
  };

  const validateDate = async (inputDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);

    return date >= today;
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
    if (!data?.invoiceGoods || data?.invoiceGoods?.length < 1) {
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
    const goodQCheck = data?.invoiceGoods?.every((good) => {
      let retVal = true;
      if (!good?.quantity || good?.quantity == 0) {
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

    const goodACheck = data?.invoiceGoods?.every((good) => {
      let retval = true;
      if (!good?.total || good?.total == 0) {
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
    const items = [...invoiceItems];
    items.forEach((i) => (i.total = i.price * i.quantity));

    const data = { ...formData };
    data.invoiceGoods = [...items];
    data.totalAmount = totalPrice;
    data.totalQuantity = totalQuantity;
    data.fiscalYear = fiscalYear.FiscalYearId;
    setFormData(data);

    if ((await validateForm(data)) == false) return;

    setLoading(true);
    const res = await CreateInvoice(data);
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
    initForm();
    toast({
      title: "ثبت شد",
      description: `اطلاعات فاکتور شما ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;

    if (field === "quantity" || field === "price") {
      const qty = field === "quantity" ? value : newItems[index].quantity;
      const prc = field === "price" ? value : newItems[index].goodPrice;
      newItems[index].total = qty * prc;
    }

    setInvoiceItems(newItems);
    recalculateTotal();
  };

  const recalculateTotal = () => {
    const total = invoiceItems?.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );
    const count = invoiceItems?.reduce((sum, i) => sum + i.quantity, 0);
    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = (good) => {
    const items = [...invoiceItems];
    const newItem = {
      quantity: 1,
      total: good?.goodPrice,
      price: good?.goodPrice,
      good: good,
      description: "",
    };
    items.push(newItem);
    setInvoiceItems([...items]);
    setSelectedItem(items?.length);
    const total = items?.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const count = items?.reduce((sum, i) => sum + i.quantity, 0);
    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleSearchCustomers = async (query) => {
    const response = await ShowAllCustomers(1, 10, query);
    return response?.data?.items;
  };

  const handleSearchProforma = async (query) => {
    const response = await ShowUserAcceptedProformasByCustomerId(
      formData?.customer?.id,
      1,
      10,
      query
    );
    return response?.data?.items;
  };

  const handleSearchGoods = async (query) => {
    const response = await ShowAllGoods(1, 10, query);
    return response.data.items;
  };

  const handleChangeProformaData = (proforma) => {
    const newItems = [...proforma.proformaGoods];
    setInvoiceItems([...newItems]);
  };

  const handleRemoveItem = (item) => {
    const items = invoiceItems?.filter((i) => i?.good?.id != item?.good?.id);
    setInvoiceItems([...items]);
    setSelectedItem(null);
    recalculateTotal();
  };

  const handleAddNewUser = () => {
    onOpen();
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Card
        overflowY="auto"
        minH={isDesktop ? "75vh" : "70vh"}
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
                <Text fontFamily="IranSans">ثبت فاکتور جدید</Text>
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
                <Text fontFamily="IranSans">{fiscalYear.FiscalYear}</Text>
              </Flex>
            </Flex>
          </CardHeader>
        )}
        <CardBody borderTopWidth={2}>
          <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
            <Flex
              direction={{ base: "column", md: "row" }}
              columnGap={5}
              rowGap={3}
            >
              <Box flex={1} p={1} borderRadius="md">
                <Stack direction="column">
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} w="23%">
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
                      <FormLabel
                        hidden={!isDesktop}
                        w={formData?.customer ? "30%" : "28%"}
                      >
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
                          size={isDesktop ? "md" : "sm"}
                          icon={<CircleX />}
                          colorScheme="red"
                          title="انصراف"
                          variant="ghost"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              customer: null,
                              proforma: null,
                              invoiceGoods: null,
                            });
                            setInvoiceItems([]);
                          }}
                        />
                      )}
                      <IconButton
                        size={isDesktop ? "md" : "sm"}
                        icon={<UserSearch />}
                        colorScheme="orange"
                        onClick={() => setShowSearchCustomer(true)}
                        title="جستجوی مشتری "
                      />
                      <IconButton
                        size={isDesktop ? "md" : "sm"}
                        colorScheme="green"
                        icon={<UserRoundPlus />}
                        onClick={handleAddNewUser}
                        title="ثبت مشتری جدید"
                      />
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <HStack>
                      <FormLabel
                        hidden={!isDesktop}
                        w={formData?.proforma ? "27%" : "25%"}
                      >
                        پیش‌ فاکتور
                      </FormLabel>
                      <MyInputBox
                        icon={FileText}
                        title="لطفا یک پیش فاکتور انتخاب کنید"
                        onClick={() => setShowSearchProforma(true)}
                        value={
                          formData?.proforma != null
                            ? formData?.proforma?.title +
                              " - " +
                              formData?.proforma?.proformaNumber
                            : ""
                        }
                        name="proforma"
                        readOnly
                      />
                      {formData?.proforma && (
                        <IconButton
                          size={isDesktop ? "md" : "sm"}
                          icon={<CircleX />}
                          colorScheme="red"
                          title="انصراف"
                          variant="ghost"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              proforma: null,
                              invoiceGoods: null,
                            });
                            setInvoiceItems([]);
                          }}
                        />
                      )}
                      <IconButton
                        size={isDesktop ? "md" : "sm"}
                        icon={<ScanSearch />}
                        colorScheme="orange"
                        onClick={() => setShowSearchProforma(true)}
                        title="جستجوی پیش فاکتور "
                      />
                    </HStack>
                  </FormControl>

                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} w="23%">
                        نوع پرداخت
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="paymentStatus"
                        placeholder="نوع پرداخت را انتخاب کنید"
                        value={formData.paymentStatus}
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
                      <FormLabel hidden={!isDesktop} width="170px">
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
                </Stack>
              </Box>
              <Box
                flex={1}
                p={1}
                borderRadius="md"
                mx={isDesktop ? "" : "auto"}
              >
                <Flex
                  columnGap={5}
                  rowGap={3}
                  wrap={"wrap"}
                  direction={isDesktop ? "" : "column"}
                  alignItems={isDesktop ? "" : "center"}
                >
                  <PaperMoneyInput
                    isDesktop={isDesktop}
                    title={"اطلاعات تهاتر"}
                    display={
                      formData.paymentStatus === "تهاتر" ||
                      formData.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />
                  <ChequeInput
                    isDesktop={isDesktop}
                    title={"اطلاعات چک"}
                    display={
                      formData.paymentStatus === "چک" ||
                      formData.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />

                  <TrustInput
                    isDesktop={isDesktop}
                    title={"اطلاعات امانی"}
                    display={
                      formData.paymentStatus === "امانی" ||
                      formData.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />
                </Flex>
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
              {invoiceItems?.map((item, index) => (
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
                          : item?.good?.goodName?.substring(0, 22) + "..."
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
                        item?.quantity * item?.price
                      ).toLocaleString()}
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
                      value={item.description}
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
                hidden={invoiceItems?.length == 0}
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

            <MyInputBox
              icon={Info}
              title=" توضیحات فاکتور"
              name="description"
              value={formData?.description}
              onChange={handleChangeFormData}
            />
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              ثبت فاکتور
            </Button>
          </Flex>
        </CardBody>
      </Card>
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
      <MyModal
        size="xl"
        modalHeader={"ثبت مشتری جدید"}
        onClose={onClose}
        isOpen={isOpen}
      >
        <NewCustomer />
      </MyModal>
      <SearchGoods
        searchItems={handleSearchGoods}
        isOpen={showSearchGood}
        onClose={() => setShowSearchGood(false)}
        onSelect={(g) => {
          handleAddNewItem(g);
          setShowSearchGood(false);
        }}
      />
      <SearchProforma
        searchItems={handleSearchProforma}
        isOpen={showSearchProforma}
        onClose={() => setShowSearchProforma(false)}
        onSelect={(g) => {
          handleChangeFormData({ target: { name: "proforma", value: g } });
          setShowSearchProforma(false);
          handleChangeProformaData(g);
        }}
      />
      {loading && <MyLoading />}
    </Box>
  );
};
