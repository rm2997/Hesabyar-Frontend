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
  ShowInvoicesByID,
  ShowUserAllInvoices,
} from "../../api/services/invoiceService";
import { SearchInvoices } from "../../my-components/SearchInvoic";

export const NewDepotExit = ({ isDesktop }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [showSearchGood, setShowSearchGood] = useState(false);
  const [showSearchInvoice, setShowSearchInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(false);
  const [invoiceGoods, setInvoiceGoods] = useState([]);

  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedGood, setSelectedGood] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const initFormData = async () => {
    for (let key in formData) formData[key] = "";
  };

  useEffect(() => {
    console.log(invoiceGoods);
  }, [invoiceGoods]);
  useEffect(() => {
    setFormData({ ...formData, quantity: 0 });
  }, []);
  const validateForm = async () => {
    if (!selectedGood) {
      toast({
        title: "توجه",
        description: "باید یک کالا انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.deliveredAt) {
      toast({
        title: "توجه",
        description: "باید یک تاریخ ورود انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.deliveredBy) {
      toast({
        title: "توجه",
        description: "باید یک تحویل دهنده انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.goodSerial) {
      toast({
        title: "توجه",
        description: "شماره سریال کالا را ثبت کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.quantity || formData.quantity == 0) {
      toast({
        title: "توجه",
        description: "میزان کالا را ثبت کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.imageFile) {
      toast({
        title: "توجه",
        description: "تصویر کالا را ثبت کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleCancelImage = () => {
    fileInputRef.current.value = "";
    setFormData({
      depotImage: "",
      imageFile: null,
    });
    setImagePreview(null);
  };
  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({
        ...formData,
        depotImage: file.name,
        imageFile: file,
      });
      setImagePreview(URL.createObjectURL(file));
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
    const validate = await validateForm();
    if (validate == false) return;
    try {
      setLoading(true);

      const response = await CreateDepot(formData);
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

      const form = new FormData();
      form.append("image", formData.imageFile);
      const imageRes = await UpdateDepotImageFile(response.data.id, form);
      if (!imageRes) {
        toast({
          title: "خطایی در ارسال تصویر رخ داد",
          description: response.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      toast({
        title: "ثبت شد",
        description: `اطلاعات ورودی انبار ذخیره شد`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await initFormData();
      setSelectedGood(null);
      setImagePreview("");
      setLoading(false);
    } catch (err) {
      toast({
        title: "خطایی رخ داد",
        description: `${err}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChangeFormData = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleSearchGoods = async (query) => {
    const response = await ShowAllGoods(1, 10, query);
    return response.data.items;
  };

  const handleSearchCustomers = async (query) => {
    const response = await ShowAllCustomers(1, 10, query);
    return response.data.items;
  };

  const handleShowSearchGood = async () => {
    setShowSearchGood(true);
  };

  const handleChangeGood = async (id) => {
    setSelectedGood(id);
    const res = await ShowGoodByID(id);
    if (!res.success) {
      return;
    }
    setFormData({ ...formData, depotGood: res?.data });
  };

  const handleShowSearchInvoice = async () => {
    setShowSearchInvoice(true);
  };

  const handleInvoiceChange = async (id) => {
    setSelectedInvoice(id);
    const res = await ShowInvoicesByID(id);
    if (!res.success) {
      return;
    }
    setFormData({ ...formData, depotInvoice: res?.data });
    setInvoiceGoods(res?.data.invoiceGoods);
  };

  const handleSearchInvoices = async (query) => {
    const response = await ShowUserAllInvoices(1, 10, query);
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
                <FormLabel hidden={!isDesktop} width="170px">
                  فاکتور
                </FormLabel>
                <Input
                  placeholder="یک فاکتور انتخاب کنید"
                  type="text"
                  onClick={() =>
                    !formData?.depotInvoice ? handleShowSearchInvoice() : ""
                  }
                  value={
                    formData.depotInvoice
                      ? formData?.depotInvoice?.id +
                        "-" +
                        formData?.depotInvoice?.title
                      : ""
                  }
                  name="depotInvoice"
                  readOnly
                />
                {formData.depotInvoice && (
                  <IconButton
                    size="md"
                    icon={<CircleX />}
                    colorScheme="red"
                    onClick={() => {
                      setFormData({ ...formData, depotInvoice: null });
                      setInvoiceGoods([]);
                      setSelectedInvoice(null);
                    }}
                    title="انصراف"
                    variant="ghost"
                  />
                )}
                <IconButton
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
            {invoiceGoods.length > 0 && (
              <Flex
                direction={isDesktop ? "" : "column"}
                rowGap={3}
                dir="ltr"
                w="full"
                columnGap={3}
                mt={2}
              >
                {invoiceGoods.map((invoiceItem) => (
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    p={3}
                    minW="150px"
                    boxShadow="md"
                    position="relative"
                    key={invoiceItem?.id}
                  >
                    <Flex justify="space-between" align="center">
                      <IconButton
                        colorScheme="red"
                        variant="ghost"
                        size="xs"
                        icon={<CircleX />}
                        //onClick={() => onRemove?.(product.id)}
                      />
                      <Text
                        fontFamily="IranSans"
                        fontWeight="bold"
                        fontSize="md"
                      >
                        {invoiceItem?.good?.goodName}
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
                        maxW="80px"
                        fontFamily="IranSans"
                        defaultValue={1}
                        key={"quantity" + invoiceItem.quantity}
                        dir="ltr"
                        min={1}
                        max={invoiceItem.quantity}
                        name="quantity"
                        value={invoiceItem?.quantity}
                        // onChange={(value) =>
                        //   handleItemChange(index, "quantity", value)
                        // }
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
                        {invoiceItem?.good?.goodUnit?.unitName}
                      </Text>
                    </Flex>
                    <Flex
                      justify="space-between"
                      mt={3}
                      columnGap={3}
                      dir="rtl"
                    >
                      <Text
                        dir="rtl"
                        fontFamily="iransans"
                        fontSize="xs"
                        mt={2}
                      >
                        شماره سریال
                      </Text>
                      <Input
                        maxW="120px"
                        autoComplete={false}
                        name="goodSerial"
                        placeholder="شماره سریال"
                        value={formData.goodSerial}
                        onChange={handleChangeFormData}
                      />
                      <Text w="5px" />
                    </Flex>
                    <Flex justify="space-between" mt={3} dir="rtl">
                      <FormLabel hidden={!isDesktop} width="150px">
                        تصویر کالا
                      </FormLabel>
                      <label
                        htmlFor={"depotImage" + invoiceItem.id}
                        disabled={loading}
                      >
                        <Box
                          maxHeight={10}
                          maxWidth={160}
                          as="span"
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          p="10px 20px"
                          bg="orange.300"
                          color="black"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.300"
                          cursor={loading ? "not-allowed" : "pointer"}
                          _hover={{ bg: "orange.100" }}
                        >
                          {loading && <Spinner />}
                          <Ellipsis
                            style={{ margin: "2px", marginLeft: "10px" }}
                          />
                          <Text fontSize="sm">انتخاب تصویر</Text>
                        </Box>
                      </label>

                      <IconButton
                        htmlFor="depotImage"
                        colorScheme="red"
                        variant="ghost"
                        icon={<CircleX />}
                        onClick={handleCancelImage}
                      />

                      <Input
                        id={"depotImage" + invoiceItem.id}
                        hidden
                        accept="image/*"
                        capture="environment"
                        pt="5px"
                        pb="5px"
                        type="file"
                        name="depotImage"
                        ref={fileInputRef}
                        onChange={(e) => {
                          handleChangeImage(e);
                        }}
                      />

                      {formData.depotImage && (
                        <Box
                          _hover={{
                            cursor: "pointer",
                            borderColor: "orange",
                          }}
                          overflow="auto"
                          borderRadius="6px"
                          borderColor="black"
                          borderWidth="1px"
                          hidden={!formData.depotImage}
                          boxSize="50px"
                          onClick={(e) => {
                            setShowImageModal(true);
                          }}
                        >
                          <Image
                            src={imagePreview}
                            objectFit="cover"
                            target="_blank"
                            rel="noopener noreferrer"
                            alt={formData.depotImage}
                          />
                        </Box>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Flex>
            )}

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
                    name="deliveredAt"
                    value={formData.deliveredAt}
                    onChange={(e) =>
                      handleChangeFormData({
                        target: { value: e ? e : "", name: "deliveredAt" },
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
                    formData.deliveredBy
                      ? formData?.deliveredBy?.customerGender +
                        " " +
                        formData?.deliveredBy?.customerFName +
                        " " +
                        formData?.deliveredBy?.customerLName
                      : ""
                  }
                  name="deliveredBy"
                  readOnly
                />
                {formData.deliveredBy && (
                  <IconButton
                    size={isDesktop ? "md" : "sm"}
                    icon={<CircleX />}
                    colorScheme="red"
                    title="انصراف"
                    variant="ghost"
                    onClick={() =>
                      setFormData({ ...formData, deliveredBy: null })
                    }
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
                  توضیحات
                </FormLabel>
                <MyInputBox
                  icon={Info}
                  name="depotInfo"
                  title="توضیحات"
                  value={formData.depotInfo}
                  onChange={handleChangeFormData}
                ></MyInputBox>
              </HStack>
            </FormControl>
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
        <CardFooter></CardFooter>
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
      <SearchGoods
        searchItems={handleSearchGoods}
        isOpen={showSearchGood}
        onClose={() => setShowSearchGood(false)}
        onSelect={(g) => {
          handleChangeGood(g.id);
          setShowSearchGood(false);
        }}
      />
      <SearchCustomer
        searchItems={handleSearchCustomers}
        isOpen={showSearchCustomer}
        onClose={() => setShowSearchCustomer(false)}
        onSelect={(g) => {
          handleChangeFormData({
            target: { name: "deliveredBy", value: g },
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
        size={isDesktop ? "xl" : "full"}
      >
        <Box
          overflow="auto"
          borderRadius="6px"
          borderColor="orange"
          borderWidth="1px"
          hidden={!formData.depotImage}
          boxSize={isDesktop ? "lg" : "sm"}
        >
          <Image
            src={imagePreview}
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
            alt="تصویر کالا"
          />
        </Box>
      </MyModal>
      {loading && <MyLoading />}
    </Box>
  );
};
