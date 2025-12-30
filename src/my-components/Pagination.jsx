import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  IconButton,
  Text,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronFirst, ChevronLast } from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const getPageNumbers = () => {
    const maxVisible = isDesktop ? 10 : 5; // تعداد دکمه‌ها
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // اگه نزدیک انتهای لیست بودیم
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();
  const buttonSize = useBreakpointValue({ base: "xs", md: "sm" }); // تغییر سایز تو موبایل
  return (
    <Flex
      hidden={totalPages < 2}
      direction="row"
      position="sticky"
      zIndex={100}
      bottom={0}
      bgColor="#fbfbfb"
      borderTopColor="gray.100"
      borderTopWidth={1}
      borderTopRadius="md"
      w="full"
      mx="auto"
      textColor="black"
      px={4}
      py={2}
      fontSize="10px"
      columnGap={7}
      justify="space-between"
      dir="ltr"
    >
      <Flex
        hidden={totalPages < 2}
        alignItems="center"
        direction="column"
        rowGap={1}
      >
        <Wrap spacing={1} justify="center">
          <HStack dir="ltr">
            {pages.map((page) => (
              <WrapItem key={page}>
                <Button
                  size={buttonSize}
                  key={page}
                  onClick={() => onPageChange(page)}
                  colorScheme={page === currentPage ? "blue" : "gray"}
                  variant={page === currentPage ? "solid" : "outline"}
                  fontFamily="iransans"
                  fontStyle="normal"
                >
                  {page}
                </Button>
              </WrapItem>
            ))}

            <Divider orientation="vertical" />

            <WrapItem>
              <IconButton
                title="ابتدا"
                size={buttonSize}
                onClick={() => onPageChange(1)}
                isDisabled={currentPage === 1}
                variant="ghost"
                icon={<ChevronFirst />}
                fontFamily="iransans"
                fontStyle="normal"
                colorScheme="blue"
              />
            </WrapItem>
            <WrapItem>
              <IconButton
                title="انتها"
                fontFamily="iransans"
                fontStyle="normal"
                size={buttonSize}
                onClick={() => onPageChange(totalPages)}
                isDisabled={currentPage === totalPages}
                variant="ghost"
                colorScheme="blue"
                icon={<ChevronLast />}
              />
            </WrapItem>
            <Divider orientation="vertical" />

            <WrapItem columnGap={3}>
              <Text fontFamily="iransans">مورد</Text>
              <Text fontFamily="iransans">{12 * totalPages}</Text>
              <Text fontFamily="iransans">از</Text>
              <Text fontFamily="iransans">{12 * currentPage}</Text>
            </WrapItem>
          </HStack>
        </Wrap>
      </Flex>
    </Flex>
  );
};
