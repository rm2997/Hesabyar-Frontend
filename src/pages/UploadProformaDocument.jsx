import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Text,
  Tfoot,
  TableContainer,
  useDisclosure,
  VStack,
  Divider,
  Checkbox,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  IconButton,
  Image,
  Box,
  Heading,
  SimpleGrid,
  Stack,
  AbsoluteCenter,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MyLoading } from "../my-components/MyLoading";
import {
  ShowProformasByToken,
  UpdateProformCustomerFile,
} from "../api/services/proformaService";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { CheckCircle2, CircleX } from "lucide-react";

export const UploadProformaDocument = ({}) => {
  const toast = useToast();
  const [itemsCount, setItemsCount] = useState(0);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [imagePreview, setImagePreview] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  dayjs.extend(jalali);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
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
    description: "",
    isAccepted: false,
    isAcceptedByCustomer: false,
    imageFile: 0,
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
      description: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProformaData = async () => {
      if (!token || token.length < 10) {
        toast({
          title: "خطا",
          description: "توکن شما در سیستم وجود ندارد",
          status: "error",
          duration: 3000,
          isClosable: false,
        });
        setTimeout(() => navigate("/NotFound"), 1000);
        return;
      }
      setLoading(true);
      const res = await ShowProformasByToken(token);
      if (!res.success) {
        toast({
          title: "خطا",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: false,
        });
        setLoading(false);
        setTimeout(() => navigate("/NotFound"), 1000);
        return;
      }
      setFormData({ ...res.data, approvedFile: "" });
      let items = 0;
      res?.data?.proformaGoods.forEach((element) => {
        items += element.quantity;
      });
      setItemsCount(items);
      setLoading(false);
    };

    loadProformaData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("image", formData.imageFile);

    const res = await UpdateProformCustomerFile(token, form);
    if (!res) {
      toast({
        title: "خطا",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
      setLoading(false);
      navigate("/NotFound");
      return;
    }
    toast({
      title: "توجه",
      description: "تاییدیه شما ارسال گردید",
      status: "success",
      duration: 3000,
      isClosable: false,
    });
    navigate("/home");

    setLoading(false);
    setLoading(false);
  };

  return (
    <Box>
      <Card
        minH="100%"
        overflowY="auto"
        m={1}
        filter={loading ? "blur(10px)" : ""}
      >
        <CardHeader
          bg="#6b749f"
          color="white"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          textAlign="right"
        >
          <Heading fontFamily="IranSans" size="lg">
            {formData.title} - پیش فاکتور
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1 }}
            dir="rtl"
            mb={10}
            rowGap={5}
            as="form"
            onSubmit={handleSubmit}
          >
            <Stack align="stretch" rowGap={5} spacing={4}>
              <HStack>
                <Text>نام خریدار : </Text>
                <Text name="customer">
                  {formData?.customer?.customerGender +
                    " " +
                    formData.customer.customerFName +
                    " " +
                    formData.customer.customerLName}
                </Text>
              </HStack>
              <HStack>
                <Text>تاریخ :</Text>
                <Text fontFamily="IranSans" fontSize="md" name="createdAt">
                  {dayjs(formData.createdAt).locale("fa").format("YYYY/MM/DD")}
                </Text>
              </HStack>
              <HStack>
                <Text fontFamily="IranSans" fontSize="md">
                  ساعت :
                </Text>
                <Text fontFamily="IranSans" fontSize="md" name="createdAt">
                  {dayjs(formData.createdAt).locale("fa").format("HH:mm:ss")}
                </Text>
              </HStack>
              <HStack>
                <Text>نوع پرداخت :</Text>
                <Text name="paymentStatus">{formData.paymentStatus}</Text>
              </HStack>
            </Stack>
            <Divider mb={5} />
            <Stack align="stretch">
              <TableContainer dir="rtl">
                <Table size="sm" variant="striped">
                  <Thead h="50px" borderBottomWidth={2}>
                    <Tr bg="#666c85" textFillColor="white">
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        ردیف
                      </Th>
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        نام کالا
                      </Th>
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        تعداد
                      </Th>
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        واحد
                      </Th>
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        قیمت واحد
                      </Th>
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        جمع کل
                      </Th>
                      <Th
                        fontFamily="IranSans"
                        fontSize="md"
                        textAlign="center"
                      >
                        توضیحات کالا
                      </Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData?.proformaGoods?.map((item, index) => (
                      <Tr key={item.no}>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize="md"
                            textAlign="center"
                          >
                            {index + 1}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize="md"
                            textAlign="center"
                          >
                            {item.good.goodName}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize="md"
                            textAlign="center"
                          >
                            {item.quantity}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize="md"
                            textAlign="center"
                          >
                            {item?.good?.goodUnit?.unitName}
                          </Text>
                        </Td>

                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize="md"
                            textAlign="center"
                          >
                            {Number(item.price).toLocaleString()}{" "}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize="md"
                            textAlign="center"
                          >
                            {Number(
                              item.quantity * item.price
                            ).toLocaleString()}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontFamily="IranSans" fontSize="md">
                            {item.description}
                          </Text>
                        </Td>
                        <Td></Td>
                      </Tr>
                    ))}
                  </Tbody>

                  <Tfoot borderTopWidth={2}>
                    <Tr>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th>
                        <VStack mt="5px" align="stretch" spacing={0}>
                          <HStack p={2} bg="gray.100" spacing={10}>
                            <Heading
                              fontFamily="IranSans"
                              fontSize="md"
                              size="xs"
                            >
                              تعداد کل :
                            </Heading>
                            <Text fontFamily="IranSans" fontSize="md">
                              {itemsCount}
                            </Text>
                          </HStack>
                          <HStack p={2} bg="gray.100" spacing={5}>
                            <Heading
                              fontFamily="IranSans"
                              fontSize="md"
                              size="xs"
                            >
                              مبلغ نهایی :
                            </Heading>
                            <Text fontFamily="IranSans" fontSize="md">
                              {Number(formData.totalAmount).toLocaleString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </Th>
                      <Th></Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Stack>
            <Divider />
            <HStack>
              <label>توضیحات فاکتور :</label>
              <Text value={formData.description} />
            </HStack>
            <Divider />
            <SimpleGrid spacing={1} columns={{ base: 1, md: 2, lg: 3 }}>
              <Text>
                لطفا بنویسید اطلاعات را قبول دارم - امضا کرده - عکس بگیرید و
                اینجا قرار دهید.
              </Text>
              <InputGroup maxW="500px">
                <InputLeftElement>
                  <IconButton
                    colorScheme="red"
                    variant="ghost"
                    icon={<CircleX />}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        approvedFile: "",
                        isAcceptedByCustomer: false,
                      })
                    }
                  />
                </InputLeftElement>
                <Input
                  accept="image/*"
                  capture="environment"
                  pt="5px"
                  pb="5px"
                  type="file"
                  name="approvedFile"
                  value={formData.approvedFile}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      approvedFile: e.target.value,
                      imageFile: e.target.files[0],
                    });
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </InputGroup>
              <Box
                overflow="auto"
                borderRadius="6px"
                borderColor="orange"
                borderWidth="1px"
                hidden={
                  formData.approvedFile == null || formData.approvedFile == ""
                }
                boxSize="20"
              >
                <Image
                  src={imagePreview}
                  objectFit="cover"
                  alt={formData.approvedFile}
                />
              </Box>
            </SimpleGrid>
            <Divider />
            <HStack>
              <Checkbox
                isDisabled={
                  formData.approvedFile == null || formData.approvedFile == ""
                }
                name="isAcceptedByCustomer"
                isChecked={formData.isAcceptedByCustomer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isAcceptedByCustomer: e.target.checked,
                  })
                }
              >
                اینجانب
                {" " +
                  formData.customer.customerFName +
                  " " +
                  formData.customer.customerLName +
                  " "}
                فاکتور را مطالعه کرده و اطلاعات آن را قبول دارم.
              </Checkbox>
            </HStack>
            <Divider />
            <Button
              isDisabled={!formData.isAcceptedByCustomer}
              type="submit"
              colorScheme="blue"
              leftIcon={<CheckCircle2 />}
            >
              تایید
            </Button>
          </SimpleGrid>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
