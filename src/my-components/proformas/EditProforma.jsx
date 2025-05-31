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
} from "@chakra-ui/react";
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import { Minus, Plus, Trash2, UserRoundPlus, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import {
  ShowProformaApprovedFile,
  UpdateProforma,
} from "../../api/services/proformaService";
import { useNavigate } from "react-router-dom";
import {
  ShowAllCustomers,
  ShowCustomerByID,
} from "../../api/services/customerService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { MyLoading } from "../../my-components/MyLoading";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";
import { PaperMoneyInput } from "../../my-components/paymentStatus/PaperMoneyInput";
import { TrustInput } from "../../my-components/paymentStatus/TrustInput";
import { NewCustomer } from "../../pages/customers/NewCustomer";

export const EditProforma = ({
  isDesktop,
  proforma,
  setProformas,
  proformas,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    proformaGoods: [],
    description: "",
  });
  const [proformaItems, setProformaItems] = useState([
    {
      uniqueId: Date.now().toString(),
      createdAt: "",
      description: "",
      good: {},
      id: 0,
      price: 0,
      quantity: 0,
      total: 0,
    },
  ]);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [approvedFile, setApprovedFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formError, setFormError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [proformaLoading, setProformaLoading] = useState(false);
  const [goodLoading, setGoodLoading] = useState(false);
  const navigate = useNavigate();

  const items = proforma.proformaGoods;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await ShowAllCustomers().then((res) => setCustomers(res.data));
      await ShowAllGoods().then((res) => setAllGoods(res.data));
      await ShowProformaApprovedFile(proforma.id)
        .then((res) => {
          if (!res.data) return;
          console.log(res.data);
          const url = URL.createObjectURL(res.data);
          setApprovedFile(url);
        })
        .catch((err) => console.log(err.message));
      setFormData({ ...proforma, proformaGoods: [...proforma.proformaGoods] });
    };
    loadData().finally(setLoading(false));
  }, []);

  useEffect(() => {
    setFormData({ ...formData, proformaGoods: [...items] });
  }, [items]);

  useEffect(() => {
    recalculateTotal();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await UpdateProforma(formData.id, { ...formData, totalAmount: totalPrice })
      .then((res) => {
        if (res.status !== 200) return;
        console.log("formData", formData);
        const newProformas = proformas.filter((p) => p.id != formData.id);
        newProformas.push(formData);
        setProformas(newProformas);
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
          proformaGoods: [],
          approvedFile: "",
          description: "",
        });
        setProformaItems([
          {
            uniqueId: Date.now().toString(),
            createdAt: "",
            description: "",
            good: {},
            id: 0,
            price: 0,
            quantity: 0,
            total: 0,
          },
        ]);

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
      })
      .finally(setLoading(false));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = formData.proformaGoods;
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
    setFormData({ ...formData, proformaGoods: newItems });
  };

  const recalculateTotal = () => {
    const items = formData.proformaGoods;
    const total = items.reduce((sum, i) => sum + i.total, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = () => {
    const items = [...formData.proformaGoods];
    const newItem = {
      uniqueId: Date.now().toString(),
      createdAt: "",
      description: "",
      id: 0,
      quantity: 0,
      price: 0,
      total: 0,
      no: items?.length > 0 ? items[items.length - 1]?.no + 1 : 1,
      good: 0,
      goodName: 0,
      goodPrice: 0,
      goodUnitName: "",
    };
    items.push(newItem);
    setFormData({ ...formData, proformaGoods: items });
  };

  const handleRemoveItem = (item) => {
    const items = [...formData.proformaGoods];
    const updated = items.filter((i) => i.uniqueId !== item.uniqueId);

    for (let i = 0; i < updated.length; i++) {
      updated[i].no = i + 1;
    }

    setFormData({ ...formData, proformaGoods: updated });
  };

  const handleDeleteAllItems = () => {
    setFormData({ ...formData, proformaGoods: [] });
    setTotalPrice(0);
    setTotalQuantity(0);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCustomerData = (id) => {
    const newCustomer = customers.find((c) => c.id == id);
    if (newCustomer) setFormData({ ...formData, customer: newCustomer });
  };

  const handleAddNewUser = () => {
    onOpen();
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
          ویرایش پیش فاکتور
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
                      <Select
                        disabled={customerLoading}
                        w={250}
                        dir="ltr"
                        name="customer.id"
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
                      <IconButton
                        size={"md"}
                        icon={<UserRoundPlus />}
                        onClick={handleAddNewUser}
                      />
                      <IconButton
                        size={"md"}
                        icon={<UserSearch />}
                        onClick={handleSearchUser}
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
                    {formData.proformaGoods.map((item, index) => (
                      <Tr key={"row" + index}>
                        <Td>
                          <Input
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
                            <Select
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
                            </Select>
                            {goodLoading && (
                              <Spinner
                                key={"spiner" + item.id}
                                size={"sm"}
                                color="red.500"
                              />
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          <NumberInput
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
              <HStack marginTop="5px" marginRight="auto">
                <Text>فایل تاییدیه مشتری: </Text>
                {approvedFile ? (
                  <Box
                    borderRadius="6px"
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
              placeholder=" توضیحات فاکتور"
              name="description"
              value={formData.description}
              onChange={handleChangeFormData}
            />

            <Button colorScheme="blue" type="submit" isLoading={loading}>
              ثبت تغییرات پیش فاکتور
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
      </Card>
    );
};
