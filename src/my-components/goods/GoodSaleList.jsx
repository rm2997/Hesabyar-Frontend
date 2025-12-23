import { useEffect, useState } from "react";
import { ShowGoodSaleListByID } from "../../api/services/goodsService";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FileSpreadsheet, WalletCards } from "lucide-react";
import { MyLoading } from "../MyLoading";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";

export const GoodSaleList = ({ goodId }) => {
  const [loading, setLoading] = useState(false);
  const [saleList, setSaleList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const toast = useToast();
  dayjs.extend(jalali);
  useEffect(() => {
    const loadGoodSaleList = async () => {
      setLoading(true);
      const res = await ShowGoodSaleListByID(goodId);
      if (!res.success) {
        toast({
          title: "خطایی رخ داد",
          description: res.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      setSaleList([...res.data]);
      setLoading(false);
    };
    loadGoodSaleList();
  }, [goodId]);
  useEffect(() => {
    calculateTotal();
  }, [saleList]);
  const calculateTotal = () => {
    const total = saleList.reduce((sum, i) => sum + i.Quantity, 0);
    setTotalCount(total);
    console.log(total);
  };

  return (
    <Box flex="1" px={1}>
      <Flex
        textColor={"white"}
        borderBottomRadius={"md"}
        bg="green.600"
        zIndex={1}
        position={"sticky"}
        w="full"
        top={"0px"}
        h={"70px"}
        boxShadow={"xl"}
        direction={"column"}
      >
        <Flex m="auto">
          <Heading as="h3" size="lg" fontFamily="iransans">
            {saleList[0]?.ItemTitle}
          </Heading>
        </Flex>
      </Flex>

      <Flex mt={"10px"} direction="column" gap={4}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {saleList?.map((row) => (
            <Card
              borderTopRadius={5}
              borderWidth={1}
              _hover={{ borderColor: "orange" }}
            >
              <CardHeader
                maxH="60px"
                bg="green.500"
                borderTopRadius={5}
                color="white"
                _hover={{ cursor: "pointer" }}
              >
                <Flex justify="space-between" columnGap={3}>
                  <FileSpreadsheet color="yellow" />
                  <Flex flex={3} direction={"row"} gap={3}>
                    <Tooltip label={row?.Number}>
                      <Flex direction={"row"} gap={2}>
                        <Text fontFamily="iransans">فاکتور شماره</Text>
                        <Text align={"justify"} fontFamily="iransans">
                          {row?.Number}
                        </Text>
                      </Flex>
                    </Tooltip>
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody px={4} py={2}>
                <VStack align={"stretch"} spacing={2}>
                  <HStack>
                    <Text> تاریخ :</Text>
                    <Text fontFamily="IranSans" fontSize="md" mr="auto">
                      {dayjs(row?.Date).locale("fa").format("YYYY/MM/DD")}
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text> نوع :</Text>
                    <Text mr="auto">{row?.SaleTypeTitle}</Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text fontFamily="iransans"> مشتری :</Text>
                    <Tooltip label={row?.CustomerPartyName}>
                      <Text mr="auto" fontFamily="iransans">
                        {row?.CustomerPartyName?.length > 25
                          ? row?.CustomerPartyName?.substring(0, 25) + "..."
                          : row?.CustomerPartyName}
                      </Text>
                    </Tooltip>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text> انبار :</Text>
                    <Text fontFamily="IranSans" fontSize="md" mr="auto">
                      {row?.StockTitle}
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text> تعداد :</Text>
                    <Text fontFamily="IranSans" fontSize="md" mr="auto">
                      {Number(row?.Quantity).toLocaleString()} {row?.UnitTitle}
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text> فی :</Text>
                    <Text fontFamily="IranSans" fontSize="md" mr="auto">
                      {Number(row?.Fee).toLocaleString()} {row?.CurrencyTitle}
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text> مبلغ :</Text>
                    <Text fontFamily="IranSans" fontSize="md" mr="auto">
                      {Number(row?.Price[1]).toLocaleString()}{" "}
                      {row?.CurrencyTitle}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Flex>
      <Divider mt="10px" />
      <Flex mt="10px" my="10px">
        <Flex p={"5px"} borderRadius={"md"} bgColor={"yellow.300"} mr="auto">
          <Text fontFamily="IranSans" fontSize="md" mx={"5px"}>
            مجموع ثبت شده در تمام فاکتور ها:{" "}
          </Text>

          <Text fontFamily="IranSans" fontSiz e="md">
            {Number(totalCount).toLocaleString()} {saleList[0]?.UnitTitle}
          </Text>
        </Flex>
      </Flex>
      {loading && <MyLoading />}
    </Box>
  );
};
