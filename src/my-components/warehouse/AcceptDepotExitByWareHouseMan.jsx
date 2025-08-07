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
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  CircleX,
  Ellipsis,
  Info,
  ScanSearch,
  SquareCheckBig,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";
import { useState, useEffect } from "react";
import { MyLoading } from "../../my-components/MyLoading";
import { PersianAlphabet } from "../../api/services/enums/persianAlphabets.enum";
import {
  InsertDepotDriverSignImage,
  InsertDepotExitGoodImage,
  ShowDepotImageFile,
  ShowDepotWarehouseImages,
} from "../../api/services/depotService";
import { MyModal } from "../../my-components/MyModal";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";
import { ShowInvoiceApprovedFile } from "../../api/services/invoiceService";

export const AcceptDepotExitByWareHouseMan = ({
  isDesktop,
  closeMe,
  onUpdate,
  depot,
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
  dayjs.extend(jalali);

  const [approvedFile, setApprovedFile] = useState("");
  const [showInvoiceImageModal, setShowInvoiceImageModal] = useState(false);

  const [showDriverImageModal, setShowDriverImageModal] = useState(false);
  const [driverImage, setDriverImage] = useState();
  const [driverImagePreview, setDriverImagePreview] = useState(null);

  const [showCarImageModal, setShowCarImageModal] = useState(false);
  const [carImage, setCarImage] = useState();
  const [carImagePreview, setCarImagePreview] = useState(null);

  const { isOpen } = useDisclosure();
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

      setFormData({
        ...depot,
        issuedBy: depot?.depotGoods[0]?.issuedBy,
        issuedAt: depot?.depotGoods[0]?.issuedAt,
        depotGoods: goodsWithImages,
      });
      await loadInvoiceImage(depot?.depotInvoice?.id);
      await loadWarehouseImages(depot?.id);
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
    });
    setDepotGoods([]);
  };

  const validateForm = async () => {
    if (!carImage) {
      toast({
        title: "توجه",
        description: "باید یک فاکتور انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!driverImage) {
      toast({
        title: "توجه",
        description: "باید حداقل یک کالا از فاکتور انتخاب کنید",
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

    const validate = await validateForm();
    if (validate == false) return;

    setLoading(true);
    const driverImageForm = new FormData();
    driverImageForm.append("image", driverImage);
    const driverImageRes = await InsertDepotDriverSignImage(
      depot?.id,
      driverImageForm
    );
    if (!driverImageRes.success) {
      toast({
        title: "خطایی رخ داد",
        description: driverImageRes.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    const carImageForm = new FormData();
    carImageForm.append("image", carImage);
    const carImageRes = await InsertDepotExitGoodImage(depot?.id, carImageForm);
    if (!carImageRes.success) {
      toast({
        title: "خطایی رخ داد",
        description: carImageRes.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    toast({
      title: "توجه",
      description: "شما اطلاعات این سند را تایید کردید",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // await handleSubmitImages(response?.data?.depotGoods);
    await onUpdate({
      ...depot,
      exitGoodImage: carImageRes?.data.carImageRes,
      driverSignImage: driverImageRes?.data?.driverImageRes,
      warehouseAcceptedAt: carImageRes?.data.warehouseAcceptedAt,
    });
    await initFormData();
    setLoading(false);
    closeMe();
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

  const handleCancelDriverimage = async () => {};

  const handleCancelCarimage = async () => {};

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
            تایید خروج کالا توسط انباردار
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
            <Flex
              columnGap={2}
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
                ثبت تصاویر
              </Text>
              <Flex columnGap={2} p={2} ml={isDesktop ? "auto" : ""}>
                <FormControl isRequired>
                  <HStack>
                    <FormLabel
                      fontSize={isDesktop ? "13px" : "12px"}
                      fontFamily="iransans"
                    >
                      تصویر امضای راننده و اسناد
                    </FormLabel>
                    <label
                      style={{ marginLeft: "auto" }}
                      htmlFor={"image-driverimagePreview"}
                      disabled={loading}
                    >
                      <Box
                        maxHeight={10}
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        p="5px 7px"
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

                    <Input
                      id={"image-driverimagePreview"}
                      hidden
                      accept="image/*"
                      capture="environment"
                      pt="5px"
                      pb="5px"
                      type="file"
                      name="image"
                      onChange={(e) => {
                        setDriverImage(e.target.files[0]);
                        setDriverImagePreview(
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                    />
                    <Box
                      hidden={!driverImagePreview}
                      _hover={{
                        cursor: "pointer",
                        borderColor: "orange",
                      }}
                      overflow="auto"
                      borderRadius="sm"
                      ius="6px"
                      borderColor="black"
                      borderWidth="1px"
                      borderStyle="dashed"
                      w={"70px"}
                      h={isDesktop ? "50px" : "30px"}
                      onClick={() => {
                        setShowDriverImageModal(true);
                      }}
                    >
                      <Image
                        src={driverImagePreview}
                        objectFit="cover"
                        target="_blank"
                        rel="noopener noreferrer"
                        alt={"تصویر امضای راننده"}
                      />
                    </Box>
                    <IconButton
                      hidden={!driverImagePreview}
                      colorScheme="red"
                      variant="ghost"
                      icon={<CircleX size={isDesktop ? "30px" : "20px"} />}
                      onClick={() => {
                        setDriverImage(null);
                        setDriverImagePreview(null);
                      }}
                    />
                  </HStack>
                </FormControl>
              </Flex>
              <Flex columnGap={2} p={2} ml={isDesktop ? "auto" : ""}>
                <FormControl isRequired>
                  <HStack>
                    <FormLabel
                      fontSize={isDesktop ? "13px" : "12px"}
                      fontFamily="iransans"
                    >
                      تصویر خودروی حامل کالا
                    </FormLabel>
                    <label
                      style={{ marginLeft: "auto" }}
                      htmlFor={"image-carimagePreview"}
                      disabled={loading}
                    >
                      <Box
                        maxHeight={10}
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        p="5px 7px"
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

                    <Input
                      id={"image-carimagePreview"}
                      hidden
                      accept="image/*"
                      capture="environment"
                      pt="5px"
                      pb="5px"
                      type="file"
                      name="image"
                      onChange={(e) => {
                        setCarImage(e.target.files[0]);
                        setCarImagePreview(
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                    />
                    <Box
                      hidden={!carImagePreview}
                      _hover={{
                        cursor: "pointer",
                        borderColor: "orange",
                      }}
                      overflow="auto"
                      borderRadius="sm"
                      borderColor="black"
                      borderWidth="1px"
                      borderStyle="dashed"
                      w={"70px"}
                      h={isDesktop ? "50px" : "30px"}
                      onClick={() => {
                        setShowCarImageModal(true);
                      }}
                    >
                      <Image
                        src={carImagePreview}
                        objectFit="cover"
                        target="_blank"
                        rel="noopener noreferrer"
                        alt={"تصویر خودرو حامل اقلام"}
                      />
                    </Box>

                    <IconButton
                      hidden={!carImagePreview}
                      colorScheme="red"
                      variant="ghost"
                      icon={<CircleX size={isDesktop ? "30px" : "20px"} />}
                      onClick={() => {
                        setCarImage(null);
                        setCarImagePreview(null);
                      }}
                    />
                  </HStack>
                </FormControl>
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
            <Flex
              columnGap={2}
              hidden={!formData?.driver}
              mt={1}
              direction="column"
              borderWidth={1}
              borderColor="gray.300"
              borderStyle="dashed"
              borderRadius="md"
              p={2}
              fontFamily="iransans"
              fontSize="15px"
            >
              <Text bg="gray.100" textAlign="center" fontSize="17px">
                مشخصات فاکتور
              </Text>
              <Flex columnGap={2} p={2}>
                <Text fontFamily="iransans">گیرنده : </Text>
                <Text fontFamily="iransans">
                  {formData?.issuedBy
                    ? formData?.issuedBy?.customerGender +
                      " " +
                      formData?.issuedBy?.customerFName +
                      " " +
                      formData?.issuedBy?.customerLName
                    : ""}
                </Text>
              </Flex>
              <Flex columnGap={2} p={2}>
                <FormControl isRequired>
                  <HStack>
                    <Text fontFamily="iransans">شماره فاکتور : </Text>
                    <Text fontFamily="iransans">
                      {formData?.depotInvoice
                        ? formData?.depotInvoice?.title
                          ? formData?.depotInvoice?.id +
                            "-" +
                            formData?.depotInvoice?.title
                          : formData?.depotInvoice?.id + " - " + "بدون عنوان"
                        : ""}
                    </Text>
                  </HStack>
                </FormControl>
              </Flex>
              <Flex columnGap={2} p={2}>
                <FormControl isRequired>
                  <HStack>
                    <Text fontFamily="iransans">تاریخ خروج : </Text>
                    <Text fontFamily="iransans">
                      {dayjs(formData?.issuedAt)
                        .locale("fa")
                        .format("YYYY/MM/DD")}
                    </Text>
                  </HStack>
                </FormControl>
              </Flex>
              <Flex columnGap={2} p={2}>
                <FormControl hidden={!formData?.description}>
                  <HStack>
                    <Text fontFamily="iransans">توضیحات: </Text>
                    <Text fontFamily="iransans">{formData?.description}</Text>
                  </HStack>
                </FormControl>
              </Flex>
            </Flex>

            <Flex
              hidden={depotGoods?.length <= 0}
              borderStyle="dashed"
              borderColor="gray.300"
              borderWidth={1}
              borderRadius={"md"}
              p={2}
              direction="column"
              dir="rtl"
              w="full"
              gap={4}
            >
              <Text bg="gray.100" textAlign="center" fontSize="17px">
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
                {depotGoods.map((depotItem, index) => (
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
                    <Flex
                      bg="gray.100"
                      borderRadius="md"
                      borderWidth={1}
                      px={1}
                    >
                      <Text
                        fontFamily="IranSans"
                        fontWeight="bold"
                        fontSize="md"
                        ml="auto"
                      >
                        {depotItem?.good?.goodName}
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
                        max={depotItem?.quantity}
                        value={depotItem?.quantity}
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
                  </Box>
                ))}
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

            <Button
              leftIcon={<SquareCheckBig />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              isDisabled={formData?.isAccepted}
              title={
                formData?.isAccepted
                  ? "این سند خروج کالا قبلا تایید شده است و قابل ویرایش نیست"
                  : ""
              }
            >
              تایید
            </Button>
          </VStack>
        </CardBody>
      </Card>
      <MyModal
        modalHeader="تصویر امضا راننده و اسناد"
        onClose={() => setShowDriverImageModal(false)}
        isOpen={showDriverImageModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={driverImagePreview == null || driverImagePreview == ""}
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={driverImagePreview ? driverImagePreview : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر امضا راننده و اسناد"
          />
        </Box>
      </MyModal>
      <MyModal
        modalHeader="تصویر خودرو"
        onClose={() => setShowCarImageModal(false)}
        isOpen={showCarImageModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={carImagePreview == null || carImagePreview == ""}
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={carImagePreview ? carImagePreview : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر خودرو"
          />
        </Box>
      </MyModal>
      <MyModal
        modalHeader="تصویر مدارک"
        onClose={() => setShowInvoiceImageModal(false)}
        isOpen={showInvoiceImageModal}
        size={isDesktop ? "xl" : "lg"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={approvedFile == null || approvedFile == ""}
          boxSize={isDesktop ? "lg" : "xs"}
        >
          <Image
            src={approvedFile ? approvedFile : ""}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر مدارک"
          />
        </Box>
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
