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
  IconButton,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  Captions,
  CircleX,
  Contact,
  Contact2,
  Hash,
  IdCard,
  MapPin,
  Phone,
  PlusCircle,
  SquareCheckBig,
} from "lucide-react";
import { useState } from "react";
import { CreateCustomer } from "../../api/services/customerService";

import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
import { CustomerTypes } from "../../api/services/enums/customerTypes.enum";
import { AddressTypes } from "../../api/services/enums/addressTypes.enum";
import { PhoneTypes } from "../../api/services/enums/phoneTypes.enum";
import { CustomerParties } from "../../api/services/enums/customerParties.enum";

export const NewCustomer = ({ isDesktop }) => {
  const [formData, setFormData] = useState({
    customerTitle: "",
    customerFName: "",
    customerLName: "",
    customerNationalCode: "",
    customerGender: "",
    locations: [],
    phoneNumbers: [],
  });
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const initFormData = async () => {
    setFormData({
      customerType: "",
      customerBase: "",
      customerTitle: "",
      customerFName: "",
      customerLName: "",
      customerNationalCode: "",
      customerGender: "",
      locations: [],
      phoneNumbers: [],
    });
    setLocations([]);
    setPhoneNumbers([]);
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
    if (
      formData?.customerFName?.trim().length > 0 &&
      formData?.customerFName?.trim().length < 2
    ) {
      toast({
        title: "توجه",
        description: "لطفا نام صحیح را وارد کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.customerFName?.trim().length > 0 &&
      !isNaN(Number(formData?.customerFName))
    ) {
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

    return true;
  };

  const validatePhoneNumbers = async () => {
    for (const phone of phoneNumbers) {
      console.log(phone);
      if (
        (phone.phoneType == PhoneTypes[1].value &&
          phone?.phoneNumber?.trim().length != 11) ||
        isNaN(Number(phone?.phoneNumber?.trim()))
      ) {
        toast({
          title: "توجه",
          description: `شماره ثبت شده صحیح نیست  ${phone.index} `,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      if (
        phone?.phoneNumber?.trim().length > 0 &&
        (phone?.phoneNumber?.trim().length < 5 ||
          isNaN(Number(phone?.phoneNumber)))
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
    }
    setFormData({ ...formData, phoneNumbers: [...phoneNumbers] });
    return true;
  };

  const validateLocations = async () => {
    for (const location of locations) {
      if (
        location?.postalCode?.trim().length > 0 &&
        (location?.postalCode?.trim().length != 10 ||
          isNaN(Number(location?.postalCode)))
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
    }
    setFormData({ ...formData, locations: locations });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((await validateForm()) == false) return;
    if ((await validatePhoneNumbers()) == false) return;
    if ((await validateLocations()) == false) return;
    console.log({ ...formData, locations, phoneNumbers });

    setLoading(true);

    const response = await CreateCustomer({
      ...formData,
      locations,
      phoneNumbers,
    });
    if (!response.success) {
      toast({
        title: "خطایی رخ داد",
        description: response.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    await initFormData();
    toast({
      title: "ثبت شد",
      description: `اطلاعات مشتری ذخیره شد`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleAddNewPhone = () => {
    const customerPhoneNumbers = [...phoneNumbers];
    const newPhone = {
      phoneType: PhoneTypes[1].value,
      phoneNumber: "",
      unique: new Date().getTime(),
      isPrimary: false,
    };
    customerPhoneNumbers.push(newPhone);
    setPhoneNumbers(customerPhoneNumbers);
  };

  const handleAddNewAddress = () => {
    const customerLocations = [...locations];
    const newLocation = {
      locationType: AddressTypes[4].value,
      location: "",
      unique: new Date().getTime(),
      postalCode: "",
    };
    customerLocations.push(newLocation);
    setLocations(customerLocations);
  };

  const handleRemovePhone = (phone) => {
    const customerPhoneNumbers = phoneNumbers.filter(
      (p) => p.unique != phone.unique
    );
    setPhoneNumbers(customerPhoneNumbers);
  };

  const handleRemoveLocation = (location) => {
    const customerLocations = locations.filter(
      (l) => l.unique != location.unique
    );
    setLocations(customerLocations);
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePhoneFormData = (phone, updatedFields) => {
    setPhoneNumbers((old) =>
      old.map((p) =>
        p.unique == phone.unique ? { ...p, ...updatedFields } : p
      )
    );
  };

  const handleChangeLocationsFormData = (location, updatedFields) => {
    setLocations((old) =>
      old.map((l) =>
        l.unique == location.unique ? { ...l, ...updatedFields } : l
      )
    );
  };

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
                  <Text
                    borderTopRadius={"md"}
                    bg="gray.100"
                    textAlign="center"
                    fontSize="17px"
                    py={2}
                  >
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
                  <Text
                    borderTopRadius="md"
                    bg="gray.100"
                    textAlign="center"
                    fontSize="17px"
                    py={2}
                  >
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
                        icon={Captions}
                        name="customerTitle"
                        title="عنوان"
                        value={formData.customerTitle}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl
                    isRequired={formData?.customerLName?.trim().length < 2}
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نام مشتری
                      </FormLabel>
                      <MyInputBox
                        isInvalid={
                          formData?.customerFName?.trim().length > 0 &&
                          !isNaN(Number(formData?.customerFName))
                        }
                        icon={Contact}
                        name="customerFName"
                        title="نام"
                        value={formData.customerFName}
                        onChange={handleChangeFormData}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl
                    isRequired={
                      formData?.customerType == "حقوقی"
                        ? false
                        : true || formData?.customerFName?.trim().length < 2
                    }
                  >
                    <HStack>
                      <FormLabel hidden={!isDesktop} width="150px">
                        نام خانوادگی
                      </FormLabel>
                      <MyInputBox
                        isInvalid={
                          formData?.customerLName?.trim().length < 2 ||
                          !isNaN(Number(formData?.customerLName))
                        }
                        icon={Contact2}
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
                        isInvalid={
                          formData?.customerType == "حقوقی"
                            ? formData?.customerNationalCode?.trim().length <
                                4 ||
                              isNaN(Number(formData?.customerNationalCode))
                            : formData?.customerNationalCode?.trim().length >
                                0 &&
                              (formData?.customerNationalCode?.trim().length !=
                                10 ||
                                isNaN(Number(formData?.customerNationalCode)))
                        }
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
                        isInvalid={
                          formData?.customerEconomicCode?.trim().length > 0 &&
                          (formData?.customerEconomicCode?.trim().length < 5 ||
                            isNaN(Number(formData?.customerEconomicCode)))
                        }
                        maxLength="10"
                        icon={Hash}
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
                  <Text
                    borderTopRadius="md"
                    bg="gray.100"
                    textAlign="center"
                    fontSize="17px"
                    py={2}
                  >
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
                  direction={"column"}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderStyle="dashed"
                  borderRadius="md"
                  p={2}
                  fontFamily="iransans"
                  fontSize="13px"
                >
                  <Text
                    borderTopRadius="md"
                    bg="gray.100"
                    textAlign="center"
                    fontSize="17px"
                    py={2}
                  >
                    اطلاعات تماس
                  </Text>
                  <Flex
                    direction={isDesktop ? "row" : "column"}
                    dir={isDesktop ? "rtl" : ""}
                  >
                    {phoneNumbers?.map((phone, index) => (
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={3}
                        w="250px"
                        boxShadow="md"
                        position="relative"
                        key={phone.unique}
                        mx={isDesktop ? "" : "auto"}
                      >
                        <Flex justify="space-between" align="center">
                          <IconButton
                            colorScheme="red"
                            variant="ghost"
                            size="xs"
                            icon={<CircleX />}
                            onClick={() => {
                              handleRemovePhone(phone);
                            }}
                          />

                          <Text
                            mx={1}
                            dir="rtl"
                            fontFamily="IranSans"
                            fontWeight="bold"
                            fontSize="md"
                          >
                            {"شماره تلفن" + " " + (index + 1)}
                          </Text>
                        </Flex>

                        <Flex
                          direction={"column"}
                          justify="space-between"
                          gap={3}
                          mt={3}
                          dir="rtl"
                        >
                          <FormControl
                            isRequired={
                              formData?.customerBase == "ارتباط با تلفن"
                                ? true
                                : false
                            }
                          >
                            <HStack>
                              <FormLabel hidden={!isDesktop} width="150px">
                                نوع تلفن
                              </FormLabel>
                              <Select
                                dir="ltr"
                                name="phoneType"
                                placeholder="نوع تلفن را انتخاب کنید"
                                value={phone?.phoneType}
                                onChange={(e) =>
                                  handleChangePhoneFormData(phone, {
                                    phoneType: e.target.value,
                                  })
                                }
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
                              formData?.customerBase == "ارتباط با تلفن"
                                ? true
                                : false
                            }
                          >
                            <HStack>
                              <FormLabel hidden={!isDesktop} width="150px">
                                شماره
                              </FormLabel>
                              <MyInputBox
                                isInvalid={
                                  formData?.customerBase == "ارتباط با تلفن" &&
                                  (phone?.phoneNumber?.trim().length < 5 ||
                                    isNaN(Number(phone?.phoneNumber)))
                                }
                                icon={Phone}
                                name="phoneNumber"
                                title="شماره"
                                size={19}
                                value={phone?.phoneNumber}
                                onChange={(e) =>
                                  handleChangePhoneFormData(phone, {
                                    phoneNumber: e.target.value,
                                  })
                                }
                              ></MyInputBox>
                            </HStack>
                          </FormControl>
                          <FormControl>
                            <HStack>
                              <FormLabel htmlFor={phone.unique}>
                                شماره اصلی
                              </FormLabel>
                              <Switch
                                id={phone.unique}
                                title="شماره اصلی"
                                isChecked={phone?.isPrimary}
                                name="isPrimary"
                                onChange={(e) =>
                                  handleChangePhoneFormData(phone, {
                                    isPrimary: e.target.checked,
                                  })
                                }
                              />
                            </HStack>
                          </FormControl>
                        </Flex>
                      </Box>
                    ))}
                    <Box
                      mx={isDesktop ? "5px" : "auto"}
                      my={isDesktop ? "auto" : "5px"}
                    >
                      <IconButton
                        ml={3}
                        icon={<PlusCircle size="24px" strokeWidth={1.2} />}
                        size="lg"
                        my="auto"
                        mx={isDesktop ? "" : "auto"}
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleAddNewPhone()}
                      />
                    </Box>
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
                  <Text
                    borderTopRadius="md"
                    bg="gray.100"
                    textAlign="center"
                    fontSize="17px"
                    py={2}
                  >
                    اطلاعات نشانی
                  </Text>
                  <Flex
                    direction={isDesktop ? "row" : "column"}
                    dir={isDesktop ? "rtl" : ""}
                  >
                    {locations?.map((location, index) => (
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={3}
                        w="250px"
                        boxShadow="md"
                        position="relative"
                        key={location.unique}
                        mx={isDesktop ? "" : "auto"}
                      >
                        <Flex justify="space-between" align="center">
                          <IconButton
                            colorScheme="red"
                            variant="ghost"
                            size="xs"
                            icon={<CircleX />}
                            onClick={() => {
                              handleRemoveLocation(location);
                            }}
                          />

                          <Text
                            mx={1}
                            dir="rtl"
                            fontFamily="IranSans"
                            fontWeight="bold"
                            fontSize="md"
                          >
                            {"نشانی" + " " + (index + 1)}
                          </Text>
                        </Flex>

                        <Flex
                          direction={"column"}
                          justify="space-between"
                          gap={3}
                          mt={3}
                          dir="rtl"
                        >
                          <FormControl
                            isRequired={
                              formData?.customerBase == "ارتباط با تلفن"
                                ? true
                                : false
                            }
                          >
                            <HStack>
                              <FormLabel hidden={!isDesktop} width="150px">
                                نوع نشانی
                              </FormLabel>
                              <Select
                                dir="ltr"
                                name="locationType"
                                placeholder="نوع نشانی را انتخاب کنید"
                                value={location?.locationType}
                                onChange={(e) =>
                                  handleChangePhoneFormData(location, {
                                    locationType: e.target.value,
                                  })
                                }
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
                              formData?.customerBase == "ارتباط با تلفن"
                                ? true
                                : false
                            }
                          >
                            <HStack>
                              <FormLabel hidden={!isDesktop} width="150px">
                                نشانی
                              </FormLabel>
                              <Textarea
                                isInvalid={
                                  formData?.customerBase == "ارتباط با آدرس" &&
                                  (location?.location?.trim().length < 5 ||
                                    isNaN(Number(location?.location)))
                                }
                                resize="vertical"
                                size="lg"
                                name="location"
                                placeholder="نشانی"
                                value={location?.location}
                                onChange={(e) =>
                                  handleChangeLocationsFormData(location, {
                                    location: e.target.value,
                                  })
                                }
                              />
                            </HStack>
                          </FormControl>
                          <FormControl>
                            <HStack>
                              <FormLabel hidden={!isDesktop} width="150px">
                                کد پستی
                              </FormLabel>
                              <MyInputBox
                                icon={MapPin}
                                name="postalCode"
                                title="کد پستی"
                                size={19}
                                value={location?.postalCode}
                                onChange={(e) =>
                                  handleChangeLocationsFormData(location, {
                                    postalCode: e.target.value,
                                  })
                                }
                              />
                            </HStack>
                          </FormControl>
                          <FormControl>
                            <HStack>
                              <FormLabel htmlFor={location.unique}>
                                آدرس پیش فرض
                              </FormLabel>
                              <Switch
                                id={location.unique}
                                title="آدرس پیش فرض"
                                isChecked={location?.isPrimary}
                                name="isPrimary"
                                onChange={(e) =>
                                  handleChangeLocationsFormData(location, {
                                    isPrimary: e.target.checked,
                                  })
                                }
                              />
                            </HStack>
                          </FormControl>
                        </Flex>
                      </Box>
                    ))}
                    <Box
                      mx={isDesktop ? "5px" : "auto"}
                      my={isDesktop ? "auto" : "5px"}
                    >
                      <IconButton
                        ml={3}
                        icon={<PlusCircle size="24px" strokeWidth={1.2} />}
                        size="lg"
                        my="auto"
                        mx={isDesktop ? "" : "auto"}
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleAddNewAddress()}
                      />
                    </Box>
                  </Flex>
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
