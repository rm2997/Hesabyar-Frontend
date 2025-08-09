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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Text,
  Spinner,
  Tfoot,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  TableContainer,
  Flex,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  SimpleGrid,
  Image,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { MyLoading } from "../MyLoading";
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import {
  CircleX,
  Minus,
  PackageSearch,
  Plus,
  PlusCircle,
  ScanSearch,
  Trash2,
  UserSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  ShowInvoiceApprovedFile,
  UpdateInvoice,
} from "../../api/services/invoiceService";

import { ShowAllCustomers } from "../../api/services/customerService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";
import { PaperMoneyInput } from "../../my-components/paymentStatus/PaperMoneyInput";
import { TrustInput } from "../../my-components/paymentStatus/TrustInput";

import { SearchGoods } from "../SearchGood";
import { SearchCustomer } from "../SearchCustomer";
import { MyModal } from "../MyModal";
import { SearchProforma } from "../SearchProforma";
import {
  ShowMyAcceptedProformas,
  ShowUserAllProformas,
} from "../../api/services/proformaService";
import { PersianAlphabet } from "../../api/services/enums/persianAlphabets.enum";

export const EditInvoice = ({
  isDesktop,
  invoice,
  onUpdate,
  isOpen,
  onClose,
}) => {
  const toast = useToast();

  dayjs.extend(jalali);
  const [formData, setFormData] = useState({
    title: "",
    customer: null,
    totalAmount: 0,
    paymentStatus: 0,
    chequeAmount: 0,
    chequeSerial: 0,
    chequeDate: "",
    paperMoneyDate: "",
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    invoiceGoods: null,
    description: "",
    driver: "",
    driverCarNumber: "",
    driverNatCode: "",
    driverMobile: "",
    driverToken: "",
    driverTokenIsSent: false,
  });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [approvedFile, setApprovedFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedItem, setSelectedItem] = useState(0);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showSearchProforma, setShowSearchProforma] = useState(false);
  const [showSearchGood, setShowSearchGood] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = invoice.invoiceGoods;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await ShowInvoiceApprovedFile(invoice.id);
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
        const url = URL.createObjectURL(res?.data);
        setApprovedFile(url);
      }
      setFormData({ ...invoice, invoiceGoods: [...invoice.invoiceGoods] });
      setInvoiceItems([...invoice.invoiceGoods]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    recalculateTotal();
  }, [formData]);

  const initForm = () => {
    setFormData({
      title: "",
      customer: null,
      totalAmount: 0,
      paymentStatus: 0,
      chequeAmount: 0,
      chequeSerial: 0,
      chequeDate: "",
      paperMoneyDate: "",
      paperMoneyAmount: 0,
      paperMoneySerial: 0,
      trustIssueDate: "",
      invoiceGoods: null,
      approvedFile: "",
      description: "",
      driver: "",
      driverCarNumber: "",
      driverNatCode: "",
      driverMobile: "",
      driverToken: "",
      driverTokenIsSent: false,
    });
    setInvoiceItems([]);
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
    if (!data.invoiceGoods || data.invoiceGoods?.length < 1) {
      toast({
        title: "توجه",
        description: "باید حداقل یک کالا انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const goodQCheck = data.invoiceGoods.every((good) => {
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

    const goodACheck = data.invoiceGoods.every((good) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = [...invoiceItems];
    items.forEach((i) => (i.total = i.price * i.quantity));

    const data = { ...formData };
    data.invoiceGoods = [...items];
    data.totalAmount = totalPrice;
    data.totalQuantity = totalQuantity;
    setFormData(data);
    if ((await validateForm(data)) == false) return;

    setLoading(true);
    const res = await UpdateInvoice(formData.id, data);
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
      description: `اطلاعات فاکتور شما ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
    onClose();
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
    recalculateTotal();
  };

  const handleRemoveItem = (item) => {
    const items = invoiceItems.filter((i) => i?.good?.id != item?.good?.id);
    setInvoiceItems([...items]);
    setSelectedItem(null);
    recalculateTotal();
  };

  const handleDeleteAllItems = () => {
    setInvoiceItems([]);
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
    return response?.data?.items;
  };

  const handleSearchProforma = async (query) => {
    const response = await ShowMyAcceptedProformas(1, 10, query);
    return response?.data?.items;
  };

  const handleChangeProformaData = (proforma) => {
    const newItems = [...proforma.proformaGoods];
    setInvoiceItems([...newItems]);
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
            ویرایش فاکتور
          </CardHeader>
        )}
        <CardBody borderTopWidth={2}>
          <Flex direction="column" gap={4} as="form" onSubmit={handleSubmit}>
            <Flex direction={{ base: "column", md: "row" }} gap={5}>
              <Box flex={1} p={1} borderRadius="md">
                <Stack spacing={5} direction="column">
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="120px">
                        عنوان
                      </FormLabel>
                      <Input
                        w={250}
                        name="title"
                        value={formData.title}
                        placeholder="عنوان"
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>

                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="300px">
                        نام مشتری
                      </FormLabel>
                      <Input
                        placeholder="لطفا یک مشتری انتخاب کنید"
                        maxW="300px"
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
                      {formData.customer && (
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

                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="170px">
                        پیش‌ فاکتور
                      </FormLabel>
                      <Input
                        placeholder="لطفا یک پیش فاکتور انتخاب کنید"
                        maxW="560px"
                        onClick={() => setShowSearchProforma(true)}
                        value={
                          formData?.proforma
                            ? formData?.proforma?.title +
                              " - " +
                              formData?.proforma?.id
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
                      <FormLabel hidden={!isDesktop} width="120px">
                        نوع پرداخت
                      </FormLabel>
                      <Select
                        w={250}
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
                </Stack>
              </Box>
              <Box flex={3} p={4} borderRadius="md">
                <SimpleGrid
                  columns={{ base: 1, md: 3, lg: 3 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
                  spacing={4}
                  minChildWidth="260px"
                >
                  <PaperMoneyInput
                    isDesktop={isDesktop}
                    title={"اطلاعات سفته"}
                    display={
                      formData.paymentStatus === "سفته" ||
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
              {invoiceItems.map((item, index) => (
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
                      size="sm"
                      variant="flushed"
                      textAlign="left"
                      fontFamily="IranSans"
                      name="price"
                      value={item?.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
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
                مدارک واریز وجه
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
            <Flex
              columnGap={2}
              hidden={!formData?.driver}
              mt={3}
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
              <Text bg="gray.100" textAlign="center" fontSize="17px">
                مشخصات راننده
              </Text>
              <Flex columnGap={2} p={2}>
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
                <Flex
                  borderWidth={1}
                  borderColor="gray.200"
                  columnGap={2}
                  p={1}
                >
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
            <Input
              placeholder="توضیحات فاکتور"
              name="description"
              value={formData.description}
              onChange={handleChangeFormData}
            />
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              isDisabled={formData?.finished}
              title={
                formData?.finished
                  ? "سند خروج این فاکتور ثبت شده است بنابراین امکان ویرایش وجود ندارد"
                  : ""
              }
            >
              ثبت تغییرات فاکتور
            </Button>
          </Flex>
        </CardBody>
        <CardFooter></CardFooter>
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
