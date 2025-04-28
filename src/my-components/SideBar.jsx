// components/Sidebar.jsx
import { Accordion, Box, Divider } from "@chakra-ui/react";
import { SidebarItem } from "./SIdebarItem";
import { PieChart } from "./PieChart";

export const Sidebar = ({
  sidebarWidth,
  sidebarRef,
  startResize,
  isDesktop,
  onMenuItemClick,
}) => {
  return (
    <Box
      ref={sidebarRef}
      w={sidebarWidth}
      bg="gray.800"
      p={4}
      position="relative"
      borderLeft="8px solid gray.100"
    >
      <Accordion
        onMouseDown={startResize}
        spacing={2}
        align="stretch"
        color="gray.100"
        borderColor="gray.700"
      >
        <SidebarItem
          id={1}
          title="پیش فاکتور"
          children={[
            { id: "newProforma", name: "جدید", type: "text" },
            { id: "proformaStat", name: "لیست پیش فاکتورها", type: "text" },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={2}
          title="فاکتور"
          children={[
            { id: "newInvoice", name: "جدید", type: "text" },
            { id: "invoiceStat", name: "لیست فاکتورها", type: "text" },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={3}
          title="فروش"
          children={[
            { id: "newSale", name: "جدید", type: "text" },
            { id: "saleStat", name: "لیست فروش", type: "text" },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={4}
          title="انبار"
          children={[
            { id: "newSendDepot", name: "جدید", type: "text" },
            { id: "depotStat", name: "لیست انبار", type: "text" },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={5}
          title="پیام ها"
          children={[
            { id: "newNotification", name: "جدید", type: "text" },
            { id: "notifications", name: "لیست پیام ها", type: "text" },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        {/* <SidebarItem
          id={6}
          title="نمودار وضعیت"
          children={[
            {
              id: "PieChart",
              name: "نمودار",
              type: "object",
              element: <PieChart />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        /> */}
      </Accordion>
      <Divider mt={5} />
      <PieChart />
      {isDesktop ? (
        <Box
          position="absolute"
          top={0}
          left={0}
          h="100%"
          w="8px"
          cursor="col-resize"
          onMouseDown={startResize}
          zIndex={1}
          borderRightWidth="1px"
          borderColor="gray.700"
        />
      ) : (
        <></>
      )}
    </Box>
  );
};
