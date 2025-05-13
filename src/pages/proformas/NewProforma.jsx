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
  TableContainer,
} from "@chakra-ui/react";
import { PaymentTypes } from "../../api/services/enums/payments.enum";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateProforma } from "../../api/services/proformaService";
import { useNavigate } from "react-router-dom";
import { ShowAllCustomers } from "../../api/services/customerService";
import {
  ShowProformasByID,
  ShowUserAllProformas,
} from "../../api/services/proformaService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { MyLoading } from "../../my-components/MyLoading";
import { ChequeInput } from "../../my-components/paymentStatus/ChequeInput";

export const NewProforma = () => {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [allGoods, setAllGoods] = useState([]);

  const [formData, setFormData] = useState({
    customer: 0,
    totalAmount: 0,
    paymentStatus: 0,
    chequeAmount: 0,
    chequeSerial: 0,
    chequeDate: "",
    paperMoneyDate: "",
    paperMoneyAmount: 0,
    paperMoneySerial: 0,
    trustIssueDate: "",
    proformaGoods: {},
  });
  const [proformaItems, setProformaItems] = useState([
    {
      uniqueId: Date.now().toString(),
      no: 1,
      good: 0,
      goodName: 0,
      price: 0,
      goodUnitName: "",
      quantity: 0,
      total: 0,
    },
  ]);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formError, setFormError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [proformaLoading, setProformaLoading] = useState(false);
  const [goodLoading, setGoodLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await ShowAllCustomers().then((res) => setCustomers(res.data));
      await ShowAllGoods().then((res) => setAllGoods(res.data));
    };

    loadData().finally(setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    data.proformaGoods = [...proformaItems];
    data.totalAmount = totalPrice;
    console.log(data);
    setFormData(data);
    setLoading(true);
    try {
      const response = await CreateProforma(data);
      if (!response.data) return;
      setFormData({
        customer: 0,
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
      });
      setProformaItems([]);
      recalculateTotal();
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
    console.log(proformaItems);
    const total = proformaItems.reduce((sum, i) => sum + i.total, 0);
    const count = proformaItems.reduce((sum, i) => sum + i.quantity, 0);
    setTotalPrice(total);
    setTotalQuantity(count);
  };

  const handleAddNewItem = () => {
    const items = [...proformaItems];
    console.log(Date.now().toString());
    const newItem = {
      uniqueId: Date.now().toString(),
      no: items?.length > 0 ? items[items.length - 1]?.no + 1 : 1,
      good: 0,
      goodName: 0,
      goodPrice: 0,
      goodUnitName: "",
      quantity: 0,
      amount: 0,
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
    console.log(`${e.target.name}: ${e.target.value}`);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          <VStack as="form" spacing={5} onSubmit={handleSubmit}>
            <FormControl isRequired>
              <HStack>
                <FormLabel width="120px">نام مشتری</FormLabel>
                <Select
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
                </Select>
                {customerLoading && <Spinner color="red.500" size={"sm"} />}
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <HStack>
                <FormLabel width="120px">نوع پرداخت</FormLabel>
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

            <ChequeInput
              title={"اطلاعات چک"}
              display={formData.paymentStatus === "چک"}
              formData={formData}
              handleChangeFormData={handleChangeFormData}
            />

            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th width="100px">ردیف</Th>
                    <Th width="400px">نام کالا</Th>
                    <Th width="100px">تعداد</Th>
                    <Th width="200px">واحد</Th>
                    <Th width="300px">قیمت واحد</Th>
                    <Th width="300px">قیمت کل</Th>
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
                          value={item.no}
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
                          </Select>
                          {goodLoading && (
                            <Spinner size={"sm"} color="red.500" />
                          )}
                        </HStack>
                      </Td>
                      <Td>
                        <NumberInput
                          defaultValue={0}
                          dir="ltr"
                          min={0}
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
                            handleItemChange(index, "goodPrice", e.target.value)
                          }
                        />
                      </Td>
                      <Td>
                        {" "}
                        <Input
                          disabled
                          type="number"
                          name="goodPrice"
                          value={item.quantity * item.goodPrice}
                          placeholder="قیمت"
                          onChange={(e) =>
                            handleItemChange(index, "goodPrice", e.target.value)
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
            <HStack justify="space-between"></HStack>
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              ثبت فاکتور
            </Button>
          </VStack>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    );
};
