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
  HStack,
} from "@chakra-ui/react";
import { Bell, MenuIcon, SquareEqual, User2 } from "lucide-react";

export const HeaderBar = ({
  isDesktop,
  setIsSidebarOpen,
  setSidebarWidth,
  sidebarWidth,
  OnItemClick,
  badgeCount,
}) => {
  const handleSideBarWith = () => {
    if (sidebarWidth === 300) setSidebarWidth(100);
    else setSidebarWidth(300);
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      p={4}
      bg="gray.800"
      borderBottom="1px"
      borderColor="gray.700"
    >
      <HStack spacing={sidebarWidth === 300 ? 190 : 50}>
        <Text fontSize="xl" fontWeight="bold">
          لوگو
        </Text>
        {isDesktop && (
          <IconButton
            color="white"
            bg="gray.600"
            variant="ghost"
            colorScheme="whiteAlpha"
            icon={<MenuIcon />}
            onClick={handleSideBarWith}
          />
        )}
      </HStack>
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
            id="notifications"
            icon={<Bell />}
            size="sm"
            cursor="pointer"
            aria-label="Notifications"
            variant=""
            onClick={(e) => OnItemClick(e.target.parentNode.id)}
          />
          <Badge
            colorScheme="red"
            borderRadius="full"
            position="absolute"
            top="-1"
            right="-1"
          >
            {badgeCount > 0 ? badgeCount : ""}
          </Badge>
        </Box>

        <Menu>
          <MenuButton
            as={IconButton}
            id="user"
            icon={<User2 />}
            size="sm"
            cursor="pointer"
            variant=""
          />
          <MenuList color="black">
            <MenuItem onClick={() => OnItemClick("userSettings")}>
              تنظیمات
            </MenuItem>
            <MenuItem onClick={() => OnItemClick("userUnreadMessages")}>
              پیام‌های مشاهده‌نشده
            </MenuItem>
            <MenuItem onClick={() => OnItemClick("logout")}>خروج</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
