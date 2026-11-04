import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { UploadGoodPrices } from "../../api/services/goodsService";
import { CircleX, Upload } from "lucide-react";

export default function ProductPrice() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const toast = useToast();

  const uploadProductPrices = async () => {
    setLoading(true);
    const form = new FormData();
    form.append("file", fileName.files[0]);
    const res = await UploadGoodPrices(form);

    if (!res.success) {
      toast({
        title: "توجه",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "موفق",
      description: "لیست قیمت ها با موفقیت ارسال شد",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  };

  return (
    <Box mt={5} flex="1" overflowY="auto">
      <Flex direction="column" px={2}>
        <Box borderTopRadius="md" p={3} w="full" bg="#68C15A">
          <Text>لیست قیمت های محصولات</Text>
        </Box>
        <SimpleGrid
          textColor="black"
          columns={1}
          gap={5}
          bg="white"
          p={5}
          borderBottomRadius="md"
          boxShadow={"md"}
        >
          <HStack>
            <InputGroup maxW="500px">
              <InputLeftElement>
                <IconButton
                  disabled={!fileName}
                  colorScheme="red"
                  variant="ghost"
                  icon={<CircleX />}
                  onClick={() => setFileName(null)}
                />
              </InputLeftElement>
              <Input
                accept=".jpg,.pdf"
                capture="environment"
                pt="5px"
                pb="5px"
                type="file"
                name="approvedFile"
                value={fileName?.value ? fileName?.value : ""}
                onChange={(e) => {
                  if (
                    e.target.files[0].type === "image/jpeg" ||
                    e.target.files[0].type === "application/pdf"
                  ) {
                    setFileName(e.target);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  } else {
                    setFileName(null);
                  }
                }}
              />
            </InputGroup>
            <IconButton
              disabled={!fileName}
              variant={"solid"}
              colorScheme="blue"
              onClick={uploadProductPrices}
              isLoading={loading}
            >
              <Upload />
            </IconButton>
          </HStack>
          <Box
            overflow="auto"
            borderRadius="6px"
            borderColor="orange"
            borderWidth="1px"
            hidden={!fileName || fileName.files[0].type !== "image/jpeg"}
            boxSize="xl"
            alignContent={"center"}
          >
            <Image
              w={"full"}
              h={"full"}
              src={imagePreview}
              objectFit="fill"
              alt={fileName?.value}
            />
          </Box>
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
