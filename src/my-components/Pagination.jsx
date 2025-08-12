import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from "@chakra-ui/react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const maxVisible = 10; // تعداد دکمه‌ها
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
      justify="left"
    >
      <Flex
        hidden={totalPages < 2}
        alignItems="center"
        direction="column"
        rowGap={1}
      >
        <Wrap spacing={1} justify="center">
          <WrapItem>
            <Button
              fontFamily="iransans"
              fontStyle="normal"
              size={buttonSize}
              onClick={() => onPageChange(totalPages)}
              isDisabled={currentPage === totalPages}
              variant="outline"
              leftIcon={<ArrowForwardIcon />}
            ></Button>
          </WrapItem>

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
          </HStack>
          <WrapItem>
            <Button
              size={buttonSize}
              onClick={() => onPageChange(1)}
              isDisabled={currentPage === 1}
              variant="outline"
              leftIcon={<ArrowBackIcon />}
              fontFamily="iransans"
              fontStyle="normal"
            ></Button>
          </WrapItem>
        </Wrap>
      </Flex>
    </Flex>
  );
};
