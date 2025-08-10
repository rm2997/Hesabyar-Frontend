import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  IdCard,
  Mailbox,
  Phone,
  Smartphone,
  SquareCheckBig,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CreateCustomer,
  ShowCustomerByID,
  UpdateCustomer,
} from "../../api/services/customerService";

import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
import { CustomerTypes } from "../../api/services/enums/customerTypes.enum";
import { AddressTypes } from "../../api/services/enums/addressTypes.enum";
import { PhoneTypes } from "../../api/services/enums/phoneTypes.enum";
import { CustomerParties } from "../../api/services/enums/customerParties.enum";

export const EditCustomer = ({
  id,
  onClose,
  onUpdate,
  isDesktop,
  customer,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerFName: "",
    customerLName: "",
    customerAddress: "",
    customerPhone: "",
    customerNationalCode: "",
    customerMobile: "",
    customerPostalCode: "",
    customerType: "",
    customerBase: "",
    customerTitle: "",
    isPrimary: false,
    isProvider: false,
    isCustomer: true,
    isBroker: false,
    isBuyerAgent: false,
    customerAddressType: "",
    customerPhoneType: "",
    customerEconomicCode: "",
    customerGender: "",
  });
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async () => {
      //setLoading(true);
      // const res = await ShowCustomerByID(id);
      // if (!res.success) {
      //   toast({
      //     title: "خطا",
      //     description: res.error,
      //     status: "warning",
      //     duration: 3000,
      //     isClosable: true,
      //   });
      //   setLoading(false);
      //   return;
      // }
      setFormData(customer);
      //setLoading(false);
    };
    loadFormData();
  }, [id]);

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = async () => {
    if (!formData) {
      toast({
        title: "توجه",
        description: "اطلاعات مشتری باید تکمیل گردد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerFName?.trim().length < 2) {
      toast({
        title: "توجه",
        description: "لطفا نام صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!isNaN(Number(formData?.customerFName))) {
      toast({
        title: "توجه",
        description: "درج عدد برای نام مجاز نمی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!isNaN(Number(formData?.customerLName))) {
      toast({
        title: "توجه",
        description: "درج عدد برای نام خانوادگی مجاز نمی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData?.customerLName.trim()?.length < 2) {
      toast({
        title: "توجه",
        description: "لطفا نام خانوادگی صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (
      formData?.customerNationalCode?.trim().length > 0 &&
      (formData?.customerNationalCode.trim()?.length != 10 ||
        isNaN(Number(formData?.customerNationalCode)))
    ) {
      toast({
        title: "توجه",
        description: "کد ملی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.customerMobile?.trim().length != 11 ||
      isNaN(Number(formData?.customerMobile))
    ) {
      toast({
        title: "توجه",
        description: "موبایل صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.customerPhone?.trim().length > 0 &&
      (formData?.customerPhone?.trim().length < 5 ||
        isNaN(Number(formData?.customerPhone)))
    ) {
      toast({
        title: "توجه",
        description: "شماره تلفن صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.customerPostalCode?.trim().length > 0 &&
      (formData?.customerPostalCode?.trim().length != 10 ||
        isNaN(Number(formData?.customerPostalCode)))
    ) {
      toast({
        title: "توجه",
        description: "کد پستی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const initFormData = () => {
    setFormData({
      customerFName: "",
      customerLName: "",
      customerAddress: "",
      customerPhone: "",
      customerNationalCode: "",
      customerMobile: "",
      customerPostalCode: "",
      customerType: "",
      customerBase: "",
      customerTitle: "",
      isPrimary: false,
      isProvider: false,
      isCustomer: true,
      isBroker: false,
      isBuyerAgent: false,
      customerAddressType: "",
      customerPhoneType: "",
      customerEconomicCode: "",
      customerGender: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((await validateForm()) == false) return;
    setLoading(true);
    console.log(formData);

    const result = await UpdateCustomer(formData.id, formData);
    if (!result?.success) {
      toast({
        title: "خطایی رخ داد",
        description: result.error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    onUpdate(id, result?.data);
    initFormData();

    toast({
      title: "ثبت شد",
      description: `اطلاعات مشتری بروزرسانی شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    setLoading(false);
  };

  // return (
  //   <Box>
  //     <Flex
  //       filter={loading ? "blur(10px)" : ""}
  //       direction="column"
  //       gap={4}
  //       as="form"
  //       onSubmit={handleSubmit}
  //     >
  //       <SimpleGrid
  //         columns={{ base: 1, md: 2, lg: 2 }} // در موبایل 1، تبلت 2، دسکتاپ 3 ستون
  //         rowGap={4}
  //         columnGap={4}
  //       >
  //         <FormControl isRequired>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               هویت
  //             </FormLabel>
  //             <Select
  //               dir="ltr"
  //               name="customerGender"
  //               placeholder="هویت را انتخاب کنید"
  //               value={formData.customerGender}
  //               onChange={handleChangeFormData}
  //             >
  //               <option>شرکت</option>
  //               <option>آقای</option>
  //               <option>خانم</option>
  //             </Select>
  //           </HStack>
  //         </FormControl>
  //         <FormControl isRequired>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               نام مشتری
  //             </FormLabel>
  //             <MyInputBox
  //               icon={IdCard}
  //               name="customerFName"
  //               title="نام"
  //               value={formData.customerFName}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //         <FormControl isRequired>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               نام خانوادگی
  //             </FormLabel>
  //             <MyInputBox
  //               icon={IdCard}
  //               name="customerLName"
  //               title="نام خانوادگی"
  //               value={formData.customerLName}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //         <FormControl>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               شماره ملی
  //             </FormLabel>
  //             <MyInputBox
  //               icon={IdCard}
  //               name="customerNationalCode"
  //               title="شماره ملی"
  //               value={formData.customerNationalCode}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //         <FormControl isRequired>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               شماره موبایل
  //             </FormLabel>
  //             <MyInputBox
  //               icon={Smartphone}
  //               name="customerMobile"
  //               title="شماره موبایل"
  //               value={formData.customerMobile}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //         <FormControl>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               شماره تلفن
  //             </FormLabel>
  //             <MyInputBox
  //               icon={Phone}
  //               name="customerPhone"
  //               title="شماره تلفن"
  //               value={formData.customerPhone}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //         <FormControl>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="150px">
  //               کد پستی
  //             </FormLabel>
  //             <MyInputBox
  //               type="number"
  //               icon={Mailbox}
  //               name="customerPostalCode"
  //               title="کد پستی"
  //               value={formData.customerPostalCode}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //       </SimpleGrid>
  //       <GridItem colSpan={{ lg: 3 }}>
  //         <FormControl>
  //           <HStack>
  //             <FormLabel hidden={!isDesktop} width="115px">
  //               آدرس
  //             </FormLabel>
  //             <Textarea
  //               placeholder="آدرس"
  //               name="customerAddress"
  //               resize="horizontal"
  //               maxW="780px"
  //               value={formData.customerAddress}
  //               onChange={handleChangeFormData}
  //             />
  //           </HStack>
  //         </FormControl>
  //       </GridItem>
  //       <Button
  //         leftIcon={<SquareCheckBig />}
  //         colorScheme="blue"
  //         type="submit"
  //         isLoading={loading}
  //       >
  //         تایید
  //       </Button>
  //     </Flex>
  //     {loading && <MyLoading />}
  //   </Box>
  // );

  return (
    <Box>
      <Card
        minH={isDesktop ? "85vh" : "50vh"}
        borderWidth={1}
        m={1}
        borderColor="gray.200"
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
            ثبت مشتری جدید
          </CardHeader>
        )}
        <CardBody>
          <Flex direction="column" rowGap={5} as="form" onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{ base: 1, md: 1, lg: 2 }}
              columnGap={6}
              rowGap={5}
            >
              <GridItem colSpan={isDesktop ? 2 : 1}>
                <Flex
                  columnGap={2}
                  rowGap={3}
                  mt={3}
                  dir="rtl"
                  direction="column"
                  borderWidth={1}
                  borderColor="gray.200"
                  borderStyle="dashed"
                  borderRadius="md"
                  p={2}
                  fontFamily="iransans"
                  fontSize="13px"
                >
                  <Text bg="gray.100" textAlign="center" fontSize="17px">
                    نوع مشتری
                  </Text>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نوع مشتری
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="customerType"
                        placeholder="نوع مشتری را انتخاب کنید"
                        value={formData?.customerType}
                        onChange={handleChangeFormData}
                      >
                        {CustomerTypes.map((p) => (
                          <option key={p.key} value={p.value}>
                            {p.value}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نوع ارتباط
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="customerBase"
                        placeholder="نوع ارتباط را انتخاب کنید"
                        value={formData?.customerBase}
                        onChange={handleChangeFormData}
                      >
                        {CustomerParties.map((p) => (
                          <option key={p.key} value={p.value}>
                            {p.value}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>
                </Flex>
              </GridItem>

              <GridItem colSpan={isDesktop ? 2 : 1}>
                <Flex
                  columnGap={2}
                  rowGap={3}
                  mt={3}
                  dir="rtl"
                  direction="column"
                  borderWidth={1}
                  borderColor="gray.200"
                  borderStyle="dashed"
                  borderRadius="md"
                  p={2}
                  fontFamily="iransans"
                  fontSize="13px"
                >
                  <Text bg="gray.100" textAlign="center" fontSize="17px">
                    اطلاعات هویتی
                  </Text>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        هویت
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="customerGender"
                        placeholder="هویت را انتخاب کنید"
                        value={formData.customerGender}
                        onChange={handleChangeFormData}
                      >
                        <option>شرکت</option>
                        <option>آقای</option>
                        <option>خانم</option>
                      </Select>
                    </HStack>
                  </FormControl>
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        عنوان
                      </FormLabel>
                      <MyInputBox
                        icon={IdCard}
                        name="customerTitle"
                        title="عنوان"
                        value={formData.customerTitle}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نام مشتری
                      </FormLabel>
                      <MyInputBox
                        icon={IdCard}
                        name="customerFName"
                        title="نام"
                        value={formData.customerFName}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl
                    isRequired={
                      formData?.customerType == "حقوقی" ? false : true
                    }
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نام خانوادگی
                      </FormLabel>
                      <MyInputBox
                        icon={IdCard}
                        name="customerLName"
                        title="نام خانوادگی"
                        value={formData.customerLName}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        {formData?.customerType == "حقوقی"
                          ? "شماره ثبت"
                          : "کد ملی"}
                      </FormLabel>
                      <MyInputBox
                        maxLength="10"
                        icon={IdCard}
                        name="customerNationalCode"
                        title={
                          formData?.customerType == "حقوقی"
                            ? "شماره ثبت"
                            : "کد ملی"
                        }
                        value={formData.customerNationalCode}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        شماره اقتصادی
                      </FormLabel>
                      <MyInputBox
                        maxLength="10"
                        icon={IdCard}
                        name="customerEconomicCode"
                        title="شماره اقتصادی"
                        value={formData.customerEconomicCode}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                </Flex>
              </GridItem>

              <GridItem colSpan={isDesktop ? 2 : 1}>
                <Flex
                  columnGap={2}
                  mt={3}
                  dir="rtl"
                  direction={"column"}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderStyle="dashed"
                  borderRadius="md"
                  p={2}
                  fontFamily="iransans"
                  fontSize="13px"
                >
                  <Text bg="gray.100" textAlign="center" fontSize="17px">
                    نوع فعالیت
                  </Text>
                  <Flex
                    columnGap={4}
                    p={2}
                    direction={isDesktop ? "row" : "column"}
                  >
                    <FormLabel htmlFor="customer">مشتری</FormLabel>
                    <Switch
                      defaultChecked
                      isChecked={formData?.isCustomer}
                      id="customer"
                      title="مشتری"
                      name="isCustomer"
                      onChange={(e) =>
                        handleChangeFormData({
                          target: {
                            name: "isCustomer",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <FormLabel htmlFor="provider">تامین کننده</FormLabel>
                    <Switch
                      id="provider"
                      title="تامین کننده"
                      isChecked={formData.isProvider}
                      name="isProvider"
                      onChange={(e) =>
                        handleChangeFormData({
                          target: {
                            name: "isProvider",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <FormLabel htmlFor="broker">واسطه</FormLabel>
                    <Switch
                      id="broker"
                      title="واسطه"
                      isChecked={formData.isBroker}
                      name="isBroker"
                      onChange={(e) =>
                        handleChangeFormData({
                          target: {
                            name: "isBroker",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <FormLabel htmlFor="buyer"> مامور خرید</FormLabel>
                    <Switch
                      id="buyer"
                      title="مامور خرید"
                      isChecked={formData.isBuyerAgent}
                      name="isBuyerAgent"
                      onChange={(e) =>
                        handleChangeFormData({
                          target: {
                            name: "isBuyerAgent",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                  </Flex>
                </Flex>
              </GridItem>

              <GridItem colSpan={isDesktop ? 2 : 1}>
                <Flex
                  columnGap={2}
                  rowGap={3}
                  mt={3}
                  dir="rtl"
                  direction="column"
                  borderWidth={1}
                  borderColor="gray.200"
                  borderStyle="dashed"
                  borderRadius="md"
                  p={2}
                  fontFamily="iransans"
                  fontSize="13px"
                >
                  <Text bg="gray.100" textAlign="center" fontSize="17px">
                    اطلاعات تماس
                  </Text>
                  <FormControl
                    isRequired={
                      formData?.customerBase == "ارتباط با تلفن" ? true : false
                    }
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نوع تلفن
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="customerAddressType"
                        placeholder="نوع تلفن را انتخاب کنید"
                        value={formData.customerPhoneType}
                        onChange={handleChangeFormData}
                      >
                        {PhoneTypes.map((p) => (
                          <option key={p.key} value={p.value}>
                            {p.value}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>
                  <FormControl
                    isRequired={
                      formData?.customerBase == "ارتباط با تلفن" ? true : false
                    }
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        شماره تلفن
                      </FormLabel>
                      <MyInputBox
                        icon={Phone}
                        name="customerPhone"
                        title="شماره تلفن"
                        size={19}
                        value={formData.customerPhone}
                        onChange={handleChangeFormData}
                      ></MyInputBox>
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        شماره موبایل
                      </FormLabel>
                      <MyInputBox
                        icon={Smartphone}
                        name="customerMobile"
                        title="شماره موبایل"
                        value={formData.customerMobile}
                        onChange={handleChangeFormData}
                      ></MyInputBox>
                    </HStack>
                  </FormControl>
                </Flex>
              </GridItem>
              <GridItem colSpan={isDesktop ? 2 : 1}>
                <Flex
                  columnGap={2}
                  rowGap={3}
                  mt={3}
                  dir="rtl"
                  direction="column"
                  borderWidth={1}
                  borderColor="gray.200"
                  borderStyle="dashed"
                  borderRadius="md"
                  p={2}
                  fontFamily="iransans"
                  fontSize="13px"
                >
                  <Text bg="gray.100" textAlign="center" fontSize="17px">
                    اطلاعات نشانی
                  </Text>

                  <FormControl>
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        کد پستی
                      </FormLabel>
                      <MyInputBox
                        icon={Mailbox}
                        name="customerPostalCode"
                        title="کد پستی"
                        value={formData.customerPostalCode}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl
                    isRequired={
                      formData?.customerBase == "ارتباط با آدرس" ? true : false
                    }
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نوع آدرس
                      </FormLabel>
                      <Select
                        dir="ltr"
                        name="customerAddressType"
                        placeholder="نوع آدرس را انتخاب کنید"
                        value={formData.customerAddressType}
                        onChange={handleChangeFormData}
                      >
                        {AddressTypes.map((p) => (
                          <option key={p.key} value={p.value}>
                            {p.value}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </FormControl>

                  <FormControl
                    isRequired={
                      formData?.customerBase == "ارتباط با آدرس" ? true : false
                    }
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="135px">
                        آدرس
                      </FormLabel>
                      <Textarea
                        placeholder="آدرس"
                        name="customerAddress"
                        resize="horizontal"
                        size="lg"
                        value={formData.customerAddress}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                </Flex>
              </GridItem>
            </SimpleGrid>
            <Button
              leftIcon={<SquareCheckBig />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              تایید
            </Button>
          </Flex>
        </CardBody>
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
