// components/HeaderBar.jsx
import {
  Flex,
  IconButton,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { Bell, SquareEqual, User2 } from "lucide-react";
import { useState } from "react";

export const HeaderBar = ({ isDesktop, setIsSidebarOpen }) => {
  const [badgeCount, setBadgeCount] = useState(1);

  return (
    <Flex
      align="center"
      justify="space-between"
      p={4}
      bg="gray.800"
      borderBottom="1px"
      borderColor="gray.700"
    >
      <Text fontSize="xl" fontWeight="bold">
        لوگو
      </Text>

      {!isDesktop && (
        <Tooltip label="باز کردن منو" hasArrow>
          <IconButton
            icon={<SquareEqual />}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Toggle Sidebar"
          />
        </Tooltip>
      )}

      <Flex gap={4} align="center">
        <Box position="relative">
          <IconButton
            icon={<Bell />}
            size="sm"
            cursor="pointer"
            aria-label="Notifications"
            variant=""
          />
          <Badge
            colorScheme="red"
            borderRadius="full"
            position="absolute"
            top="-1"
            right="-1"
          >
            {badgeCount}
          </Badge>
        </Box>

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<User2 />}
            size="sm"
            cursor="pointer"
            variant=""
          />
          <MenuList color="black">
            <MenuItem>تنظیمات</MenuItem>
            <MenuItem>پیام‌های مشاهده‌نشده</MenuItem>
            <MenuItem>خروج</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
