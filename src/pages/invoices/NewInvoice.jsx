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
  VStack,
  useToast,
  Text,
  Spinner,
  Tfoot,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Box,
  Stack,
  TableContainer,
  Divider,
  SimpleGrid,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateInvoice } from "../../api/services/invoiceService";
import { useNavigate } from "react-router-dom";
import { ShowAllCustomers } from "../../api/services/customerService";
import {
  ShowProformasByID,
  ShowUserAllProformas,
} from "../../api/services/proformaService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { MyLoading } from "../../my-components/MyLoading";
import { PaperMoneyInput } from "../../my-components/paymentStatus/PaperMoneyInput";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";
import { TrustInput } from "../../my-components/paymentStatus/TrustInput";

export const NewInvoice = ({ isDesktop }) => {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [proformas, setProformas] = useState([]);
  const [allGoods, setAllGoods] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    proforma: {},
    customer: {},
    totalAmount: 0,
    paymentStatus: 0,
    chequeDate: "",
    chequeAmount: 0,
    chequeSerial: 0,
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    invoiceGoods: [],
  });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedProforma, setSelectedProforma] = useState(0);

  const [formError, setFormError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [proformaLoading, setProformaLoading] = useState(false);
  const [goodLoading, setGoodLoading] = useState(false);
  const [invoiceGoodsStatus, setInvoiceGoodsStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res1 = await ShowAllCustomers();
      if (!res1.success) {
        toast({
          title: "خطایی رخ داد",
          description: res1.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setCustomers(res1?.data?.items);

      const res2 = await ShowUserAllProformas();
      if (!res2.success) {
        toast({
          title: "خطایی رخ داد",
          description: res2.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setProformas(res2?.data?.items);

      const res3 = await ShowAllGoods();
      if (!res3.success) {
        toast({
          title: "خطایی رخ داد",
          description: res3.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setAllGoods(res3?.data?.items);
    };
    loadData();
  }, []);

  useEffect(() => {
    recalculateTotal();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await CreateInvoice({ ...formData, totalAmount: totalPrice });

    if (res.success) {
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

    setFormData({
      id: 0,
      title: "",
      proforma: {},
      customer: {},
      totalAmount: 0,
      paymentStatus: 0,
      chequeDate: "",
      chequeAmount: 0,
      chequeSerial: 0,
      paperMoneyAmount: 0,
      paperMoneySerial: 0,
      trustIssueDate: "",
      invoiceGoods: [],
    });
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
    const newItems = formData.invoiceGoods;
    if (newItems.length === 0)
      newItems.push({
        uniqueId: Date.now().toString(),
        no: 1,
        id: 0,
        good: {},
        price: 0,
        quantity: 0,
        total: 0,
      });

    if (newItems.length > 0)
      newItems[index][field] =
        field === "quantity" || field === "goodPrice" ? Number(value) : value;

    if (field === "good" && Number(value) > 0) {
      const selected = allGoods.find((p) => p.id === Number(value));

      if (selected) {
        newItems[index].price = selected.goodPrice;
        newItems[index].good = selected;
        newItems[index].total = selected.goodPrice * newItems[index].quantity;
      }
    }

    if (field === "quantity" || field === "goodPrice") {
      const qty = field === "quantity" ? value : newItems[index].quantity;
      const prc = field === "price" ? value : newItems[index].price;
      newItems[index].total = qty * prc;
    }
    console.log("afterNewItems", newItems);
    setFormData({ ...formData, invoiceGoods: newItems });
  };

  const recalculateTotal = () => {
    const items = formData.invoiceGoods;
    const total = items.reduce((sum, i) => sum + i.total, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = () => {
    const items = [...formData.invoiceGoods];
    const newItem = {
      uniqueId: Date.now().toString(),
      no: items?.length > 0 ? items[items.length - 1]?.no + 1 : 1,
      id: 0,
      good: {},
      price: 0,
      quantity: 0,
      total: 0,
    };
    items.push(newItem);

    setFormData({ ...formData, invoiceGoods: items });
  };

  const handleChangeCustomerData = (id) => {
    const newCustomer = customers.find((c) => c.id == id);
    if (newCustomer) setFormData({ ...formData, customer: newCustomer });
  };

  const handleChangeProformaData = (id) => {
    if (id === 0 || id === "") {
      setInvoiceGoodsStatus(true);
      setFormData({ ...formData, invoiceGoods: [] });
      return;
    }
    const newProforma = proformas.find((p) => p.id == id);

    if (newProforma) setFormData({ ...formData, proforma: newProforma });
    else {
      setInvoiceGoodsStatus(true);
      return;
    }

    const items = newProforma.proformaGoods;
    if (items?.length === 0) {
      setInvoiceGoodsStatus(true);
      toast({
        title: "توجه",
        description: `برای این پیش فاکتور کالایی ثبت نشده است`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }
    setInvoiceGoodsStatus(false);
    setFormData({ ...formData, invoiceGoods: items, proforma: newProforma });
  };

  const handleRemoveItem = (item) => {
    const items = [...formData.invoiceGoods];
    const updated = items.filter((i) => i.uniqueId !== item.uniqueId);

    for (let i = 0; i < updated.length; i++) {
      updated[i].no = i + 1;
    }
    setFormData({ ...formData, invoiceGoods: updated });
  };

  const handleDeleteAllItems = () => {
    setFormData({ ...formData, invoiceGoods: [] });
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
        minH="100%"
        h={isDesktop ? "100%" : "110vh"}
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
            ثبت فاکتور جدید
          </CardHeader>
        )}
        <CardBody>
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
                        name="title"
                        value={formData.title}
                        placeholder="عنوان"
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="120px">
                        نام مشتری
                      </FormLabel>
                      <Select
                        disabled={customerLoading}
                        dir="ltr"
                        name="customer"
                        placeholder="یک نفر را انتخاب کنید"
                        value={formData.customer.id}
                        onChange={(e) =>
                          handleChangeCustomerData(e.target.value)
                        }
                      >
                        {customers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.customerFName + " " + p.customerLName}
                          </option>
                        ))}
                      </Select>
                      {customerLoading && (
                        <Spinner color="red.500" size={"sm"} />
                      )}
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="120px">
                        شماره پیش‌ فاکتور
                      </FormLabel>
                      <Select
                        disabled={proformaLoading}
                        dir="ltr"
                        name="proforma"
                        placeholder="یک پیش‌فاکتور انتخاب کنید"
                        value={formData.proforma.id}
                        onChange={(e) => {
                          handleChangeProformaData(e.target.value);
                        }}
                      >
                        {proformas.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.id + " - " + p.title}
                          </option>
                        ))}
                      </Select>
                      {proformaLoading && (
                        <Spinner color="red.500" size={"sm"} />
                      )}
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
            <Divider />
            <Box p={1} borderRadius="md">
              <TableContainer dir="rtl">
                <Table
                  variant="simple"
                  borderColor="blackAlpha.200"
                  borderWidth={1}
                  bor
                  derRadius="md"
                  _disabled={!invoiceGoodsStatus}
                >
                  <Thead h="50px" bg="#666c85" textFillColor="white">
                    <Tr>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                        width="100px"
                      >
                        ردیف
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                        width="400px"
                      >
                        نام کالا
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                        width="100px"
                      >
                        تعداد
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                        width="200px"
                      >
                        واحد
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                        width="300px"
                      >
                        قیمت واحد
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="Vaziri"
                        width="300px"
                      >
                        قیمت کل
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="Vaziri"
                        width="300px"
                      >
                        توضیحات
                      </Th>
                      <Th bg="white">
                        <IconButton
                          isDisabled={!invoiceGoodsStatus}
                          icon={<Plus />}
                          onClick={handleAddNewItem}
                          colorScheme="green"
                        />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData.invoiceGoods.map((item, index) => (
                      <Tr key={item.no}>
                        <Td>
                          <Input
                            readOnly
                            isDisabled={!invoiceGoodsStatus}
                            value={item.no}
                            onChange={(e) =>
                              handleItemChange(index, "no", e.target.value)
                            }
                            fontSize="md"
                            fontFamily="IranSans"
                            placeholder="ردیف"
                          />
                        </Td>
                        <Td>
                          <HStack>
                            <Select
                              disabled={goodLoading || !invoiceGoodsStatus}
                              name="id"
                              key={item.good}
                              defaultValue={0}
                              dir="ltr"
                              placeholder="انتخاب کنید"
                              value={item.good.id}
                              onChange={(e) =>
                                handleItemChange(index, "good", e.target.value)
                              }
                            >
                              {allGoods.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.goodName}
                                </option>
                              ))}
                            </Select>
                            {goodLoading && (
                              <Spinner size={"sm"} color="red.500" />
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          <NumberInput
                            fontSize="md"
                            fontFamily="IranSans"
                            isDisabled={!invoiceGoodsStatus}
                            defaultValue={1}
                            key={"quantity" + item.id}
                            dir="ltr"
                            min={1}
                            name="quantity"
                            value={item.quantity}
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
                        </Td>
                        <Td>
                          <Input
                            disabled
                            placeholder="واحد"
                            name="unitName"
                            value={item?.good?.goodUnit?.unitName}
                          />
                        </Td>
                        <Td>
                          <Input
                            textAlign="left"
                            fontSize="md"
                            fontFamily="IranSans"
                            isDisabled={!invoiceGoodsStatus}
                            type="number"
                            name="goodPrice"
                            value={item.price}
                            placeholder="قیمت واحد"
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "goodPrice",
                                e.target.value
                              )
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            textAlign="left"
                            fontSize="md"
                            fontFamily="IranSans"
                            readOnly
                            type="number"
                            name="goodPrice"
                            value={Number(item.total).toLocaleString()}
                            placeholder="قیمت"
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "goodPrice",
                                e.target.value
                              )
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            isDisabled={!invoiceGoodsStatus}
                            name="description"
                            value={item.description}
                            key={"description" + item.id}
                            placeholder="توضیحات"
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </Td>
                        <Td>
                          <IconButton
                            isDisabled={!invoiceGoodsStatus}
                            icon={<Minus />}
                            key={item.no}
                            onClick={() => handleRemoveItem(item)}
                            colorScheme="red"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tfoot>
                    <Th width="100px"></Th>
                    <Th width="200px"></Th>
                    <Th width="200px">
                      <Text
                        textAlign="center"
                        fontSize="md"
                        fontFamily="IranSans"
                      >
                        تعداد کل: {Number(totalQuantity).toLocaleString()}
                      </Text>
                    </Th>
                    <Th width="200px"></Th>
                    <Th width="300px"></Th>
                    <Th width="300px">
                      <Text
                        textAlign="center"
                        fontSize="md"
                        fontFamily="IranSans"
                      >
                        جمع کل: {Number(totalPrice).toLocaleString()}
                      </Text>
                    </Th>
                    <Th width="300px"></Th>
                    <Th>
                      {formData.invoiceGoods.length > 0 && (
                        <IconButton
                          isDisabled={!invoiceGoodsStatus}
                          bg="maroon"
                          color="white"
                          icon={<Trash2 />}
                          onClick={handleDeleteAllItems}
                        />
                      )}
                    </Th>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Box>

            <Input
              placeholder=" توضیحات فاکتور"
              name="description"
              value={formData.description}
              onChange={handleChangeFormData}
            />
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              ثبت فاکتور
            </Button>
          </Flex>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
