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
  Trash2,
  UserRoundPlus,
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
import { NewCustomer } from "../../pages/customers/NewCustomer";
import { SearchGoods } from "../SearchGood";
import { SearchCustomer } from "../SearchCustomer";
import { MyModal } from "../MyModal";

export const EditInvoice = ({
  isDesktop,
  invoice,
  setInvoices,
  invoices,
  isOpen,
  onClose,
}) => {
  const toast = useToast();

  const [customers, setCustomers] = useState([]);
  const [allGoods, setAllGoods] = useState([]);
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
    invoiceGoods: [],
    description: "",
  });

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [approvedFile, setApprovedFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedItem, setSelectedItem] = useState(0);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showSearchGood, setShowSearchGood] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = invoice.invoiceGoods;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await ShowAllCustomers(1, -1, "").then((res) =>
        setCustomers(res?.data?.items)
      );
      await ShowAllGoods(1, -1, "").then((res) =>
        setAllGoods(res?.data?.items)
      );
      await ShowInvoiceApprovedFile(invoice.id)
        .then((res) => {
          if (!res.data) return;
          console.log(res.data);
          const url = URL.createObjectURL(res.data);
          console.log("url:", url);
          setApprovedFile(url);
        })
        .catch((err) => console.log(err.message));
      for (let i = 0; i < invoice.invoiceGoods.length; i++) {
        invoice.invoiceGoods[i].no = i + 1;
        invoice.invoiceGoods[i].uniqueId = Date.now().toString();
      }

      setFormData({ ...invoice, invoiceGoods: [...invoice.invoiceGoods] });
      setInvoiceItems(invoice.invoiceGoods);
      setLoading(false);
    };
    loadData();
  }, []);

  // useEffect(() => {
  //   setFormData({ ...formData, invoiceGoods: [...items] });
  // }, [items]);

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
      invoiceGoods: null,
      approvedFile: "",
      description: "",
    });
    setInvoiceItems([
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = {
      ...formData,
      invoiceGoods: [...invoiceItems],
      totalAmount: totalPrice,
    };

    const res = await UpdateInvoice(formData.id, submitData);
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
    const newInvoices = invoices.filter((p) => p.id != formData.id);
    newInvoices.push(formData);
    setInvoices(newInvoices);
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
    if (!newItems || newItems?.length === 0) return;

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
    recalculateTotal(newItems);
    setInvoiceItems(newItems);
  };

  const recalculateTotal = (goods) => {
    const items = goods ? [...goods] : [...invoiceItems];

    if (!items) return;
    const total = items.reduce((sum, i) => sum + i.total, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = async () => {
    const items = [...invoiceItems];
    if (!items) return;
    const newItem = {
      uniqueId: Date.now().toString(),
      createdAt: "",
      createdBy: {},
      description: "",
      id: 0,
      quantity: 0,
      price: 0,
      total: 0,
      no: items?.length > 0 ? items[items.length - 1]?.no + 1 : 1,
      good: {},
    };
    items.push(newItem);
    setInvoiceItems(items);
    recalculateTotal(items);
  };

  const handleRemoveItem = (indexToremove, item) => {
    const items = invoiceItems.filter((_, index) => index !== indexToremove);
    if (!items) return;
    for (let i = 0; i < items.length; i++) items[i].no = i + 1;
    setInvoiceItems(items);
    recalculateTotal(items);
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

  const handleShowSearchGood = async (id) => {
    setSelectedItem(id);
    setShowSearchGood(true);
  };

  return (
    <Box>
      <Card
        minH="100%"
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
            <Divider />
            <Box p={4} borderRadius="md">
              <TableContainer>
                <Table
                  borderColor="blackAlpha.200"
                  borderWidth={1}
                  size="sm"
                  variant="simple"
                >
                  <Thead>
                    <Tr bg="#6b749f">
                      <Th
                        textColor="white"
                        textAlign="center"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="100px"
                      >
                        ردیف
                      </Th>
                      <Th
                        textColor="white"
                        textAlign="center"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="400px"
                      >
                        نام کالا
                      </Th>
                      <Th
                        textColor="white"
                        textAlign="center"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="100px"
                      >
                        تعداد
                      </Th>
                      <Th
                        textColor="white"
                        textAlign="center"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="100px"
                      >
                        واحد
                      </Th>
                      <Th
                        textColor="white"
                        textAlign="center"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="200px"
                      >
                        قیمت واحد
                      </Th>
                      <Th
                        textColor="white"
                        textAlign="center"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="300px"
                      >
                        قیمت کل
                      </Th>
                      <Th
                        textColor="white"
                        fontFamily="IranSans"
                        fontSize="md"
                        width="300px"
                      >
                        توضیحات
                      </Th>
                      <Th bg="white">
                        <IconButton
                          icon={<Plus />}
                          onClick={() => handleAddNewItem()}
                          colorScheme="green"
                        />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {invoiceItems.map((item, index) => (
                      <Tr key={"row" + index}>
                        <Td>
                          <Input
                            fontFamily="IranSans"
                            fontSize="md"
                            readOnly
                            name="no"
                            key={"Field_no" + item.id}
                            value={index + 1}
                            onChange={(e) =>
                              handleItemChange(index, "no", e.target.value)
                            }
                            placeholder="ردیف"
                          />
                        </Td>
                        <Td>
                          <HStack>
                            {/* <Select
                              disabled={goodLoading}
                              name="good"
                              key={"good" + index}
                              defaultValue={0}
                              dir="ltr"
                              placeholder="انتخاب کنید"
                              value={item?.good?.id}
                              onChange={(e) =>
                                handleItemChange(index, "good", e.target.value)
                              }
                            >
                              {allGoods.map((i) => (
                                <option key={"option" + i.id} value={i.id}>
                                  {i.goodName}
                                </option>
                              ))}
                            </Select> */}
                            <Input
                              placeholder="انتخاب کنید"
                              maxW="250px"
                              onClick={() =>
                                !item?.good?.goodName
                                  ? handleShowSearchGood(index)
                                  : ""
                              }
                              value={
                                item?.good?.goodName ? item?.good?.goodName : ""
                              }
                              name="good"
                              readOnly
                            />
                            {item?.good?.goodName && (
                              <IconButton
                                mr="-10px"
                                size="md"
                                icon={<CircleX />}
                                colorScheme="red"
                                title="انصراف"
                                variant="ghost"
                                onClick={() => {
                                  setInvoiceItems((prev) =>
                                    prev.map((i) =>
                                      i.id == item.id ? { ...i, good: null } : i
                                    )
                                  );
                                }}
                              />
                            )}
                            <IconButton
                              size={"md"}
                              colorScheme="orange"
                              icon={<PackageSearch />}
                              onClick={() => {
                                handleShowSearchGood(index);
                              }}
                              title="جستجوی کالا "
                            />
                          </HStack>
                        </Td>
                        <Td>
                          <NumberInput
                            fontFamily="IranSans"
                            fontSize="md"
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
                            readOnly
                            key={"unitName" + item.id}
                            placeholder="واحد"
                            name="unitName"
                            value={item?.good?.goodUnit?.unitName}
                          />
                        </Td>
                        <Td>
                          <Input
                            fontFamily="IranSans"
                            fontSize="md"
                            type="number"
                            key={"price" + item.id}
                            name="price"
                            value={item.price}
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
                            fontFamily="IranSans"
                            fontSize="md"
                            readOnly
                            key={"goodPrice" + item.id}
                            type="number"
                            name="goodPrice"
                            value={item.total}
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
                            icon={<Minus />}
                            key={"delete" + item.no}
                            onClick={() => handleRemoveItem(index, item)}
                            colorScheme="red"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th width="100px"></Th>
                      <Th width="200px"></Th>
                      <Th width="200px">
                        <Text
                          textAlign="center"
                          fontFamily="IranSans"
                          fontSize="md"
                        >
                          تعداد کل: {totalQuantity}
                        </Text>
                      </Th>
                      <Th width="200px"></Th>
                      <Th width="300px"></Th>
                      <Th width="300px">
                        <Text
                          textAlign="center"
                          fontFamily="IranSans"
                          fontSize="md"
                        >
                          جمع کل: {Number(totalPrice).toLocaleString()}
                        </Text>
                      </Th>
                      <Th></Th>
                      <Th>
                        {invoiceItems.length > 0 && (
                          <IconButton
                            bg="maroon"
                            color="white"
                            icon={<Trash2 />}
                            onClick={handleDeleteAllItems}
                          />
                        )}
                      </Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
              <HStack marginTop="5px" marginRight="auto">
                <Text>فایل تاییدیه مشتری: </Text>
                {approvedFile ? (
                  <Box
                    overflow="auto"
                    borderRadius="6px"
                    borderColor="orange"
                    borderWidth="1px"
                    hidden={approvedFile == null || approvedFile == ""}
                    boxSize="20"
                  >
                    <Image
                      src={approvedFile ? approvedFile : ""}
                      objectFit="cover"
                      target="_blank"
                      rel="noopener noreferrer"
                      alt={formData.approvedFile}
                    />
                  </Box>
                ) : (
                  <Text>ندارد </Text>
                )}
              </HStack>
            </Box>
            <Input
              placeholder="توضیحات فاکتور"
              name="description"
              value={formData.description}
              onChange={handleChangeFormData}
            />

            <Button colorScheme="blue" type="submit" isLoading={loading}>
              ثبت تغییرات فاکتور
            </Button>
            {/* <Modal
              dir="rtl"
              onClose={onClose}
              size={isDesktop ? "xl" : "full"}
              isOpen={isOpen}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>مشتری جدید</ModalHeader>
                <ModalCloseButton />
                <ModalBody dir="rtl">
                  <NewCustomer />
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal> */}
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
        <SearchGoods
          searchItems={handleSearchGoods}
          isOpen={showSearchGood}
          onClose={() => setShowSearchGood(false)}
          onSelect={(g) => {
            handleItemChange(selectedItem, "good", g.id);
            setShowSearchGood(false);
          }}
        />
      </Card>
      <MyModal
        modalHeader=" فایل تاییدیه مشتری"
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        size={isDesktop ? "xl" : "full"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={approvedFile == null || approvedFile == ""}
          boxSize={isDesktop ? "lg" : "sm"}
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
      {loading && <MyLoading />}
    </Box>
  );
};
