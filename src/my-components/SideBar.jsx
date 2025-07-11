// components/Sidebar.jsx
import { Accordion, Box, Divider, Heading, Link, Text } from "@chakra-ui/react";
import { SidebarItem } from "./SIdebarItem";
import { PieChart } from "./PieChart";
import {
  ArrowUpFromLine,
  Boxes,
  Coins,
  DecimalsArrowRight,
  FileSpreadsheet,
  House,
  Layers,
  LucideLayers,
  Mails,
  MessageSquare,
  MessageSquareShare,
  Newspaper,
  PackagePlus,
  Paperclip,
  Plus,
  Ruler,
  Send,
  Sheet,
  ShieldCheck,
  ShieldUser,
  ShoppingBag,
  Table,
  UserRoundPlus,
  Users,
  UsersRound,
} from "lucide-react";

export const Sidebar = ({ sidebarWidth, onMenuItemClick }) => {
  return (
    <Box
      w={sidebarWidth}
      bg="gray.800"
      position="relative"
      borderLeft="8px solid gray.100"
    >
      <Box mt={1} bg="#50b742" w="100%" h="40px" borderRadius={2}>
        <Link>
          <Text
            pt={1}
            alignContent={"center"}
            textAlign={"center"}
            fontSize={sidebarWidth === 300 ? "2xl" : "medium"}
            fontFamily={""}
          >
            امکانات
          </Text>
        </Link>
      </Box>
      <Accordion
        spacing={2}
        align="stretch"
        color="gray.100"
        borderColor="gray.700"
        allowToggle={true}
      >
        <SidebarItem
          id={1}
          title="پیش فاکتور"
          icon={<Sheet />}
          color="#ffbc65"
          justIcon={sidebarWidth === 300 ? false : true}
          children={[
            {
              id: "newProforma",
              name: "جدید",
              type: "text",
              icon: <FileSpreadsheet />,
            },
            {
              id: "myProformas",
              name: "پیش فاکتورهای من",
              type: "text",
              icon: <LucideLayers />,
            },
            {
              id: "proformaStat",
              name: "همه پیش فاکتورها",
              type: "text",
              icon: <LucideLayers />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={2}
          title="فاکتور"
          color="#da6284"
          justIcon={sidebarWidth === 300 ? false : true}
          icon={<Paperclip />}
          children={[
            {
              id: "newInvoice",
              name: "جدید",
              type: "text",
              icon: <Newspaper />,
            },
            {
              id: "myInvoices",
              name: "فاکتورهای من",
              type: "text",
              icon: <Newspaper />,
            },
            {
              id: "invoiceStat",
              name: "لیست فاکتورها",
              type: "text",
              icon: <Layers />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={3}
          title="درخواست ها"
          justIcon={sidebarWidth === 300 ? false : true}
          color="yellow.400"
          icon={<ShieldUser />}
          children={[
            {
              id: "acceptRequest",
              name: "درخواست های تایید",
              type: "text",
              icon: <ShieldCheck />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={4}
          title="فروش"
          color="#957871"
          justIcon={sidebarWidth === 300 ? false : true}
          icon={<Coins />}
          children={[
            {
              id: "newSale",
              name: "جدید",
              type: "text",
              icon: <Coins />,
            },
            {
              id: "saleStat",
              name: "لیست فروش",
              type: "text",
              icon: <Table />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={5}
          title="انبار"
          color="orange.400"
          justIcon={sidebarWidth === 300 ? false : true}
          icon={<House />}
          children={[
            {
              id: "newSendDepot",
              name: "جدید",
              type: "text",
              icon: <DecimalsArrowRight />,
            },
            {
              id: "depotStat",
              name: "لیست انبار",
              type: "text",
              icon: <House />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={6}
          title="مشتریان"
          justIcon={sidebarWidth === 300 ? false : true}
          color="red.400"
          icon={<UsersRound />}
          children={[
            {
              id: "newCustomer",
              name: "جدید",
              type: "text",
              icon: <UserRoundPlus />,
            },
            {
              id: "customers",
              name: "لیست مشتریان",
              type: "text",
              icon: <Users />,
            },
            {
              id: "uploadCustomers",
              name: "آپلود دسته ای مشتریان",
              type: "text",
              icon: <ArrowUpFromLine />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={7}
          title="کالاها"
          justIcon={sidebarWidth === 300 ? false : true}
          color="maroon"
          icon={<ShoppingBag />}
          children={[
            {
              id: "newGood",
              name: "جدید",
              type: "text",
              icon: <PackagePlus />,
            },
            {
              id: "goods",
              name: "لیست کالاها",
              type: "text",
              icon: <Boxes />,
            },
            {
              id: "uploadGoods",
              name: "آپلود دسته ای کالا",
              type: "text",
              icon: <ArrowUpFromLine />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={8}
          title="واحدها"
          justIcon={sidebarWidth === 300 ? false : true}
          color="white"
          icon={<Ruler />}
          children={[
            {
              id: "newUnit",
              name: "جدید",
              type: "text",
              icon: <Plus />,
            },
            {
              id: "units",
              name: "لیست واحدها",
              type: "text",
              icon: <Boxes />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />
        <SidebarItem
          id={9}
          title="پیام ها"
          justIcon={sidebarWidth === 300 ? false : true}
          color="#4f7ede"
          icon={<Mails />}
          children={[
            {
              id: "newNotification",
              name: "ارسال پیام",
              type: "text",
              icon: <Send />,
            },
            {
              id: "incomeNotifications",
              name: "پیام های دریافتی",
              type: "text",
              icon: <MessageSquare />,
            },
            {
              id: "outgoNotifications",
              name: "پیام های ارسالی",
              type: "text",
              icon: <MessageSquareShare />,
            },
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
      <PieChart sidebarWidth={sidebarWidth} />
    </Box>
  );
};
