import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  CircleX,
  DollarSign,
  Dot,
  Ellipsis,
  Hash,
  Info,
  Package2,
  PackageSearch,
  SquareCheckBig,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";
import { useState, useEffect } from "react";
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

export const NewDepotEntry = ({ isDesktop }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [showSearchGood, setShowSearchGood] = useState(false);
  const [showSearchCustomer, setShowSearchCustomer] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedGood, setSelectedGood] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGood) {
      toast({
        title: "توجه",
        description: "باید یک کالا انتخاب کنید",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
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
      form.append("image", formData.depotImage);
      const imageRes = await UpdateDepotImageFile(response.data.id, form);
      if (!imageRes) {
        toast({
          title: "خطایی در ارسال تصویر  رخ داد",
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
      setFormData({});
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleItemChange = async (id) => {
    setSelectedGood(id);
    const res = await ShowGoodByID(id);
    if (!res.success) {
      return;
    }
    setFormData({ ...formData, good: res?.data });
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
            ثبت ورودی کالا
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
                  نام کالا
                </FormLabel>
                <Input
                  placeholder="یک کالا انتخاب کنید"
                  type="text"
                  onClick={() =>
                    !formData?.good ? handleShowSearchGood() : ""
                  }
                  value={formData.good ? formData.good?.goodName : ""}
                  name="good"
                  readOnly
                />
                {formData.good && (
                  <IconButton
                    size="md"
                    icon={<CircleX />}
                    colorScheme="red"
                    onClick={() => {
                      setFormData({ ...formData, good: null });
                      setSelectedGood(null);
                    }}
                    title="انصراف"
                    variant="ghost"
                  />
                )}
                <IconButton
                  size={"md"}
                  colorScheme="orange"
                  icon={<PackageSearch />}
                  onClick={() => {
                    handleShowSearchGood();
                  }}
                  title="جستجوی کالا "
                />
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  میزان
                </FormLabel>
                <NumberInput
                  fontSize="md"
                  textAlign="center"
                  fontFamily="IranSans"
                  defaultValue={1}
                  dir="ltr"
                  min={1}
                  name="quantity"
                  value={formData.quantity}
                  placeholder="تعداد"
                  maxW={200}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text>{formData?.good?.goodUnit?.unitName}</Text>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  شماره سریال
                </FormLabel>
                <MyInputBox
                  icon={Hash}
                  name="goodSerial"
                  title="شماره سریال"
                  value={formData.goodSerial}
                  onChange={handleChangeFormData}
                />
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="150px">
                  تاریخ ورود
                </FormLabel>
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
                      target: { value: e, name: "deliveredAt" },
                    })
                  }
                />
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="170px">
                  تحویل دهنده
                </FormLabel>
                <Input
                  placeholder="لطفا یک مشتری انتخاب کنید"
                  maxW="560px"
                  onClick={() => setShowSearchCustomer(true)}
                  value={
                    formData.deliveredBy !== null
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
              <HStack mt={1} mr="auto">
                <FormLabel hidden={!isDesktop} width="150px">
                  تصویر کالا
                </FormLabel>
                <InputGroup maxW="500px">
                  <InputLeftElement>
                    <IconButton
                      colorScheme="red"
                      variant="ghost"
                      icon={<CircleX />}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          depotImage: "",
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
                    name="depotImage"
                    value={formData.depotImage}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        depotImage: e.target.value,
                        imageFile: e.target.files[0],
                      });
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </InputGroup>
                {formData.depotImage && (
                  <Box
                    _hover={{ cursor: "pointer", borderColor: "orange" }}
                    overflow="auto"
                    borderRadius="6px"
                    borderColor="black"
                    borderWidth="1px"
                    hidden={
                      formData.depotImage == null || formData.depotImage == ""
                    }
                    boxSize="20"
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
      <SearchGoods
        searchItems={handleSearchGoods}
        isOpen={showSearchGood}
        onClose={() => setShowSearchGood(false)}
        onSelect={(g) => {
          handleItemChange(g.id);
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
          hidden={formData.depotImage == null || formData.depotImage == ""}
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
