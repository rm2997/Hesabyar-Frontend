import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import {
  Home,
  MapPinCheck,
  MessageSquare,
  Power,
  Settings,
  User,
} from "lucide-react";

export const EasyAccessBar = ({ hidden, onItemClick }) => {
  return (
    <Flex
      hidden={hidden}
      direction="row"
      position="sticky"
      zIndex={100}
      bottom={0}
      height="55px"
      bgColor="white"
      borderTopColor="gray.200"
      borderTopWidth={1}
      borderBottomWidth={1}
      borderBottomRadius="md"
      mx="auto"
      w="full"
      textColor="black"
      dir="ltr"
      px={4}
      py={2}
      fontSize="10px"
      columnGap={7}
      justify="center"
    >
      <Flex alignItems="center" direction="column" rowGap={1}>
        <IconButton
          _hover={{ color: "orange" }}
          variant="ghost"
          icon={<User />}
          onClick={() => onItemClick("َchangeUsers")}
        />

        <Text fontFamily="iransans">کاربران</Text>
      </Flex>
      <Flex alignItems="center" direction="column" rowGap={1}>
        <IconButton
          variant="ghost"
          icon={<Settings />}
          onClick={() => onItemClick("userSettings")}
          _hover={{ color: "orange" }}
        />
        <Text fontFamily="iransans">تنظیمات</Text>
      </Flex>
      <Flex alignItems="center" direction="column" rowGap={1}>
        <IconButton
          variant="ghost"
          icon={<Home />}
          onClick={() => onItemClick("easyAccessPage")}
          _hover={{ color: "orange" }}
        />
        <Text fontFamily="iransans">خانه</Text>
      </Flex>
      <Flex alignItems="center" direction="column" rowGap={1}>
        <IconButton
          variant="ghost"
          icon={<MapPinCheck />}
          onClick={() => onItemClick("saveLocation")}
          _hover={{ color: "orange" }}
        />
        <Text fontFamily="iransans">لوکیشن</Text>
      </Flex>
      <Flex alignItems="center" direction="column" rowGap={1}>
        <IconButton
          variant="ghost"
          icon={<MessageSquare />}
          onClick={() => onItemClick("userUnreadMessages")}
          _hover={{ color: "orange" }}
        />
        <Text fontFamily="iransans">پیام ها</Text>
      </Flex>
    </Flex>
  );
};
