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
  useDisclosure,
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
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import {
  CircleX,
  Minus,
  PackageSearch,
  Plus,
  PlusCircle,
  Trash2,
  UserSearch,
} from "lucide-react";
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
import { NewCustomer } from "../../pages/customers/NewCustomer";
import { SearchGoods } from "../SearchGood";
import { SearchCustomer } from "../SearchCustomer";
import { MyModal } from "../MyModal";

export const EditProforma = ({
  isDesktop,
  proforma,
  setProformas,
  proformas,
  onClose,
}) => {
  const toast = useToast();

  dayjs.extend(jalali);
  const [formData, setFormData] = useState({
    title: "",
    customer: {},
    totalAmount: 0,
    paymentStatus: 0,
    chequeAmount: 0,
    chequeSerial: 0,
    chequeDate: "",
    paperMoneyDate: "",
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    proformaGoods: [],
    description: "",
    isConverted: 0,
  });

  const [proformaItems, setProformaItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [approvedFile, setApprovedFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedItem, setSelectedItem] = useState(0);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showSearchGood, setShowSearchGood] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setFormData({ ...proforma, proformaGoods: [...proforma.proformaGoods] });
      setProformaItems(proforma.proformaGoods);
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
      customer: {},
      totalAmount: 0,
      paymentStatus: 0,
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
    await UpdateProforma(formData.id, data)
      .then((res) => {
        if (res.status !== 200) return;
        const newProformas = proformas.filter((p) => p.id != formData.id);
        newProformas.push(formData);
        setProformas(newProformas);
        initForm();

        toast({
          title: "ثبت شد",
          description: `اطلاعات پیش فاکتور شما ذخیره شد`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      })
      .catch((err) => {
        toast({
          title: "خطایی رخ داد",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    setLoading(false);
    onClose();
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
            ویرایش پیش فاکتور
          </CardHeader>
        )}
        <CardBody>
          <Flex
            direction="column"
            rowGap={4}
            columnGap={4}
            as="form"
            onSubmit={handleSubmit}
          >
            <Flex direction={{ base: "column", md: "row" }}>
              <Box>
                <Stack spacing={4} direction="column">
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="120px">
                        عنوان
                      </FormLabel>
                      <Input
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

                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="120px">
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
                      size="sm"
                      variant="flushed"
                      textAlign="left"
                      fontFamily="IranSans"
                      name="price"
                      value={item?.price}
                      placeholder="قیمت"
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
              value={formData.description}
              onChange={handleChangeFormData}
            />

            <Flex alignItems="center" mt={3} dir="rtl">
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
            </Flex>

            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              disabled={formData.isConverted}
              title={
                formData.isConverted
                  ? "این پیش فاکتور به فاکتور تبدیل شده است"
                  : ""
              }
            >
              ثبت تغییرات پیش فاکتور
            </Button>
          </Flex>
        </CardBody>
        <CardFooter></CardFooter>
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
