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
  AbsoluteCenter,
  Spinner,
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
import { MyModal } from "../../my-components/MyModal";

export const NewProforma = ({ isDesktop }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customers, setCustomers] = useState([]);
  const [allGoods, setAllGoods] = useState([]);

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

  return (
    <Box>
      <Card
        overflowY="auto"
        minH="100%"
        h={isDesktop ? "100%" : "108vh"}
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
            ثبت پیش فاکتور جدید
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
                        name="title"
                        value={formData.title}
                        placeholder="عنوان"
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="100px">
                        نام مشتری
                      </FormLabel>
                      <Input
                        placeholder="لطفا یک مشتری انتخاب کنید"
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
                      {formData.customer && (
                        <IconButton
                          size={isDesktop ? "md" : "sm"}
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
              <Box flex={1} p={1} borderRadius="md">
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
            <Box px={1}>
              <TableContainer dir="rtl">
                <Table
                  variant="simple"
                  borderColor="blackAlpha.200"
                  borderWidth={1}
                  borderRadius="md"
                >
                  <Thead h="50px">
                    <Tr bg="#666c85" textFillColor="white">
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                      >
                        ردیف
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                      >
                        نام کالا
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                      >
                        تعداد
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                      >
                        واحد
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                      >
                        قیمت واحد
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                      >
                        قیمت کل
                      </Th>
                      <Th
                        fontSize="md"
                        textAlign="center"
                        fontFamily="IranSans"
                        width="300px"
                      >
                        توضیحات
                      </Th>
                      <Th bg="white">
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
                            fontFamily="IranSans"
                            fontSize="md"
                            readOnly
                            value={item.no}
                            onChange={(e) =>
                              handleItemChange(index, "no", e.target.value)
                            }
                            placeholder="ردیف"
                            minW={10}
                          />
                        </Td>
                        <Td minW={400}>
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
                            fontSize="md"
                            textAlign="center"
                            fontFamily="IranSans"
                            defaultValue={1}
                            dir="ltr"
                            min={1}
                            name="quantity"
                            value={item.quantity}
                            onChange={(value) =>
                              handleItemChange(index, "quantity", value)
                            }
                            placeholder="تعداد"
                            maxW={100}
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
                            placeholder="واحد"
                            name="goodUnitName"
                            value={item.goodUnitName}
                            minW="80px"
                            maxW="150px"
                          />
                        </Td>
                        <Td>
                          <Input
                            fontSize="md"
                            textAlign="left"
                            fontFamily="IranSans"
                            minW="85px"
                            maxW="300px"
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
                            readOnly
                            fontSize="md"
                            textAlign="left"
                            minW="85px"
                            maxW="500px"
                            fontFamily="IranSans"
                            type="text"
                            name="goodPrice"
                            value={Number(
                              item?.quantity * item?.goodPrice
                            ).toLocaleString()}
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
                            minW="95px"
                            maxW="250px"
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
                      <Th></Th>
                      <Th></Th>
                      <Th>
                        <Text
                          fontSize="md"
                          textAlign="center"
                          fontFamily="IranSans"
                        >
                          تعداد کل: {totalQuantity}
                        </Text>
                      </Th>
                      <Th></Th>
                      <Th></Th>
                      <Th>
                        <Text
                          fontSize="md"
                          textAlign="center"
                          fontFamily="IranSans"
                        >
                          جمع کل: {Number(totalPrice).toLocaleString()}
                        </Text>
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
        <MyModal
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
            handleItemChange(selectedItem, "good", g.id);
            setShowSearchGood(false);
          }}
        />
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
