// components/MainContent.jsx
import { Box, Text } from "@chakra-ui/react";

export const MainContents = () => {
  return (
    <Box p={6} bg="gray.900" flex={1} overflowY="auto">
      <Text fontSize="xl">محتوای اصلی</Text>
      {/* اینجا محتوای داینامیک مربوط به هر منو می‌تونه قرار بگیره */}
    </Box>
  );
};
