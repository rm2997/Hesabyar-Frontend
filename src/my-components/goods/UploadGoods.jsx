import {
  AbsoluteCenter,
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
  Modal,
  Progress,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  Binoculars,
  CircleX,
  FileChartColumn,
  FolderOpen,
  SquareCheckBig,
} from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router-dom";
import { CreateGood, UploadGoodsFile } from "../../api/services/goodsService";
import { MyModal } from "../MyModal";

export const UploadGoods = ({ isDesktop }) => {
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
      const sepidarId = record[fieldNames[2]];
      const goodName = record[fieldNames[3]];
      const goodData = {
        sepidarId: sepidarId,
        goodName: goodName,
        goodUnit: 1,
        goodPrice: 0,
        goodInfo: "ورودی سپیدار",
      };

      await CreateGood(goodData)
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
    <Card m={10}>
      <CardHeader
        bg="#68C15A"
        borderBottomColor="gray.400"
        borderBottomWidth="1px"
        borderTopRadius={5}
        color="black"
      >
        آپلود دسته ای کالاها
      </CardHeader>
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
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  p="10px 20px"
                  bg="purple.400"
                  color="white"
                  borderRadius="md"
                  cursor={loading ? "not-allowed" : "pointer"}
                  _hover={{ bg: "purple.600" }}
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
                leftIcon={<Binoculars />}
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
            leftIcon={<SquareCheckBig />}
            colorScheme="blue"
            type="submit"
            isLoading={loading}
            disabled={fileRecords <= 0 || loading}
          >
            تایید
          </Button>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
