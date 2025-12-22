import { useEffect, useState } from "react";
import { ShowGoodSaleListByID } from "../../api/services/goodsService";
import { Box, Card, CardBody, CardHeader, Divider, Flex, HStack, SimpleGrid, Stack, Text, Tooltip, useToast, VStack } from "@chakra-ui/react";
import { WalletCards } from "lucide-react";
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
        }
        loadGoodSaleList();

    }, [goodId]);
    useEffect(() => { calculateTotal(); }, [saleList])
    const calculateTotal = () => {
        const total = saleList.reduce((sum, i) => sum + i.Quantity, 0)
        setTotalCount(total)
        console.log(total);

    }

    return (
        <Box flex="1" overflowY="auto" p={1}>
            <Flex py='10px' >
                <Flex py='5px' px='50px' borderRadius={'md'} bgColor={'yellow.300'} mx='auto'>
                    <Text fontSize={"18px"}
                        fontFamily="iransans">لیست فاکتور های </Text>
                    <Text fontSize={"18px"}
                        fontFamily="iransans">{saleList[0]?.ItemTitle}</Text>
                </Flex>
            </Flex>
            <Divider />
            <Flex mt={'10px'} direction="column" gap={4}>
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
                                    <WalletCards color="purple" />
                                    <Flex flex={3} direction={"row"} gap={3}>
                                        <Tooltip label={row?.Number}>
                                            <Flex direction={"row"} gap={2}>
                                                <Text
                                                    fontSize={["16px", "16px", "15px", "12px"]}
                                                    fontFamily="iransans"
                                                >
                                                    فاکتور شماره
                                                </Text>
                                                <Text
                                                    align={"justify"}
                                                    fontSize={["16px", "16px", "15px", "12px"]}
                                                    fontFamily="iransans"
                                                >
                                                    {row?.Number}
                                                </Text>
                                                <Text
                                                    align={"justify"}
                                                    fontSize={["16px", "16px", "15px", "12px"]}
                                                    fontFamily="iransans"
                                                > به نام</Text>
                                                <Text
                                                    align={"justify"}
                                                    fontSize={["16px", "16px", "15px", "12px"]}
                                                    fontFamily="iransans"
                                                >
                                                    {row?.CustomerPartyName?.length > 25
                                                        ? row?.CustomerPartyName?.substring(0, 25) + "..."
                                                        : row?.CustomerPartyName}
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
                                            {dayjs(row?.Date).locale("fa")
                                                .format("YYYY/MM/DD")}
                                        </Text>
                                    </HStack>
                                    <Divider />
                                    <HStack>
                                        <Text> نوع :</Text>
                                        <Text mr="auto">{row?.SaleTypeTitle}</Text>
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
                                        <Text> واحد :</Text>
                                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                                            {row?.UnitTitle}
                                        </Text>
                                    </HStack>
                                    <Divider />
                                    <HStack>
                                        <Text> تعداد :</Text>
                                        <Text fontFamily="IranSans" fontSize="md" mr="auto">
                                            {Number(row?.Quantity).toLocaleString()}
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
                                            {Number(row?.Price[1]).toLocaleString()} {row?.CurrencyTitle}
                                        </Text>
                                    </HStack>

                                </VStack>
                            </CardBody>

                        </Card>
                    ))}
                </SimpleGrid>
            </Flex>
            <Divider mt='10px' />
            <Flex mt='10px' my='10px' >
                <Flex p={'5px'} borderRadius={'md'} bgColor={'yellow.300'} mr='auto'  >
                    <Text fontFamily="IranSans" fontSize="md" mx={'5px'} >تعداد کل ثبت شده در فاکتور ها: </Text>

                    <Text fontFamily="IranSans" fontSiz e="md">{Number(totalCount).toLocaleString()} {saleList[0]?.UnitTitle}</Text>
                </Flex>
            </Flex>
            {loading && <MyLoading />}
        </Box>
    )
}