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
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import {
  Bell,
  Blocks,
  ChevronDown,
  MapPinCheck,
  MenuIcon,
  PencilLine,
  Power,
  Ruler,
  Settings,
  ShieldUser,
  SquareEqual,
  UserRoundCog,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyModal } from "./MyModal";
import { GoodsDataTable } from "./goods/GoodsDataTable";
import { UnitsDataTable } from "./units/UnitsDataTable";
import { CustomerDataTable } from "./customers/CustomerDataTable";

export const HeaderBar = ({
  setIsSidebarOpen,
  setSidebarWidth,
  sidebarWidth,
  OnItemClick,
  badgeCount,
  user,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState({
    item: null,
    persianHeader: "",
  });
  const navigate = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, md: true });
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
      boxShadow="rgba(0, 0, 0, 0.5) 1px 1px 1px 1px"
    >
      <HStack spacing={sidebarWidth === 300 ? 3 : 1}>
        <HStack>
          <Box
            mx={1}
            borderRadius="10%"
            _hover={{
              cursor: "pointer",
            }}
            boxShadow="0 0 25px orange"
            boxSize={20}
            maxH={5}
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="center"
            onClick={() => navigate("/home")}
          >
            <Image
              borderRadius="10%"
              src="/assets/images/logos/logo1.jpg"
              objectFit="cover"
              target="_blank"
              rel="noopener noreferrer"
            />
          </Box>
          <Button
            display={sidebarWidth === 300 ? "inline" : "none"}
            variant="link"
            onClick={() => navigate("/home")}
          >
            <Text
              fontFamily="IranSans"
              fontSize={isDesktop ? "lg" : "sm"}
              fontWeight="bold"
            >
              آسانسورلند
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

      <Flex align="center">
        <Box hidden={!isDesktop}>
          <IconButton
            variant=""
            icon={<Blocks />}
            onClick={() => {
              setShowModal(true);
              setModalItem({
                item: <GoodsDataTable />,
                persianHeader: "کالاها",
              });
            }}
            title="کالاها"
            _hover={{ color: "orange" }}
          />
        </Box>
        <Box hidden={!isDesktop}>
          <IconButton
            variant=""
            icon={<Ruler />}
            title="واحدها"
            onClick={() => {
              setShowModal(true);
              setModalItem({
                item: <UnitsDataTable />,
                persianHeader: "واحدها",
              });
            }}
            _hover={{ color: "orange" }}
          />
        </Box>
        <Box hidden={!isDesktop}>
          <IconButton
            variant=""
            icon={<Users />}
            title="مشتریان"
            onClick={() => {
              setShowModal(true);
              setModalItem({
                item: <CustomerDataTable />,
                persianHeader: "مشتریان",
              });
            }}
            _hover={{ color: "orange" }}
          />
        </Box>
        <Center height="30px">
          <Divider orientation="vertical" />
        </Center>
        <Box hidden={!isDesktop}>
          <IconButton
            variant=""
            icon={<Zap />}
            title="دسترسی سریع"
            onClick={() => OnItemClick("easyAccessPage")}
            _hover={{ color: "orange" }}
          />
        </Box>
        <Box position="relative">
          <IconButton
            _hover={{ color: "orange" }}
            id="notifications"
            icon={<Bell />}
            title="پیام های خوانده نشده"
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
            icon={
              <Flex direction={"row"}>
                <UserRoundCog />
                <ChevronDown
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "-8px",
                    width: "15px",
                  }}
                />
              </Flex>
            }
            size="sm"
            cursor="pointer"
            variant=""
          />
          <MenuList color="black">
            <MenuItem
              color="orange.400"
              isDisabled
              bg="green.400"
              borderBottomWidth={1}
              borderBottomColor={"blackAlpha.400"}
            >
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
              onClick={() => OnItemClick("saveLocation")}
            >
              <HStack spacing={3}>
                <MapPinCheck color="indigo" />
                <Text color="black">ثبت لوکیشن</Text>
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
        <MyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          modalHeader={modalItem.persianHeader}
        >
          {modalItem.item}
        </MyModal>
      </Flex>
    </Flex>
  );
};
