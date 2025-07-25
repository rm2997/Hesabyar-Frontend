import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Progress,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowUpFromLine,
  CircleX,
  ClipboardCheck,
  FolderOpen,
} from "lucide-react";
import { MyLoading } from "../MyLoading";
import { useState } from "react";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router-dom";

import { CreateCustomer } from "../../api/services/customerService";

export const UploadCustomers = ({ isDesktop }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [fileRecords, setFileRecords] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();

  const handlePreviewFile = async () => {
    if (!selectedFileName) return;
    setProgress(0);
    const reader = new FileReader();
    setLoading(true);
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setFileRecords(jsonData);
      setRecordCount(jsonData.length);
    };
    reader.readAsBinaryString(selectedFile);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalIsOpen(true);

    for (let i = 0; i < fileRecords.length; i++) {
      const record = fileRecords[i];
      const fieldNames = Object.keys(record);
      const sepidarId = record[fieldNames[11]];
      const customerFName = record[fieldNames[1]];
      const customerLName = record[fieldNames[2]];
      const customerNatCode = record[fieldNames[10]];
      const customerPhone = record[fieldNames[13]];
      const customerPostalCode = record[fieldNames[18]];
      const customerAddress =
        record[fieldNames[19]] + " " + record[fieldNames[19]];

      const customerData = {
        customerFName: customerFName,
        customerLName: customerLName,
        customerNationalCode: customerNatCode,
        customerPhone: customerPhone,
        customerMobile: "",
        customerAddress: customerAddress,
        customerPostalCode: customerPostalCode,
        customerGender: "",
        sepidarId: sepidarId,
        goodInfo: "ورودی سپیدار",
      };

      await CreateCustomer(customerData)
        .then((res) => {
          const count = Math.round(((i + 1) / fileRecords.length) * 100);
          setProgress(count);
        })
        .catch((err) => {});
    }
    toast({
      title: "ثبت شد",
      description: `اطلاعات ${fileRecords.length} رکورد برای ثبت به سرور ارسال شد`,
      status: "success",
      duration: null,
      isClosable: true,
    });
    setLoading(false);
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append("excelFile", selectedFile);
  //   try {
  //     await UploadGoodsFile(formData)
  //       .then((res) => {
  //         if (!res.data) return;
  //         setSelectedFile(null);
  //         selectedFileName("");
  //         toast({
  //           title: "ثبت شد",
  //           description: `اطلاعات کالاها ذخیره شد`,
  //           status: "success",
  //           duration: 3000,
  //           isClosable: true,
  //         });
  //       })
  //       .catch((err) =>
  //         toast({
  //           title: "خطایی رخ داد",
  //           description: `${err}`,
  //           status: "error",
  //           duration: 3000,
  //           isClosable: true,
  //         })
  //       )
  //       .finally(setLoading(false));
  //   } catch (err) {
  //     console.log(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleChangeFormData = (e) => {};
  // if (loading)
  //   return (
  //     <AbsoluteCenter>
  //       <Spinner size="xl" color="red.400" />
  //     </AbsoluteCenter>
  //   );

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
            آپلود دسته ای مشتریان
          </CardHeader>
        )}
        <CardBody borderTopWidth={2}>
          <VStack
            align={"stretch"}
            direction={["column", "row"]}
            as="form"
            rowGap={8}
            onSubmit={handleSubmit}
          >
            <FormControl isRequired>
              <HStack>
                <FormLabel hidden={!isDesktop} width="250px">
                  فایل مورد نظر را انتخاب کنید
                </FormLabel>
                <Input
                  disabled={loading}
                  accept=".xlsx, .xls"
                  hidden={true}
                  type="file"
                  name="uploadFile"
                  id="uploadFile"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    setSelectedFileName(e.target.value);
                  }}
                />
                <label htmlFor="uploadFile" disabled={loading}>
                  <Box
                    maxHeight={10}
                    maxWidth={160}
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    p="10px 20px"
                    bg=" #ffee5f "
                    color="black"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.300"
                    cursor={loading ? "not-allowed" : "pointer"}
                    _hover={{ bg: "yellow.400" }}
                  >
                    {loading && <Spinner />}
                    <FolderOpen style={{ margin: "2px", marginLeft: "10px" }} />
                    <Text>انتخاب فایل</Text>
                  </Box>
                </label>
                <HStack
                  hidden={!selectedFileName}
                  borderRadius="4px"
                  borderWidth="1px"
                  borderColor="gray.200"
                  p="4px"
                >
                  <Text dir="ltr">{selectedFileName}</Text>
                  <IconButton
                    hidden={!selectedFileName}
                    isLoading={loading}
                    disabled={loading}
                    variant="ghost"
                    colorScheme="red"
                    icon={<CircleX />}
                    onClick={() => {
                      setSelectedFileName("");
                      setSelectedFile(null);
                      setFileRecords(0);
                      setProgress(0);
                      setRecordCount(0);
                    }}
                  />
                </HStack>
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                <Button
                  leftIcon={<ClipboardCheck />}
                  colorScheme="green"
                  disabled={!selectedFileName || loading}
                  onClick={handlePreviewFile}
                  isLoading={loading}
                >
                  بررسی فایل
                </Button>
                <Text>تعداد رکورد : </Text>

                <Text>{recordCount}</Text>
              </HStack>
            </FormControl>
            <Flex direction="column">
              <Center>
                <Text dir="ltr">{progress}%</Text>
              </Center>
              <Progress
                dir="ltr"
                value={progress}
                size="md"
                hasStripe
                colorScheme="yellow"
                borderRadius={5}
                title="50%"
                margin="0"
              />
            </Flex>
            <Button
              leftIcon={<ArrowUpFromLine />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              disabled={fileRecords <= 0 || loading}
            >
              شروع ارسال اطلاعات مشتریان
            </Button>
          </VStack>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      {loading && <MyLoading />}
    </Box>
  );
};
