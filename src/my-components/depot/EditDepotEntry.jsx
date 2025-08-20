import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  CircleX,
  Ellipsis,
  Hash,
  Info,
  Phone,
  Plus,
  PlusCircle,
  ScanSearch,
  SquareCheckBig,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MyInputBox } from "../../my-components/MyInputBox";
import { MyLoading } from "../../my-components/MyLoading";
import {
  CreateDepot,
  ShowDepotImageFile,
  ShowDepotWarehouseImages,
  UpdateDepot,
  UpdateDepotImageFile,
} from "../../api/services/depotService";
import { MyModal } from "../../my-components/MyModal";
import { Datepicker } from "@ijavad805/react-datepicker";
import { SearchCustomer } from "../../my-components/SearchCustomer";
import { ShowAllCustomers } from "../../api/services/customerService";
import { ShowAllGoods } from "../../api/services/goodsService";
import { SearchGoods } from "../../my-components/SearchGood";
import { NewCustomer } from "../../pages/customers/NewCustomer";
import { PersianAlphabet } from "../../api/services/enums/persianAlphabets.enum";
export const EditDepotEntry = ({
  isDesktop,
  closeMe,
  onUpdate,
  depot,
  isForAccept = false,
}) => {
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
    driverMobile: "",
    isAccepted: null,
    acceptedBy: null,
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

  const [carNoFirst, setCarNoFirst] = useState("");
  const [carNoAlphabet, setCarNoAlphabet] = useState("");
  const [carNoThird, setCarNoThird] = useState("");
  const [carNoForth, setCarNoForth] = useState("");

  const [showDriverImageModal, setShowDriverImageModal] = useState(false);
  const [driverImagePreview, setDriverImagePreview] = useState(null);

  const [showCarImageModal, setShowCarImageModal] = useState(false);
  const [carImagePreview, setCarImagePreview] = useState(null);

  const [showSearchGood, setShowSearchGood] = useState(false);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedDepotGood, setSelectedDepotGood] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setFormData({
        ...depot,
        issuedBy: depot?.depotGoods[0]?.issuedBy,
        issuedAt: depot?.depotGoods[0]?.issuedAt,
      });

      const tmpDepotGoods = [...depot.depotGoods];

      const goodsWithImages = await Promise.all(
        tmpDepotGoods.map(async (g) => {
          const imageRes = await ShowDepotImageFile(g.id);
          if (!imageRes.success) {
            console.log(imageRes.error);
            return g;
          } else {
            return {
              ...g,
              imagePreview: URL.createObjectURL(imageRes.data),
            };
          }
        })
      );

      setDepotGoods(goodsWithImages);
      if (depot?.warehouseAcceptedBy) await loadWarehouseImages(depot?.id);
      if (depot?.driverCarNumber) await loadCarNumber(depot?.driverCarNumber);
      setFormData({
        ...depot,
        issuedBy: depot?.depotGoods[0]?.issuedBy,
        issuedAt: depot?.depotGoods[0]?.issuedAt,
        depotGoods: goodsWithImages,
      });
    };

    fetchData();
  }, [isOpen]);

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
      driverNatCode: "",
      driverMobile: "",
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
    if (!depotGoods || depotGoods?.length < 1) {
      toast({
        title: "توجه",
        description: "باید حداقل یک کالا انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!formData.issuedAt || !(await validateDate(formData?.issuedAt))) {
      toast({
        title: "توجه",
        description: "تاریخ ورود صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.issuedBy) {
      toast({
        title: "توجه",
        description: "باید تحویل دهنده را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    const serialCheck = depotGoods.every((good) => {
      let retVal = true;
      if (!good.serial) {
        toast({
          title: "توجه",
          description: `شماره سریال  ${good?.good?.goodName} را ثبت کنید`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        retVal = false;
      }
      return retVal;
    });
    if (!serialCheck) return false;

    const priceCheck = depotGoods.every((good) => {
      let retval = true;
      if (isForAccept && (!good.price || good.price == 0)) {
        toast({
          title: "توجه",
          description: `قیمت  ${good?.good?.goodName} را ثبت کنید`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        retval = false;
      }
      return retval;
    });
    if (!priceCheck) return false;
    if (formData?.driver?.length < 3 || !isNaN(Number(formData?.driver))) {
      toast({
        title: "توجه",
        description: "نام یا نام خانوادگی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.driverNatCode?.length > 0 &&
      formData?.driverNatCode?.length != 10
    ) {
      toast({
        title: "توجه",
        description: "شماره ملی صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (isNaN(Number(formData?.driverNatCode))) {
      toast({
        title: "توجه",
        description: "شماره ملی باید به شکل عددی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.driverMobile?.length > 0 &&
      formData?.driverMobile?.length != 11
    ) {
      toast({
        title: "توجه",
        description: "شماره موبایل  صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (isNaN(Number(formData?.driverMobile))) {
      toast({
        title: "توجه",
        description: "شماره موبایل باید به شکل عددی باشد",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      formData?.driver?.length == 0 &&
      formData?.driverCarNumber?.length == 0 &&
      formData?.driverNatCode?.length == 0
    ) {
      toast({
        title: "توجه",
        description: "باید حداقل یکی از مشخصات راننده یا خودرو را مشخص کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const loadWarehouseImages = async (id) => {
    setLoading(true);
    const res = await ShowDepotWarehouseImages(id);
    if (!res?.success) {
      if (res.status != 404)
        toast({
          title: "خطا در دریافت تصاویر",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    } else {
      const dImage = res?.data?.driverSignImage;
      const cImage = res?.data?.carImage;

      if (dImage) setCarImagePreview(cImage);
      if (cImage) setDriverImagePreview(dImage);
    }
    setLoading(false);
  };

  const loadCarNumber = async (carNumber) => {
    const tmpFirst = carNumber.substring(0, 2);
    const tmpLetter = carNumber.substring(2, 4);
    const tmpThird = carNumber.substring(4, 7);
    const tmpForth = carNumber.substring(7);
    console.log(carNumber, tmpFirst, tmpLetter, tmpThird, tmpForth);
    setCarNoFirst(tmpFirst);
    setCarNoAlphabet(tmpLetter);
    setCarNoThird(tmpThird);
    setCarNoForth(tmpFirst);
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

  const handleChangeCarNo = async () => {
    setFormData({
      ...formData,
      driverCarNumber: carNoFirst + carNoAlphabet + carNoThird + carNoForth,
    });
  };

  const validateCarNumber = async () => {
    if (
      carNoFirst?.length > 0 &&
      (carNoFirst?.length != 2 ||
        isNaN(Number(carNoFirst)) ||
        Number(carNoFirst) == 0)
    ) {
      toast({
        title: "توجه",
        description: "قسمت اول پلاک خودرو صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (carNoAlphabet?.length > 0 && carNoAlphabet?.trim() == "") {
      toast({
        title: "توجه",
        description: " حروف پلاک خودرو صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      carNoThird?.length > 0 &&
      (carNoThird?.length != 3 ||
        isNaN(Number(carNoThird)) ||
        Number(carNoThird) == 0)
    ) {
      toast({
        title: "توجه",
        description: "قسمت سوم پلاک خودرو صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (
      carNoForth?.length > 0 &&
      (carNoForth?.length != 2 ||
        isNaN(Number(carNoForth)) ||
        Number(carNoForth) == 0)
    ) {
      toast({
        title: "توجه",
        description: "قسمت آخر پلاک خودرو صحیح نیست",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let totalQuantity = 0;
    let totalAmount = 0;
    depotGoods.forEach((element) => {
      totalQuantity += element.quantity;
      totalAmount += element.price * element.quantity;
    });

    const validateCar = await validateCarNumber();
    if (validateCar == false) return;

    const validate = await validateForm();
    if (validate == false) return;

    const tmpDepotGoods = [...depotGoods];
    const tmpformData = formData;
    tmpDepotGoods.forEach((g) => {
      g.issuedAt = tmpformData.issuedAt;
      g.issuedBy = tmpformData.issuedBy;
    });
    tmpformData.depotType = "ورودی";
    tmpformData.totalQuantity = totalQuantity;
    tmpformData.totalAmount = totalAmount;
    tmpformData.depotGoods = [...tmpDepotGoods];
    tmpformData.driverCarNumber =
      carNoFirst + carNoAlphabet + carNoThird + carNoForth;
    setFormData(tmpformData);
    // if (isForAccept) {
    //   tmpformData.isAccepted = true;
    // } else tmpformData.isAccepted = null;

    setLoading(true);
    const response = await UpdateDepot(tmpformData.id, tmpformData);
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
    onUpdate(response.data);
    await handleSubmitImages(response?.data?.depotGoods);
    await initFormData();
    toast({
      title: "توجه",
      description: "با موفقیت ثبت شد",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    closeMe();
    setLoading(false);
  };

  const handleSubmitImages = async (data) => {
    data.forEach(async (element, index) => {
      if (depotGoods[index].imageFile == null) return;
      const form = new FormData();
      form.append("image", depotGoods[index].imageFile);
      console.log(element.id, form);
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
    });
  };

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeGoodsData = (index, e) => {
    const newDepotGoods = [...depotGoods];
    newDepotGoods[index] = {
      ...newDepotGoods[index],
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
    return response.data.items;
  };

  const handleAddNewGood = (goodDepot) => {
    const tmpDepotGoods = [...depotGoods];
    goodDepot.quantity = 1;
    tmpDepotGoods.push(goodDepot);
    setDepotGoods([...tmpDepotGoods]);
    setSelectedDepotGood(tmpDepotGoods.length);
  };

  const handleSearchGoods = async (query) => {
    const response = await ShowAllGoods(1, 10, query);
    return response.data.items;
  };

  const handleAddNewUser = () => {
    onOpen();
  };

  return (
    <Box>
      <Card m={1} filter={loading ? "blur(10px)" : ""}>
        {isDesktop && (
          <CardHeader
            bg="#68C15A"
            borderBottomColor="gray.400"
            borderBottomWidth="1px"
            borderTopRadius={5}
            color="black"
          >
            ویرایش ورودی انبار
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
                <FormLabel hidden={!isDesktop} width="170px">
                  انتخاب کالا
                </FormLabel>
              </HStack>
            </FormControl>

            <Flex
              direction={isDesktop ? "" : "column"}
              flexWrap={isDesktop ? "wrap" : ""}
              minH="100px"
              rowGap={3}
              p={2}
              dir="ltr"
              w="full"
              columnGap={3}
              borderStyle="dashed"
              borderRadius="md"
              borderWidth={1}
            >
              {depotGoods?.map((depotItem, index) => (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  p={3}
                  w="250px"
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
                      title={depotItem?.good?.goodName}
                      mx={1}
                      dir="rtl"
                      fontFamily="IranSans"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      {depotItem?.good?.goodName.length <= 25
                        ? depotItem?.good?.goodName
                        : depotItem?.good?.goodName.substring(0, 22) + "..."}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" mt={3} dir="rtl">
                    <Text
                      dir="rtl"
                      fontFamily="iransans"
                      fontSize="xs"
                      my="auto"
                    >
                      تعداد
                    </Text>
                    <NumberInput
                      size={"sm"}
                      maxW="80px"
                      fontFamily="IranSans"
                      defaultValue={1}
                      key={"quantity" + index}
                      dir="ltr"
                      min={1}
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
                    <Text
                      dir="rtl"
                      fontFamily="iransans"
                      fontSize="xs"
                      my="auto"
                    >
                      {depotItem?.good?.goodUnit?.unitName}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" mt={3} columnGap={3} dir="rtl">
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      سریال
                    </Text>
                    <Input
                      variant="flushed"
                      size="sm"
                      dir="ltr"
                      autoComplete={false}
                      name="serial"
                      placeholder="شماره سریال"
                      value={depotItem?.serial}
                      onChange={(e) => handleChangeGoodsData(index, e)}
                    />
                  </Flex>

                  <Flex
                    hidden={isForAccept}
                    justify="space-between"
                    columnGap={3}
                    mt={3}
                    dir="rtl"
                  >
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      قیمت
                    </Text>
                    <Input
                      isInvalid={depotItem?.price == 0}
                      size="sm"
                      variant="flushed"
                      textAlign="left"
                      fontFamily="IranSans"
                      name="price"
                      placeholder="قیمت"
                      value={Number(depotItem?.price).toLocaleString()}
                      onChange={(e) => {
                        const rawVal = e.target.value.replaceAll(",", "");
                        if (isNaN(Number(rawVal))) {
                          handleChangeGoodsData(index, {
                            target: { name: "price", value: 0 },
                          });
                          return;
                        }
                        const numVal = Number(rawVal);
                        handleChangeGoodsData(index, {
                          target: { name: "price", value: numVal },
                        });
                      }}
                    />
                  </Flex>
                  <Flex
                    hidden={isForAccept}
                    justify="space-between"
                    columnGap={8}
                    mt={3}
                    dir="rtl"
                  >
                    <Text dir="rtl" fontFamily="iransans" fontSize="xs" mt={2}>
                      جمع
                    </Text>
                    <Input
                      readOnly
                      size="sm"
                      variant="flushed"
                      textAlign="left"
                      fontFamily="IranSans"
                      name="total"
                      value={Number(
                        depotItem?.quantity * depotItem.price
                      ).toLocaleString()}
                      placeholder="جمع کل"
                      onChange={(e) =>
                        handleChangeGoodsData({
                          target: { name: "total", value: e.target.value },
                        })
                      }
                    />
                  </Flex>

                  <Flex justify="space-between" mt={3} dir="rtl">
                    <FormLabel fontSize="xs" fontFamily="iransans" my="auto">
                      تصویر
                    </FormLabel>
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
                  </Flex>
                </Box>
              ))}
              <IconButton
                ml={3}
                icon={<PlusCircle size="lg" strokeWidth={1.2} />}
                size="lg"
                my="auto"
                mx={isDesktop ? "" : "auto"}
                colorScheme="green"
                variant="ghost"
                onClick={() => setShowSearchGood(true)}
              />
            </Flex>

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  تاریخ ورود
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
                        placeholder="تاریخ ورود را انتخاب کنید..."
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

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  تحویل دهنده
                </FormLabel>
                <Input
                  placeholder="لطفا یک مشتری انتخاب کنید"
                  maxW="560px"
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
                    onClick={() => setFormData({ ...formData, issuedBy: null })}
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

            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  مشخصات راننده
                </FormLabel>
                <MyInputBox
                  icon={Info}
                  name="driver"
                  title="مشخصات راننده"
                  value={formData.driver}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>

            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  کد ملی راننده
                </FormLabel>
                <MyInputBox
                  fontFamily="iransans"
                  isInvalid={
                    (formData?.driverNatCode !== undefined &&
                      formData?.driverNatCode?.length > 0 &&
                      formData?.driverNatCode?.length != 10) ||
                    isNaN(Number(formData?.driverNatCode))
                  }
                  maxLength={10}
                  icon={Hash}
                  name="driverNatCode"
                  title="کد ملی راننده"
                  value={formData?.driverNatCode}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    handleChangeFormData(e);
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  موبایل
                </FormLabel>
                <MyInputBox
                  isInvalid={
                    (formData?.driverMobile?.length > 0 &&
                      formData?.driverMobile?.length != 11) ||
                    isNaN(Number(formData?.driverMobile))
                  }
                  fontFamily="iransans"
                  icon={Phone}
                  title="موبایل راننده"
                  maxLength={11}
                  type="text"
                  name="driverMobile"
                  value={formData?.driverMobile}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    handleChangeFormData(e);
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <FormLabel hidden={!isDesktop} width="155px">
                  پلاک خودرو
                </FormLabel>
                <Input
                  dir="ltr"
                  isInvalid={
                    carNoForth?.length > 0 &&
                    (carNoForth?.length != 2 ||
                      isNaN(Number(carNoForth)) ||
                      Number(carNoForth) == 0)
                  }
                  fontFamily="iransans"
                  fontSize="sm"
                  width="60px"
                  type="text"
                  maxLength={2}
                  name="carNoForth"
                  value={carNoForth}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    setCarNoForth(e.target.value);
                    handleChangeCarNo();
                  }}
                />
                <Input
                  dir="ltr"
                  fontFamily="iransans"
                  fontSize="sm"
                  width="80px"
                  isInvalid={
                    carNoThird?.length > 0 &&
                    (carNoThird?.length != 3 ||
                      isNaN(Number(carNoThird)) ||
                      Number(carNoThird) == 0)
                  }
                  maxLength={3}
                  type="text"
                  name="carNoThird"
                  value={carNoThird}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    setCarNoThird(e.target.value);
                    handleChangeCarNo();
                  }}
                />
                <Select
                  isInvalid={carNoFirst?.length > 0 && carNoAlphabet == ""}
                  fontFamily="iransans"
                  fontSize="sm"
                  placeholder="حروف پلاک"
                  name="carNoAlpabet"
                  value={carNoAlphabet}
                  dir="ltr"
                  width="130px"
                  onChange={(e) => {
                    setCarNoAlphabet(e.target.value);
                    handleChangeCarNo();
                  }}
                >
                  {PersianAlphabet.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.value}
                    </option>
                  ))}
                </Select>
                <Input
                  dir="ltr"
                  isInvalid={
                    carNoFirst?.length > 0 &&
                    (carNoFirst?.length != 2 ||
                      isNaN(Number(carNoFirst)) ||
                      Number(carNoFirst) == 0)
                  }
                  fontFamily="iransans"
                  fontSize="sm"
                  width="80px"
                  type="text"
                  maxLength={2}
                  name="carNoFirst"
                  value={carNoFirst}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    setCarNoFirst(e.target.value);
                    handleChangeCarNo();
                  }}
                />
                <Input
                  hidden="true"
                  name="driverCarNumber"
                  value={formData?.driverCarNumber}
                  onChange={handleChangeFormData}
                />
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
            <Flex
              columnGap={2}
              hidden={!formData?.warehouseAcceptedBy}
              mt={1}
              alignItems={isDesktop ? "" : "center"}
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
              <Text
                w="full"
                fontFamily="iransans"
                bg="gray.100"
                textAlign="center"
                fontSize="17px"
              >
                تصاویر ورودی انبار
              </Text>
              <Flex fontFamily="iransans" columnGap={2} p={2}>
                <Text hidden={!isDesktop} fontFamily="iransans">
                  تصویر خودروی حامل کالا
                </Text>
                <Box
                  onClick={() => setShowCarImageModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={carImagePreview == null || carImagePreview == ""}
                  boxSize={"150px"}
                >
                  <Image
                    src={carImagePreview ? carImagePreview : ""}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="انبار"
                  />
                </Box>
              </Flex>
              <Flex fontFamily="iransans" columnGap={9} p={2}>
                <Text hidden={!isDesktop} fontFamily="iransans">
                  تصویر امضای راننده
                </Text>
                <Box
                  onClick={() => setShowDriverImageModal(true)}
                  _hover={{ cursor: "pointer", borderColor: "orange" }}
                  overflow="hidden"
                  borderRadius="6px"
                  borderWidth="1px"
                  hidden={
                    driverImagePreview == null || driverImagePreview == ""
                  }
                  boxSize={"150px"}
                >
                  <Image
                    src={driverImagePreview ? driverImagePreview : ""}
                    objectFit="cover"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="انبار"
                  />
                </Box>
              </Flex>
            </Flex>
            <Button
              leftIcon={<SquareCheckBig />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              isDisabled={formData?.isAccepted || formData?.warehouseAcceptedBy}
              title={
                formData?.isAccepted || formData?.warehouseAcceptedBy
                  ? "این سند ورود کالا قبلا تایید شده است و قایل ویرایش نیست"
                  : ""
              }
            >
              تایید
            </Button>
          </VStack>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      <SearchGoods
        searchItems={handleSearchGoods}
        isOpen={showSearchGood}
        onClose={() => setShowSearchGood(false)}
        onSelect={(g) => {
          handleAddNewGood(g);
          setShowSearchGood(false);
        }}
      />
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
        modalHeader="تصویر خودروی حامل کالا"
        onClose={() => setShowCarImageModal(false)}
        isOpen={showCarImageModal}
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
            src={carImagePreview}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر خودرو"
          />
        </Box>
      </MyModal>
      <MyModal
        modalHeader="تصویر امضای راننده"
        onClose={() => setShowDriverImageModal(false)}
        isOpen={showDriverImageModal}
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
            src={driverImagePreview}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر امضا"
          />
        </Box>
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
