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
  Divider,
} from "@chakra-ui/react";
import {
  Bell,
  Mails,
  MenuIcon,
  Settings,
  SquareEqual,
  User2,
  Users,
} from "lucide-react";

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
            _hover={{ color: "orange" }}
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
            _hover={{ color: "orange" }}
            as={IconButton}
            id="user"
            icon={<User2 />}
            size="sm"
            cursor="pointer"
            variant=""
          />
          <MenuList color="black">
            <MenuItem
              color="orange.400"
              onClick={() => OnItemClick("َchangeUsers")}
            >
              <HStack spacing={3}>
                <Users />
                <Text color="black">کاربران</Text>
              </HStack>
            </MenuItem>

            <Divider />

            <MenuItem
              color="blue.400"
              onClick={() => OnItemClick("userSettings")}
            >
              <HStack spacing={3}>
                <Settings />
                <Text color="black">تنظیمات</Text>
              </HStack>
            </MenuItem>

            <MenuItem
              color="green.400"
              onClick={() => OnItemClick("userUnreadMessages")}
            >
              <HStack spacing={3}>
                <Mails />
                <Text color="black"> پیام‌های مشاهده‌ نشده</Text>
              </HStack>
            </MenuItem>
            <Divider />
            <MenuItem color="red.500" onClick={() => OnItemClick("logout")}>
              <HStack spacing={3}>
                <Mails />
                <Text color="black"> خروج</Text>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
