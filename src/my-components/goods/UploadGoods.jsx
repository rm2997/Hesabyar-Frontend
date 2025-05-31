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
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { CircleX, FileChartColumn, SquareCheckBig } from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { UploadGoodsFile } from "../../api/services/goodsService";

export const UploadGoods = ({ isDesktop }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("excelFile", selectedFile);
    try {
      await UploadGoodsFile(formData)
        .then((res) => {
          if (!res.data) return;
          setSelectedFile(null);
          selectedFileName("");
          toast({
            title: "ثبت شد",
            description: `اطلاعات کالاها ذخیره شد`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) =>
          toast({
            title: "خطایی رخ داد",
            description: `${err}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        )
        .finally(setLoading(false));
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFormData = (e) => {};

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
              <label htmlFor="uploadFile">
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  p="10px 20px"
                  bg="purple.400"
                  color="white"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: "purple.600" }}
                >
                  <FileChartColumn
                    style={{ margin: "2px", marginLeft: "10px" }}
                  />
                  <Text>آپلود فایل</Text>
                </Box>
              </label>
              <Text dir="ltr">{selectedFileName}</Text>
              <IconButton
                hidden={!selectedFileName}
                variant="ghost"
                colorScheme="red"
                icon={<CircleX />}
                onClick={() => {
                  setSelectedFileName("");
                  setSelectedFile(null);
                }}
              />
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
  );
};
