// components/Sidebar.jsx
import { Box, VStack } from "@chakra-ui/react";
import { SidebarItem } from "./SIdebarItem";
import { PieChart } from "./PieChart";

export const Sidebar = ({
  sidebarWidth,
  sidebarRef,
  startResize,
  isDesktop,
}) => {
  return (
    <Box
      ref={sidebarRef}
      w={sidebarWidth}
      bg="gray.800"
      p={4}
      position="relative"
      borderLeft="4px solid gray.700"
    >
      <VStack spacing={4} align="stretch">
        <SidebarItem title="داشبورد" children={["نمای کلی", "آمار"]} />
        <SidebarItem title="مدیریت" children={["کاربران", "نقش‌ها"]} />
        <SidebarItem title="تنظیمات" children={["پروفایل", "امنیت"]} />
      </VStack>

      <Box
        position="absolute"
        top={0}
        left={0}
        h="100%"
        w="4px"
        cursor="col-resize"
        onMouseDown={startResize}
        zIndex={1}
      />

      <Box mt={8}>
        <PieChart />
      </Box>
    </Box>
  );
};
