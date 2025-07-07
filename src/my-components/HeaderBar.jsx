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
  Image,
  Button,
} from "@chakra-ui/react";
import {
  Bell,
  Mails,
  MenuIcon,
  PencilLine,
  Power,
  Settings,
  ShieldUser,
  SquareEqual,
  User2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeaderBar = ({
  isDesktop,
  setIsSidebarOpen,
  setSidebarWidth,
  sidebarWidth,
  OnItemClick,
  badgeCount,
  user,
}) => {
  const navigate = useNavigate();

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
      <HStack spacing={sidebarWidth === 300 ? 10 : 5}>
        <HStack>
          <Box
            boxSize={20}
            maxH={5}
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="center"
          >
            <Image
              src="/assets/images/logos/logo1.jpg"
              objectFit="cover"
              target="_blank"
              rel="noopener noreferrer"
            />
          </Box>
          <Button variant="link" onClick={() => navigate("/home")}>
            <Text fontSize="md" fontWeight="bold">
              {sidebarWidth === 300 ? "گروه صنعتی علیایی" : ""}
            </Text>
          </Button>
        </HStack>
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
            onClick={(e) => OnItemClick("userUnreadMessages")}
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
            <MenuItem color="orange.400" isDisabled={true}>
              <HStack spacing={3}>
                {user?.role == "admin" && <ShieldUser color="green" />}
                {user?.role != "admin" && <Users color="black" />}
                <Text color="black">{user?.username}</Text>
              </HStack>
            </MenuItem>

            <Divider />

            {user?.role == "admin" && (
              <MenuItem
                color="orange.400"
                onClick={() => OnItemClick("َchangeUsers")}
              >
                <HStack spacing={3}>
                  <Users />
                  <Text color="black">کاربران</Text>
                </HStack>
              </MenuItem>
            )}

            {user?.role != "admin" && (
              <MenuItem
                color="orange.400"
                onClick={() => OnItemClick("َchangePassword")}
              >
                <HStack spacing={3}>
                  <PencilLine />
                  <Text color="black">تغییر رمز</Text>
                </HStack>
              </MenuItem>
            )}

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
                <Power />
                <Text color="black"> خروج</Text>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
