import {
  Box,
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const MotionBox = motion(Box);

export const NotFoundPage = () => {
  return (
    <VStack
      justify="center"
      align="center"
      h="100vh"
      px={6}
      bg={useColorModeValue("gray.100", "gray.900")}
      textAlign="center"
      spacing={6}
    >
      <MotionBox
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image src="/images/404.svg" alt="404 Illustration" maxW="400px" />
      </MotionBox>

      <Heading fontSize="4xl" color={useColorModeValue("teal.600", "teal.300")}>
        صفحه مورد نظر وجود ندارد
      </Heading>

      <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
        آدرس وارد شده وجود ندارد یا حذف شده. لطفاً به صفحه اصلی بازگردید
      </Text>

      <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button as={RouterLink} to="/" colorScheme="teal" size="lg" shadow="lg">
          بازگشت به خانه
        </Button>
      </MotionBox>
    </VStack>
  );
};
