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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MyLoading } from "../my-components/MyLoading";
import { ShowProformasByToken } from "../api/services/proformaService";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { CheckCircle2, CircleX } from "lucide-react";
import { NotFoundPage } from "./NotFoundPage";

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
        setTimeout(() => {
          //navigate("/login");
        }, 1000);

        //return;
      }
      setLoading(true);

      ShowProformasByToken(token)
        .then((res) => {
          setFormData({ ...res.data });
          let items = 0;
          res.data.proformaGoods.forEach((element) => {
            items += element.quantity;
          });
          setItemsCount(items);
        })
        .catch((err) => {
          toast({
            title: "خطا",
            description: err.message,
            status: "error",
            duration: 3000,
            isClosable: false,
          });
          setTimeout(() => {
            //navigate("/login");
          }, 1000);
        })
        .finally(setLoading(false));
    };

    loadProformaData();
  }, []);

  const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const data = { ...formData };
    //     setFormData(data);
    //     setLoading(true);
    //     try {
    //       const response = await CreateProforma(data);
    //       if (!response.data) return;
    //       setFormData({
    //         title: "",
    //         customer: 0,
    //         totalAmount: 0,
    //         paymentStatus: 0,
    //         chequeAmount: 0,
    //         chequeSerial: 0,
    //         chequeDate: "",
    //         paperMoneyDate: "",
    //         paperMoneyAmount: 0,
    //         paperMoneySerial: 0,
    //         trustIssueDate: "",
    //         proformaGoods: [],
    //         description: "",
    //       });
    //       setProformaItems([]);
    //       recalculateTotal();
    //       toast({
    //         title: "ثبت موفق",
    //         description: "فایل تاییدیه ثبت و ارسال گردید",
    //         status: "success",
    //         duration: 3000,
    //         isClosable: true,
    //       });
    //     } catch (err) {
    //       toast({
    //         title: "خطایی رخ داد",
    //         description: `${err}`,
    //         status: "error",
    //         duration: 3000,
    //         isClosable: true,
    //       });
    //     } finally {
    //       setLoading(false);
    //     }
  };

  if (loading) return <MyLoading showLoading={true} />;
  else
    return (
      <Card m={10}>
        <CardHeader
          bg="#68C15A"
          color="white"
          borderBottomColor="gray.400"
          borderBottomWidth="1px"
          borderTopRadius={5}
          textAlign="center"
        >
          اطلاعات پیش فاکتور
          {" " +
            formData.customer.customerFName +
            " " +
            formData.customer.customerLName}
        </CardHeader>
        <CardBody>
          <VStack spacing={5} align="stretch" dir="rtl" mb={10}>
            <HStack>
              <Text>عنوان فاکتور : </Text>
              <Text name="title">{formData.title}</Text>
            </HStack>

            <HStack>
              <Text>نام خریدار : </Text>
              <Text name="customer">
                {formData.customer.customerFName +
                  " " +
                  formData.customer.customerLName}
              </Text>
            </HStack>
            <HStack>
              <Text>تاریخ :</Text>
              <Text name="createdAt">
                {dayjs(formData.createdAt).locale("fa").format("YYYY/MM/DD")}
              </Text>
            </HStack>
            <HStack>
              <Text>ساعت :</Text>
              <Text name="createdAt">
                {dayjs(formData.createdAt).locale("fa").format("HH:mm:ss")}
              </Text>
            </HStack>
            <HStack>
              <Text>نوع پرداخت :</Text>
              <Text name="paymentStatus">{formData.paymentStatus}</Text>
            </HStack>

            <Divider mb={5} />

            <TableContainer dir="rtl">
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>ردیف</Th>
                    <Th>نام کالا</Th>
                    <Th>تعداد</Th>
                    <Th>واحد</Th>
                    <Th>قیمت واحد</Th>
                    <Th>جمع کل</Th>
                    <Th>توضیحات کالا</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {formData?.proformaGoods?.map((item, index) => (
                    <Tr key={item.no}>
                      <Td>
                        <HStack>
                          <Text>{index + 1} </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Text>{item.good.goodName}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Text>{item.quantity}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Text>{item?.good?.goodName}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Text>{item.price} </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Text>{item.quantity * item.price}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Text>{item.description}</Text>
                        </HStack>
                      </Td>
                      <Td></Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>جمع کل</Th>
                    <Th></Th>
                    <Th>
                      <Text> {itemsCount}</Text>
                    </Th>
                    <Th></Th>
                    <Th></Th>
                    <Th>
                      <Text> {formData.totalAmount}</Text>
                    </Th>
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
            <HStack>
              <label>توضیحات فاکتور :</label>
              <Text value={formData.description} />
            </HStack>
            <Divider mb={5} />
            <HStack>
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
                      setFormData({ ...formData, approvedFile: "" })
                    }
                  />
                </InputLeftElement>
                <Input
                  pt="5px"
                  pb="5px"
                  type="file"
                  name="approvedFile"
                  value={formData.approvedFile}
                  onChange={(e) => {
                    setFormData({ ...formData, approvedFile: e.target.value });
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </InputGroup>
              <Box
                borderRadius="6px"
                borderColor="orange"
                borderWidth="1px"
                hidden={
                  formData.approvedFile == null || formData.approvedFile == ""
                }
                boxSize="10"
              >
                <Image
                  src={imagePreview}
                  objectFit="cover"
                  alt={formData.approvedFile}
                />
              </Box>
            </HStack>
            <HStack>
              <Checkbox
                isDisabled={
                  formData.approvedFile == null || formData.approvedFile == ""
                }
                name="isAccepted"
                isChecked={formData.isAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, isAccepted: e.target.checked })
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
            <Button
              isDisabled={!formData.isAccepted}
              type="submit"
              colorScheme="blue"
              leftIcon={<CheckCircle2 />}
            >
              تایید
            </Button>
          </VStack>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    );
};
