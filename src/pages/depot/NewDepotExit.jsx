import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  CircleX,
  DollarSign,
  Dot,
  DotSquare,
  Ellipsis,
  FolderOpen,
  FolderOpenDot,
  Hash,
  Info,
  Package2,
  PackageSearch,
  PlusCircle,
  ScanSearch,
  SquareCheckBig,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  CreateGood,
  ShowAllGoods,
  ShowGoodByID,
} from "../../api/services/goodsService";
import { useNavigate } from "react-router-dom";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
import { ShowAllUnits } from "../../api/services/unitsService";
import { SearchGoods } from "../../my-components/SearchGood";
import {
  CreateDepot,
  UpdateDepotImageFile,
} from "../../api/services/depotService";
import { MyModal } from "../../my-components/MyModal";
import { Datepicker } from "@ijavad805/react-datepicker";
import { SearchCustomer } from "../../my-components/SearchCustomer";
import { ShowAllCustomers } from "../../api/services/customerService";
import { NewCustomer } from "../customers/NewCustomer";
import {
  ShowInvoiceApprovedFile,
  ShowInvoicesByID,
  ShowUserAcceptedInvoicesByCustomerId,
} from "../../api/services/invoiceService";
import { SearchInvoices } from "../../my-components/SearchInvoic";
import { PersianAlphabet } from "../../api/services/enums/persianAlphabets.enum";

