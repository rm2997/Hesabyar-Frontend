import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
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
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" }); // تغییر سایز تو موبایل
  return (
    <Wrap hidden={totalPages < 2} spacing={1} justify="center" mt={4}>
      <WrapItem>
        <Button
          size={buttonSize}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          variant="outline"
          leftIcon={<ArrowForwardIcon />}
        >
          آخر
        </Button>
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
        >
          اول
        </Button>
      </WrapItem>
    </Wrap>
  );
};
