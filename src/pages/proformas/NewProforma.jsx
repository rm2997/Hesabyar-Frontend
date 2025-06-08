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
} from "@chakra-ui/react";
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
import { CreateProforma } from "../../api/services/proformaService";
import { ShowAllCustomers } from "../../api/services/customerService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { MyLoading } from "../../my-components/MyLoading";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";
import { PaperMoneyInput } from "../../my-components/paymentStatus/PaperMoneyInput";
import { TrustInput } from "../../my-components/paymentStatus/TrustInput";
import { NewCustomer } from "../customers/NewCustomer";
import { SearchCustomer } from "../../my-components/SearchCustomer";
import { SearchGoods } from "../../my-components/SearchGood";

export const NewProforma = ({ isDesktop }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customers, setCustomers] = useState([]);
  const [allGoods, setAllGoods] = useState([]);
  console.log(isDesktop);
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
    proformaGoods: null,
    description: "",
  });
  const [proformaItems, setProformaItems] = useState([
    {
      uniqueId: Date.now().toString(),
      no: 1,
      good: null,
      goodName: 0,
      price: 0,
      goodUnitName: "",
      quantity: 0,
      total: 0,
      description: "",
    },
  ]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showSearchGood, setShowSearchGood] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // await ShowAllCustomers(1, -1, "").then((res) =>
      // setCustomers(res?.data?.items)
      // );
      await ShowAllGoods(1, -1, "").then((res) =>
        setAllGoods(res?.data?.items)
      );
    };

    loadData().finally(setLoading(false));
  }, []);

  const handleSearchCustomers = async (query) => {
    const response = await ShowAllCustomers(1, 10, query);
    return response.data.items;
  };

  const handleSearchGoods = async (query) => {
    const response = await ShowAllGoods(1, 10, query);

    return response.data.items;
  };

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
      proformaGoods: null,
      description: "",
    });
    setProformaItems([]);
    setTotalQuantity(0);
    setTotalPrice(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    data.proformaGoods = [...proformaItems];
    data.totalAmount = totalPrice;
    setFormData(data);
    setLoading(true);
    try {
      const response = await CreateProforma(data);
      if (!response.data) return;
      initForm();
      toast({
        title: "ثبت شد",
        description: `اطلاعات پیش فاکتور شما ذخیره شد`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "خطایی رخ داد",
        description: `${err}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...proformaItems];
    newItems[index][field] =
      field === "quantity" || field === "goodPrice" ? Number(value) : value;

    if (field === "good" && Number(value) > 0) {
      const selected = allGoods.find((p) => p.id === Number(value));
      if (selected) {
        newItems[index].goodPrice = selected.goodPrice;
        newItems[index].price = selected.goodPrice;
        newItems[index].goodName = selected.goodName;
        newItems[index].goodUnitName = selected.goodUnit?.unitName;
        newItems[index].total = selected.goodPrice * newItems[index].quantity;
      }
    }

    if (field === "quantity" || field === "goodPrice") {
      const qty = field === "quantity" ? value : newItems[index].quantity;
      const prc = field === "price" ? value : newItems[index].goodPrice;
      newItems[index].total = qty * prc;
    }

    setProformaItems(newItems);
    recalculateTotal();
  };

  const recalculateTotal = () => {
    const total = proformaItems.reduce((sum, i) => sum + i.total, 0);
    const count = proformaItems.reduce((sum, i) => sum + i.quantity, 0);
    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = () => {
    const items = [...proformaItems];
    const newItem = {
      uniqueId: Date.now().toString(),
      no: items?.length > 0 ? items[items.length - 1]?.no + 1 : 1,
      good: 0,
      goodName: 0,
      goodPrice: 0,
      price: 0,
      goodUnitName: "",
      quantity: 0,
      amount: 0,
      description: "",
    };
    items.push(newItem);
    setProformaItems(items);
  };

  const handleRemoveItem = (item) => {
    const updated = [...proformaItems].filter(
      (i) => i.uniqueId != item.uniqueId
    );

    for (let i = 0; i < updated.length; i++) {
      updated[i].no = i + 1;
    }

    setProformaItems(updated);
    recalculateTotal();
  };

  const handleDeleteAllItems = () => {
    setProformaItems([]);
    setTotalPrice(0);
    setTotalQuantity(0);
  };

  const handleChangeFormData = (e) => {
    console.log(e);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewUser = () => {
    onOpen();
  };

  const handleShowSearchGood = async (id) => {
    setSelectedItem(id);
    setShowSearchGood(true);
  };
  const handleSearchUser = () => {};

  if (loading) return <MyLoading showLoading={true} />;
  else
    return (
      <Card m={10}>
        <CardHeader
          bg="#68C15A"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          color="black"
        >
          ثبت پیش فاکتور جدید
        </CardHeader>
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
                      <FormLabel hidden={!isDesktop} width="120px">
                        نام مشتری
                      </FormLabel>
                      {/* <Select
                        disabled={customerLoading}
                        w={250}
                        dir="ltr"
                        name="customer"
                        placeholder="یک نفر را انتخاب کنید"
                        value={formData.customer}
                        onChange={handleChangeFormData}
                      >
                        {customers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.customerFName + " " + p.customerLName}
                          </option>
                        ))}
                      </Select> */}
                      <Input
                        placeholder="لطفا یک مشتری انتخاب کنید"
                        maxW="250px"
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
                      <IconButton
                        size={"md"}
                        colorScheme="green"
                        icon={<UserRoundPlus />}
                        onClick={handleAddNewUser}
                        title="ثبت مشتری جدید"
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
              <Box flex={1} p={4} borderRadius="md">
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <PaperMoneyInput
                    title={"اطلاعات سفته"}
                    display={
                      formData.paymentStatus === "سفته" ||
                      formData.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />
                  <ChequeInput
                    title={"اطلاعات چک"}
                    display={
                      formData.paymentStatus === "چک" ||
                      formData.paymentStatus === "اعتباری"
                    }
                    formData={formData}
                    handleChangeFormData={handleChangeFormData}
                  />

                  <TrustInput
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
            <Divider />
            <Box p={4} borderRadius="md">
              <TableContainer>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th width="100px">ردیف</Th>
                      <Th width="400px">نام کالا</Th>
                      <Th width="100px">تعداد</Th>
                      <Th width="100px">واحد</Th>
                      <Th width="200px">قیمت واحد</Th>
                      <Th width="300px">قیمت کل</Th>
                      <Th width="300px">توضیحات</Th>
                      <Th>
                        <IconButton
                          icon={<Plus />}
                          onClick={handleAddNewItem}
                          colorScheme="green"
                        />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {proformaItems.map((item, index) => (
                      <Tr key={item.no}>
                        <Td>
                          <Input
                            readOnly
                            value={item.no}
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
                              name="id"
                              key={item.good}
                              defaultValue={0}
                              dir="ltr"
                              placeholder="انتخاب کنید"
                              value={item.good}
                              onChange={(e) =>
                                handleItemChange(index, "good", e.target.value)
                              }
                            >
                              {allGoods.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.goodName}
                                </option>
                              ))}
                            </Select> */}
                            <Input
                              placeholder="انتخاب کنید"
                              maxW="250px"
                              onClick={() =>
                                !item?.goodName
                                  ? handleShowSearchGood(index)
                                  : ""
                              }
                              value={item?.goodName ? item?.goodName : ""}
                              name="good"
                              readOnly
                            />
                            {item?.goodName && (
                              <IconButton
                                mr="-10px"
                                size="md"
                                icon={<CircleX />}
                                colorScheme="red"
                                title="انصراف"
                                variant="ghost"
                                onClick={() => {
                                  setProformaItems((prev) =>
                                    prev.map((i) =>
                                      i.uniqueId == item?.uniqueId
                                        ? { ...i, goodName: "", good: null }
                                        : i
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
                            defaultValue={1}
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
                            name="goodUnitName"
                            value={item.goodUnitName}
                          />
                        </Td>
                        <Td>
                          <Input
                            type="number"
                            name="goodPrice"
                            value={item.goodPrice}
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
                            disabled
                            type="number"
                            name="goodPrice"
                            value={item.quantity * item.goodPrice}
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
                            key={item.no}
                            onClick={() => handleRemoveItem(item)}
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
                        <Text> تعداد کل: {totalQuantity}</Text>
                      </Th>
                      <Th width="200px"></Th>
                      <Th width="300px"></Th>
                      <Th width="300px">
                        <Text>جمع کل: {totalPrice}</Text>
                      </Th>
                      <Th></Th>
                      <Th>
                        {proformaItems.length > 0 && (
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
            </Box>
            <Input
              placeholder=" توضیحات پیش فاکتور"
              name="description"
              value={formData.description}
              onChange={handleChangeFormData}
            />
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              ثبت پیش فاکتور
            </Button>
            <Modal
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
            </Modal>
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
    );
};