export const NewDepotExit = ({ isDesktop }) => {
  const [formData, setFormData] = useState({
    depotInvoice: null,
    depotType: "",
    description: "",
    depotGoods: null,
    totalAmount: 0,
    totalQuantity: 0,
    issuedBy: null,
    issuedAt: "",
    driver: "",
    driverCarNumber: "",
    driverNatCode: "",
  });
  const [depotGoods, setDepotGoods] = useState([
    // {
    //   quantity: 0,
    //   price: 0,
    //   good: null,
    //   serial: "",
    //   description: "",
    //   issuedBy: null,
    //   issuedAt: "",
    //   image: null,
    //   imagePreview: "",
    //   imageFile: null,
    // },
  ]);
  //const [showSearchGood, setShowSearchGood] = useState(false);
  const [showSearchInvoice, setShowSearchInvoice] = useState(false);
  //const [selectedInvoice, setSelectedInvoice] = useState(false);
  //const [invoiceGoods, setInvoiceGoods] = useState([]);
  const [approvedFile, setApprovedFile] = useState(null);

  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInvoiceImageModal, setShowInvoiceImageModal] = useState(false);
  const [selectedDepotGood, setSelectedDepotGood] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   const [selectedGood, setSelectedGood] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const initFormData = async () => {
    setFormData({
      depotInvoice: null,
      depotType: "",
      description: "",
      depotGoods: null,
      totalAmount: 0,
      totalQuantity: 0,
      issuedBy: null,
      issuedAt: "",
      driver: "",
      driverCarNumber: "",
      driverMobile: "",
      driverNatCode: "",
    });
    setDepotGoods([]);
  };

  const validateDate = async (inputDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);

    return date <= today;
  };

  const validateForm = async () => {
    if (!formData.depotInvoice) {
      toast({
        title: "توجه",
        description: "باید یک فاکتور انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!depotGoods || depotGoods?.length < 1) {
      toast({
        title: "توجه",
        description: "باید حداقل یک کالا از فاکتور انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!formData.issuedAt || !(await validateDate(formData?.issuedAt))) {
      toast({
        title: "توجه",
        description: "تاریخ خروج صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.issuedBy) {
      toast({
        title: "توجه",
        description: "باید مشتری را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    // if (!formData?.driverMobile || formData?.driverMobile?.length != 11) {
    //   toast({
    //     title: "توجه",
    //     description: "شماره موبایل راننده صحیح نیست",
    //     status: "warning",
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   return false;
    // }
    // const serialCheck = depotGoods.every((good) => {
    //   let retVal = true;
    //   if (!good.serial) {
    //     toast({
    //       title: "توجه",
    //       description: `شماره سریال  \"${good?.good.goodName}\" را ثبت کنید`,
    //       status: "warning",
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     retVal = false;
    //   }
    //   return retVal;
    // });
    // if (!serialCheck) return false;

    // const imageCheck = depotGoods.every((good) => {
    //   let retval = true;
    //   if (!good.imageFile) {
    //     toast({
    //       title: "توجه",
    //       description: `تصویر  ${good?.good.goodName} را ثبت کنید`,
    //       status: "warning",
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     retval = false;
    //   }
    //   return retval;
    // });
    // if (!imageCheck) return false;
    // if (
    //   formData?.driver?.length == 0 &&
    //   formData?.driverCarNumber?.length == 0 &&
    //   formData?.driverNatCode?.length == 0
    // ) {
    //   toast({
    //     title: "توجه",
    //     description: "باید حداقل یکی از مشخصات راننده یا خودرو را مشخص کنید",
    //     status: "warning",
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   return false;
    // }

    return true;
  };

  const handleCancelImage = (index) => {
    const tmpDepotGoods = [...depotGoods];
    tmpDepotGoods[index] = {
      ...tmpDepotGoods[index],
      image: "",
      imageFile: null,
      imagePreview: "",
    };
    setDepotGoods(tmpDepotGoods);
  };

  const handleChangeImage = async (index, e) => {
    setSelectedDepotGood(index);
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const tmpDepotGoods = [...depotGoods];
      tmpDepotGoods[index] = {
        ...tmpDepotGoods[index],
        image: "",
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      };
      setDepotGoods(tmpDepotGoods);
    } else {
      toast({
        title: "توجه",
        description: "تصویر انتخاب شده مورد تایید نمی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let totalQuantity = 0;
    let totalAmount = 0;
    depotGoods.forEach((element) => {
      totalQuantity += element.quantity;
      totalAmount += element.price * element.quantity;
    });

    const validate = await validateForm();
    if (validate == false) return;

    const tmpDepotGoods = [...depotGoods];
    const tmpformData = formData;
    tmpformData.driver = tmpformData?.depotInvoice?.driver;
    tmpformData.driverCarNumber = tmpformData?.depotInvoice?.driverCarNumber;
    tmpformData.driverNatCode = tmpformData?.depotInvoice?.driverNatCode;
    tmpformData.driverMobile = tmpformData?.depotInvoice?.driverMobile;
    tmpformData.isSent = tmpformData?.depotInvoice?.isSent;
    tmpformData.customerToken = tmpformData?.depotInvoice?.driverToken;

    tmpDepotGoods.forEach((g) => {
      g.issuedAt = tmpformData.issuedAt;
      g.issuedBy = tmpformData.issuedBy;
      g.description = formData?.description;
    });
    tmpformData.depotType = "خروجی";
    tmpformData.totalQuantity = totalQuantity;
    tmpformData.totalAmount = totalAmount;
    tmpformData.depotGoods = [...tmpDepotGoods];

    setLoading(true);
    const response = await CreateDepot(tmpformData);
    if (!response?.success) {
      toast({
        title: "خطایی رخ داد",
        description: response?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      initFormData();
      setLoading(false);
      return;
    }
    //await handleSubmitImages(response?.data?.depotGoods);
    await initFormData();
    toast({
      title: "توجه",
      description: "با موفقیت ثبت شد",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  const handleSubmitImages = async (data) => {
    data.forEach(async (element, index) => {
      const form = new FormData();
      form.append("image", depotGoods[index].imageFile);
      const imageRes = await UpdateDepotImageFile(element.id, form);
      if (!imageRes.success)
        toast({
          title: "خطایی در ارسال تصویر رخ داد",
          description: imageRes.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      setLoading(false);
      initFormData();
    });
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeGoodsData = (index, e) => {
    const newDepotGoods = [...depotGoods]; // کپی آرایه
    newDepotGoods[index] = {
      ...newDepotGoods[index], // کپی شیء
      [e.target.name]: e.target.value,
    };
    setDepotGoods(newDepotGoods);
  };

  const handleRemoveDepotGood = (index) => {
    const tmpDepotGoods = [...depotGoods];
    tmpDepotGoods.pop(index);
    setDepotGoods(tmpDepotGoods);
    setSelectedDepotGood(null);
  };

  const handleSearchCustomers = async (query) => {
    const response = await ShowAllCustomers(1, 10, query);
    return response?.data?.items;
  };

  const handleShowSearchInvoice = async () => {
    setShowSearchInvoice(true);
  };

  const handleInvoiceChange = async (id) => {
    //setSelectedInvoice(id);
    const res = await ShowInvoicesByID(id);
    if (!res?.success) {
      return;
    }
    console.log(res.data);

    setFormData({
      ...formData,
      driver: res?.data?.driver,
      driverCarNumber: res?.data?.driverCarNumber,
      driverMobile: res?.data?.driverMobile,
      driverNatCode: res?.data?.driverNatCode,
      depotInvoice: res?.data,
    });

    const tmpDepotGoods = [];
    const goods = [...res?.data?.invoiceGoods];
    goods?.forEach((good) => {
      const depotGood = {
        quantity: good.quantity,
        price: good.price,
        good: good.good,
        serial: "",
        description: "",
        issuedBy: null,
        issuedAt: "",
        image: null,
        imagePreview: "",
        imageFile: null,
      };
      tmpDepotGoods?.push(depotGood);
    });
    setDepotGoods(tmpDepotGoods);
    await loadInvoiceImage(id);
    //setInvoiceGoods(res?.data.invoiceGoods);
  };

  const handleSearchInvoices = async (query) => {
    const response = await ShowUserAcceptedInvoicesByCustomerId(
      formData?.issuedBy?.id,
      1,
      10,
      query
    );
    return response?.data?.items;
  };

  const handleAddNewUser = () => {
    onOpen();
  };

  const loadInvoiceImage = async (id) => {
    setLoading(true);

    const res = await ShowInvoiceApprovedFile(id);
    if (!res.success) {
      if (res.status != 404)
        toast({
          title: "خطا در دریافت تصویر",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    } else {
      const url = URL.createObjectURL(res?.data);
      setApprovedFile(url);
    }
    setLoading(false);
  };

  // const handleChangeCustomer = async (customerId) => {
  //   setLoading(true);
  //   const res = await ShowInvoicesCustomer(customerId);
  //   if (!res.success) {
  //     toast({
  //       title: "خطایی  رخ داد",
  //       description: res.error,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     setLoading(false);
  //     return;
  //   }
  // };
  return (
    <Box minH={"58vh"}>
      <Card m={1} filter={loading ? "blur(10px)" : ""}>
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            ثبت خروج کالا
          </CardHeader>
        )}
        <CardBody borderTopWidth={2}>
          <VStack
            align={"stretch"}
            direction={["column", "row"]}
            as="form"
            spacing={5}
            onSubmit={handleSubmit}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} minW="150px">
                  مشتری
                </FormLabel>
                <Input
                  placeholder="لطفا یک مشتری انتخاب کنید"
                  onClick={() => setShowSearchCustomer(true)}
                  value={
                    formData.issuedBy
                      ? formData?.issuedBy?.customerGender +
                        " " +
                        formData?.issuedBy?.customerFName +
                        " " +
                        formData?.issuedBy?.customerLName
                      : ""
                  }
                  name="issuedBy"
                  readOnly
                />
                {formData.issuedBy && (
                  <IconButton
                    size={isDesktop ? "md" : "sm"}
                    icon={<CircleX />}
                    colorScheme="red"
                    title="انصراف"
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        issuedBy: null,
                        depotInvoice: null,
                      });
                      setDepotGoods([]);
                      setSelectedDepotGood(null);
                    }}
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
                <FormLabel hidden={!isDesktop} minW="150px">
                  فاکتور
                </FormLabel>
                <Input
                  disabled={!formData.issuedBy}
                  placeholder="یک فاکتور انتخاب کنید"
                  type="text"
                  onClick={() =>
                    !formData?.depotInvoice ? handleShowSearchInvoice() : ""
                  }
                  value={
                    formData?.depotInvoice
                      ? formData?.depotInvoice?.title
                        ? formData?.depotInvoice?.id +
                          "-" +
                          formData?.depotInvoice?.title
                        : formData?.depotInvoice?.id + " - " + "بدون عنوان"
                      : ""
                  }
                  name="depotInvoice"
                  readOnly
                />
                {formData?.depotInvoice && (
                  <IconButton
                    size="md"
                    icon={<CircleX />}
                    colorScheme="red"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        depotInvoice: null,
                        driver: "",
                        driverCarNumber: "",
                        driverNatCode: "",
                        driverMobile: "",
                      });
                      setApprovedFile(null);
                      setDepotGoods([]);
                      setSelectedDepotGood(null);
                    }}
                    title="انصراف"
                    variant="ghost"
                  />
                )}
                <IconButton
                  disabled={!formData.issuedBy}
                  size={"md"}
                  colorScheme="orange"
                  icon={<ScanSearch />}
                  onClick={() => {
                    handleShowSearchInvoice();
                  }}
                  title="جستجوی فاکتور "
                />
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  تاریخ خروج
                </FormLabel>
                <Box
                  borderWidth={1}
                  borderColor="gray.300"
                  borderRadius="md"
                  p={2}
                >
                  <Datepicker
                    fontSize="md"
                    fontFamily="IranSans"
                    input={
                      <input
                        style={{ borderColor: "gray", borderWidth: "1px" }}
                        placeholder="تاریخ خروج را انتخاب کنید..."
                      />
                    }
                    id="chequeDate"
                    closeWhenSelectADay={true}
                    format={"YYYY/MM/DD"}
                    adjustPosition="auto"
                    theme="green"
                    allowClear={true}
                    name="issuedAt"
                    value={formData.issuedAt}
                    onChange={(e) =>
                      handleChangeFormData({
                        target: { value: e ? e : "", name: "issuedAt" },
                      })
                    }
                  />
                </Box>
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  توضیحات
                </FormLabel>
                <MyInputBox
                  icon={Info}
                  name="description"
                  title="توضیحات"
                  value={formData.description}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>
            {depotGoods?.length > 0 && (
              <Flex
                borderStyle="dashed"
                borderColor="gray.300"
                borderWidth={1}
                borderRadius={"md"}
                p={2}
                direction="column"
                dir="rtl"
                w="full"
                gap={10}
              >
                <Text
                  mx={!isDesktop ? "auto" : ""}
                  fontFamily="iransans"
                  bg="gray.100"
                  textAlign="center"
                  fontSize="17px"
                >
                  لیست اقلام فاکتور
                </Text>
                <Flex
                  direction={isDesktop ? "" : "column"}
                  rowGap={2}
                  dir="ltr"
                  w="full"
                  columnGap={3}
                  mt={1}
                >
                  {depotGoods?.map((depotItem, index) => (
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      p={3}
                      minW="150px"
                      maxW="250px"
                      boxShadow="md"
                      position="relative"
                      key={index + "-depotGood"}
                    >
                      <Flex justify="space-between" align="center">
                        <IconButton
                          colorScheme="red"
                          variant="ghost"
                          size="xs"
                          icon={<CircleX />}
                          onClick={() => handleRemoveDepotGood(index)}
                        />
                        <Text
                          fontFamily="IranSans"
                          fontWeight="bold"
                          fontSize="md"
                        >
                          {depotItem?.good?.goodName}
                        </Text>
                      </Flex>

                      <Flex
                        justify="space-between"
                        columnGap={2}
                        mt={3}
                        dir="rtl"
                      >
                        <Text
                          dir="rtl"
                          fontFamily="iransans"
                          fontSize="xs"
                          my="auto"
                        >
                          تعداد
                        </Text>
                        <GridItem colSpan={2}>
                          <NumberInput
                            size={"sm"}
                            fontFamily="IranSans"
                            defaultValue={1}
                            key={"quantity" + index}
                            dir="ltr"
                            min={1}
                            max={depotItem?.quantity}
                            value={depotItem?.quantity}
                            onChange={(value) =>
                              handleChangeGoodsData(index, {
                                target: { name: "quantity", value: value },
                              })
                            }
                            placeholder="تعداد"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </GridItem>
                        <Text
                          dir="rtl"
                          fontFamily="iransans"
                          fontSize="xs"
                          my="auto"
                        >
                          {depotItem?.good?.goodUnit?.unitName}
                        </Text>
                      </Flex>

                      {/* <Flex
                        justify="space-between"
                        mt={3}
                        columnGap={2}
                        dir="rtl"
                      >
                        <Text
                          dir="rtl"
                          fontFamily="iransans"
                          fontSize="xs"
                          my="auto"
                        >
                          سریال
                        </Text>

                        <Input
                          size="sm"
                          dir="ltr"
                          autoComplete={false}
                          name="serial"
                          placeholder="شماره سریال"
                          value={depotItem?.serial}
                          onChange={(e) => handleChangeGoodsData(index, e)}
                        />
                      </Flex> */}

                      {/* <Flex justify="space-between" mt={3} dir="rtl">
                        <Text
                          dir="rtl"
                          fontFamily="iransans"
                          fontSize="xs"
                          mt={2}
                          ml={2}
                        >
                          تصویر
                        </Text>
                        <label
                          style={{ marginLeft: "auto" }}
                          htmlFor={"image" + index}
                          disabled={loading}
                        >
                          <Box
                            maxHeight={10}
                            maxWidth={160}
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            p="5px 10px"
                            bg="orange.300"
                            color="black"
                            borderRadius="md"
                            borderWidth="0.5px"
                            borderColor="gray.300"
                            cursor={loading ? "not-allowed" : "pointer"}
                            _hover={{ bg: "orange.100" }}
                          >
                            <Ellipsis />
                          </Box>
                        </label>

                        <IconButton
                          hidden={!depotGoods[index]?.imagePreview}
                          colorScheme="red"
                          variant="ghost"
                          icon={<CircleX />}
                          onClick={() => handleCancelImage(index)}
                        />

                        <Input
                          id={"image" + index}
                          hidden
                          accept="image/*"
                          capture="environment"
                          pt="5px"
                          pb="5px"
                          type="file"
                          name="image"
                          onChange={(e) => {
                            handleChangeImage(index, e);
                          }}
                        />

                        {depotGoods[index]?.imagePreview && (
                          <Box
                            _hover={{
                              cursor: "pointer",
                              borderColor: "orange",
                            }}
                            overflow="auto"
                            borderRadius="6px"
                            borderColor="black"
                            borderWidth="1px"
                            boxSize="50px"
                            onClick={() => {
                              setShowImageModal(true);
                            }}
                          >
                            <Image
                              src={depotGoods[index]?.imagePreview}
                              objectFit="cover"
                              target="_blank"
                              rel="noopener noreferrer"
                              alt={depotGoods[index]?.image}
                            />
                          </Box>
                        )}
                      </Flex> */}
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            <Flex
              columnGap={2}
              hidden={!formData?.driver}
              mt={1}
              dir="rtl"
              direction="column"
              borderWidth={1}
              borderColor="gray.300"
              borderStyle="dashed"
              borderRadius="md"
              p={2}
              fontFamily="iransans"
              fontSize="13px"
            >
              <Text bg="gray.100" textAlign="center" fontSize="17px">
                مدارک واریز وجه
              </Text>
              <Flex columnGap={2} p={2}>
                <Box
                  onClick={() => setShowInvoiceImageModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={approvedFile == null || approvedFile == ""}
                  boxSize={"150px"}
                >
                  <Image
                    src={approvedFile ? approvedFile : ""}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="تاییدیه"
                  />
                </Box>
              </Flex>
            </Flex>
            <Flex
              columnGap={2}
              hidden={!formData?.driver}
              mt={1}
              dir="rtl"
              direction="column"
              borderWidth={1}
              borderColor="gray.300"
              borderStyle="dashed"
              borderRadius="md"
              p={2}
              fontFamily="iransans"
              fontSize="13px"
            >
              <Text bg="gray.100" textAlign="center" fontSize="17px">
                مشخصات راننده
              </Text>
              <Flex columnGap={2} p={2}>
                <Text>نام و نام خانوادگی :</Text>
                <Text>{formData?.driver}</Text>
              </Flex>
              <Flex hidden={!formData?.driverNatCode} columnGap={2} p={2}>
                <Text>شماره ملی :</Text>
                <Text>{formData?.driverNatCode}</Text>
              </Flex>
              <Flex hidden={!formData?.driverMobile} columnGap={2} p={2}>
                <Text>شماره موبایل :</Text>
                <Text>{formData?.driverMobile}</Text>
              </Flex>
              <Flex hidden={!formData?.driverCarNumber} columnGap={2} p={2}>
                <Text p={1} fontFamily="iransans">
                  شماره خودرو :
                </Text>
                <Flex
                  borderWidth={1}
                  borderColor="gray.200"
                  columnGap={2}
                  p={1}
                >
                  <Text
                    bg="gray.100"
                    fontFamily="iransans"
                    borderLeftWidth={1}
                    borderLeftColor="gray.200"
                    px={1}
                  >
                    {formData?.driverCarNumber?.substring(7)}
                  </Text>
                  <Text fontFamily="iransans">
                    {formData?.driverCarNumber?.substring(4, 7)}
                  </Text>
                  <Text fontFamily="iransans" bg="gray.100">
                    {formData?.driverCarNumber
                      ? PersianAlphabet?.find(
                          (k) =>
                            k.key == formData?.driverCarNumber?.substring(2, 4)
                        )?.value
                      : ""}
                  </Text>
                  <Text fontFamily="iransans">
                    {formData?.driverCarNumber?.substring(0, 2)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Button
              leftIcon={<SquareCheckBig />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              تایید
            </Button>
          </VStack>
        </CardBody>
      </Card>
      <SearchInvoices
        searchItems={handleSearchInvoices}
        isOpen={showSearchInvoice}
        onClose={() => setShowSearchInvoice(false)}
        onSelect={(g) => {
          handleInvoiceChange(g.id);
          setShowSearchInvoice(false);
        }}
      />
      {/* <SearchGoods
        searchItems={handleSearchGoods}
        isOpen={showSearchGood}
        onClose={() => setShowSearchGood(false)}
        onSelect={(g) => {
          handleChangeGood(g.id);
          setShowSearchGood(false);
        }}
      /> */}
      <SearchCustomer
        searchItems={handleSearchCustomers}
        isOpen={showSearchCustomer}
        onClose={() => setShowSearchCustomer(false)}
        onSelect={(g) => {
          handleChangeFormData({
            target: { name: "issuedBy", value: g },
          });
          setShowSearchCustomer(false);
        }}
      />
      <MyModal modalHeader={"ثبت مشتری جدید"} onClose={onClose} isOpen={isOpen}>
        <NewCustomer />
      </MyModal>
      <MyModal
        modalHeader="تصویر کالا"
        onClose={() => setShowImageModal(false)}
        isOpen={showImageModal}
        size={isDesktop ? "xl" : "xs"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          boxSize={isDesktop ? "lg" : "2xs"}
        >
          <Image
            src={depotGoods[selectedDepotGood]?.imagePreview}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر کالا"
          />
        </Box>
      </MyModal>
      <MyModal
        modalHeader="تصویر مدارک واریز وجه"
        onClose={() => setShowInvoiceImageModal(false)}
        isOpen={showInvoiceImageModal}
        size={isDesktop ? "xl" : "xs"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          boxSize={isDesktop ? "lg" : "2xs"}
        >
          <Image
            src={approvedFile}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر مدارک واریز وجه"
          />
        </Box>
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
