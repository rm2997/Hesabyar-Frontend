// components/Sidebar.jsx
import {
  Accordion,
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { SidebarItem } from "./SIdebarItem";
import { PieChart } from "./PieChart";
import {
  ArrowUpFromLine,
  Blocks,
  Boxes,
  Coins,
  Combine,
  DecimalsArrowLeft,
  DecimalsArrowRight,
  FileSpreadsheet,
  GalleryHorizontalEnd,
  House,
  Layers,
  ListChecks,
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
  SquareLibrary,
  SquareStack,
  Table,
  UserRoundPlus,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GetUserByUserid } from "../api/services/userService";

import { MyModal } from "./MyModal";
import { ChangePasswordByUser } from "./users/ChangePasswordByUser";

export const Sidebar = ({ isDesktop, user, sidebarWidth, onMenuItemClick }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const res = await GetUserByUserid(user?.sub);
      if (res?.success) {
        setUserName(res?.data?.userfname + " " + res?.data?.userlname);
      } else setUserName("نا مشخص");
    };
    loadData();
  }, []);

  return (
    <Box
      w={sidebarWidth}
      bg="gray.800"
      position="relative"
      borderLeft="8px solid gray.100"
      borderTopColor="gray.300"
      borderTopWidth={1}
    >
      <Box
        bg="#50b742"
        w="100%"
        h="40px"
        borderRadius={2}
        alignContent="center"
      >
        <Flex
          direction="row"
          p={1}
          textAlign="center"
          alignItems="center"
          gap={isDesktop ? 5 : 1}
        >
          <Tooltip label={user?.role}>
            <Box mx={sidebarWidth !== 300 ? "auto" : ""}>
              {user?.role == "admin" ? (
                <ShieldUser color="lightYellow" />
              ) : (
                <Users color="black" />
              )}
            </Box>
          </Tooltip>
          <Heading
            hidden={sidebarWidth !== 300}
            fontSize={sidebarWidth === 300 ? "lg" : "sm"}
            fontFamily="iransans"
          >
            {userName}
          </Heading>
        </Flex>
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
            user?.role == "admin"
              ? {
                  id: "allProformas",
                  name: "همه پیش فاکتورها",
                  type: "text",
                  icon: <LucideLayers />,
                }
              : "",
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
            user?.role == "admin"
              ? {
                  id: "allInvoices",
                  name: "همه  فاکتورها",
                  type: "text",
                  icon: <Layers />,
                }
              : "",
          ]}
          onMenuItemClick={onMenuItemClick}
        />

        {/* <SidebarItem
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
        /> */}

        <SidebarItem
          id={5}
          title="انبار"
          color="orange.400"
          justIcon={sidebarWidth === 300 ? false : true}
          icon={<Warehouse />}
          children={[
            {
              id: "newDepotEntery",
              name: "ورود کالا",
              type: "text",
              icon: <DecimalsArrowLeft />,
            },
            {
              id: "depotEntryList",
              name: "سوابق ورود کالا ",
              type: "text",
              icon: <SquareStack />,
            },
            {
              id: "newDepotExit",
              name: "خروج کالا",
              type: "text",
              icon: <Combine />,
            },
            {
              id: "depotExitList",
              name: "سوابق خروج کالا ",
              type: "text",
              icon: <GalleryHorizontalEnd />,
            },
            {
              id: "wareHouseRequests",
              name: "درخواست های انبار",
              type: "text",
              icon: <ListChecks />,
            },
          ]}
          onMenuItemClick={onMenuItemClick}
        />

        {user?.role == "admin" && (
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
        )}
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
          icon={<Blocks />}
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
              icon: <SquareLibrary />,
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
      <PieChart sidebarWidth={sidebarWidth} User={user} />
    </Box>
  );
};
