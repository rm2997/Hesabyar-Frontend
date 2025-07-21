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
  useBreakpointValue,
  Flex,
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
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });
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
    <Box borderTopRadius="md" p={2} borderColor="gray.100" borderWidth="1px">
      <Flex mx={2} dir="rtl">
        <Flex direction="column">
          <Text fontFamily="Aseman" fontSize="2xl">
            شرکت تجارت آسانبر علیا
          </Text>
          <Text
            mx="auto"
            fontSize="xl"
            fontFamily="EnglishHeader"
            color="gray.300"
          >
            OLIAEI GROUP
          </Text>
        </Flex>
        <Box mr="auto" mt={2} boxSize="150px" maxH={5}>
          <Image
            borderRadius="10%"
            src="/assets/images/logos/logo1.png"
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
          />
        </Box>
      </Flex>
      <Box
        minH={isDesktop ? "85vh" : "90vh"}
        overflowY="auto"
        m={2}
        filter={loading ? "blur(10px)" : ""}
        textAlign="center"
      >
        <Box
          bg="gray.100"
          borderTopRadius="md"
          p={2}
          borderColor="gray.400"
          borderWidth="1px"
        >
          <Heading fontFamily="IranSans" size="md" mx="auto">
            پیش فاکتور فروش کالا
          </Heading>
        </Box>
        <Box
          p={2}
          borderColor="gray.200"
          borderWidth={1}
          borderBottomRadius="md"
        >
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1 }}
            dir="rtl"
            mb={10}
            rowGap={5}
            as="form"
            onSubmit={handleSubmit}
          >
            <Stack align="stretch" rowGap={4} spacing={4}>
              <HStack>
                <Text fontFamily="iransans" fontSize={isDesktop ? "md" : "sm"}>
                  نام خریدار :
                </Text>
                <Text name="customer" fontFamily="iransans" fontSize="sm">
                  {formData?.customer?.customerGender +
                    " " +
                    formData.customer.customerFName +
                    " " +
                    formData.customer.customerLName}
                </Text>
              </HStack>
              <HStack>
                <Text fontFamily="iransans" fontSize={isDesktop ? "md" : "sm"}>
                  تاریخ :
                </Text>
                <Text fontFamily="iransans" fontSize="md" name="createdAt">
                  {dayjs(formData.createdAt).locale("fa").format("YYYY/MM/DD")}
                </Text>
              </HStack>
              <HStack>
                <Text fontFamily="iransans" fontSize={isDesktop ? "md" : "sm"}>
                  ساعت :
                </Text>
                <Text fontFamily="iransans" fontSize="md" name="createdAt">
                  {dayjs(formData.createdAt).locale("fa").format("HH:mm:ss")}
                </Text>
              </HStack>
              <HStack>
                <Text fontFamily="iransans" fontSize={isDesktop ? "md" : "sm"}>
                  نوع پرداخت :
                </Text>
                <Text fontFamily="iransans" fontSize="md" name="paymentStatus">
                  {formData.paymentStatus}
                </Text>
              </HStack>
            </Stack>

            <Stack w="full" align="stretch">
              <TableContainer
                w="full"
                mx="auto"
                dir="rtl"
                borderColor="gray.300"
                borderRadius="md"
                borderWidth={1}
              >
                <Table
                  columnGap={5}
                  size={isDesktop ? "md" : "xs"}
                  variant="striped"
                >
                  <Thead h="50px" borderBottomWidth={2}>
                    <Tr columnGap={5} bg="gray.300" textFillColor="black">
                      <Th
                        px={2}
                        fontFamily="IranSans"
                        fontSize={isDesktop ? "md" : "xs"}
                        textAlign="center"
                      >
                        ردیف
                      </Th>
                      <Th
                        px={2}
                        fontFamily="IranSans"
                        fontSize={isDesktop ? "md" : "xs"}
                        textAlign="center"
                      >
                        نام کالا
                      </Th>
                      <Th
                        px={2}
                        fontFamily="IranSans"
                        fontSize={isDesktop ? "md" : "xs"}
                        textAlign="center"
                      >
                        تعداد
                      </Th>
                      <Th
                        px={2}
                        fontFamily="IranSans"
                        fontSize={isDesktop ? "md" : "xs"}
                        textAlign="center"
                      >
                        واحد
                      </Th>
                      <Th
                        px={2}
                        fontFamily="IranSans"
                        fontSize={isDesktop ? "md" : "xs"}
                        textAlign="center"
                      >
                        فی
                      </Th>
                      <Th
                        px={2}
                        fontFamily="IranSans"
                        fontSize={isDesktop ? "md" : "xs"}
                        textAlign="center"
                      >
                        جمع کل
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData?.proformaGoods?.map((item, index) => (
                      <Tr key={item.no}>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize={isDesktop ? "md" : "xs"}
                            textAlign="center"
                          >
                            {index + 1}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize={isDesktop ? "md" : "xs"}
                            textAlign="center"
                          >
                            {item.good.goodName}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize={isDesktop ? "md" : "xs"}
                            textAlign="center"
                          >
                            {item.quantity}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize={isDesktop ? "md" : "xs"}
                            textAlign="center"
                          >
                            {item?.good?.goodUnit?.unitName}
                          </Text>
                        </Td>

                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize={isDesktop ? "md" : "xs"}
                            textAlign="center"
                          >
                            {Number(item.price).toLocaleString()}{" "}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            fontFamily="IranSans"
                            fontSize={isDesktop ? "md" : "xs"}
                            textAlign="center"
                          >
                            {Number(
                              item.quantity * item.price
                            ).toLocaleString()}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td colSpan={4} />
                      <Td colSpan={2}>
                        <VStack bg="gray.100" m={1}>
                          <HStack mx="auto">
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                            >
                              تعداد کل :
                            </Text>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                            >
                              {itemsCount} مورد
                            </Text>
                          </HStack>
                          <Divider />
                          <HStack mx="auto">
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                            >
                              مبلغ نهایی :
                            </Text>
                            <Text
                              fontFamily="IranSans"
                              fontSize={isDesktop ? "md" : "xs"}
                            >
                              {Number(formData.totalAmount).toLocaleString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
            <Divider />
            <HStack>
              <Text fontFamily="IranSans" fontSize={isDesktop ? "md" : "xs"}>
                توضیحات فاکتور :
              </Text>
              <Text value={formData.description} />
            </HStack>
            <Divider />
            <SimpleGrid spacing={1} columns={{ base: 1, md: 2, lg: 3 }}>
              <Text textAlign="justify">
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
                textAlign="justify"
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
        </Box>
      </Box>
      {loading && <MyLoading />}
    </Box>
  );
};
