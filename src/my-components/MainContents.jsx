// components/MainContent.jsx
import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";

import { NewProforma } from "../pages/proformas/NewProforma";
import { act, useContext, useEffect, useState } from "react";

import { NewInvoice } from "../pages/invoices/NewInvoice";
import { NewNotification } from "../pages/notifications/NewNotification";
import { NewCustomer } from "../pages/customers/NewCustomer";
import { NewGood } from "../pages/goods/NewGood";
import { NewUnit } from "../pages/units/NewUnit";
import { ProformaDataTable } from "./proformas/ProformaDataTable";
import { InvoiceDataTable } from "./invoices/InvoiceDataTable";
import { Users } from "../pages/users/Users";
import { UploadGoods } from "./goods/UploadGoods";
import { GoodsDataTable } from "./goods/GoodsDataTable";
import { CustomerDataTable } from "./customers/CustomerDataTable";
import { UnitsDataTable } from "./units/UnitsDataTable";
import { NotificationSentDataTable } from "./notifications/NotificationSentDataTable";
import { NotificationReceivedDataTable } from "./notifications/NotificationReceivedDataTable";
import { UploadCustomers } from "./customers/UploadCustomers";
import { Logout } from "./Logout";
import { ChangePasswordByUser } from "./users/ChangePasswordByUser";
import { UserContext } from "../contexts/UserContext";
import { MyModal } from "./MyModal";
import { clearTokens } from "../api/tokenUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { Requests } from "../pages/requests/Requests";
import { NewDepotEntry } from "../pages/depot/NewDepotEntry";
import { DepotEntryList } from "./depot/DepotEntryList";
import { NewDepotExit } from "../pages/depot/NewDepotExit";
import { DepotExitList } from "./depot/DepotExitList";
import { WareHouseRequests } from "../pages/requests/WareHouseRequests";
import { EasyAccessPage } from "./EasyAccess/EasyAccessPage";
import { useUserLocation } from "../contexts/LocationContext";
import { MapPin } from "lucide-react";
import { UpdateUserLocation } from "../api/services/userService";

const validContents = [
  { name: "newProforma", value: "پیش فاکتور جدید" },
  { name: "myProformas", value: " پیش فاکتور های من" },
  { name: "allProformas", value: "همه پیش فاکتور ها" },
  { name: "newInvoice", value: "فاکتور جدید" },
  { name: "myInvoices", value: "فاکتور های من" },
  { name: "allInvoices", value: "همه  فاکتور ها" },
  { name: "newSale", value: "فروش جدید" },
  { name: "saleStat", value: "لیست فروش" },
  { name: "newDepotEntery", value: "ورود کالای جدید" },
  { name: "depotEntryList", value: "سوابق ثبت ورودی " },
  { name: "newDepotExit", value: "ثبت خروج کالا" },
  { name: "depotExitList", value: "سوابق ثبت خروج " },
  { name: "wareHouseRequests", value: "درخواست های انبار " },
  { name: "depotStat", value: "لیست انبار" },
  { name: "user", value: "کاربران" },
  { name: "newCustomer", value: "ثبت مشتری جدید" },
  { name: "customers", value: "لیست مشتریان" },
  { name: "uploadCustomers", value: "آپلود دسته ای مشتریان" },
  { name: "newGood", value: "ثبت کالای جدید" },
  { name: "goods", value: "لیست کالاها" },
  { name: "uploadGoods", value: "آپلود دسته ای کالاها" },
  { name: "newUnit", value: "ثبت واحد جدید" },
  { name: "units", value: "لیست واحدها" },
  { name: "newNotification", value: "ارسال پیام " },
  { name: "incomeNotifications", value: "پیام های دریافتی" },
  { name: "outgoNotifications", value: "پیام های ارسالی" },
  { name: "userSettings", value: "تنظیمات کاربر" },
  { name: "userUnreadMessages", value: "پیام های خوانده نشده" },
  { name: "َchangeUsers", value: "کاربران" },
  { name: "acceptRequest", value: "درخواست های تایید" },
  { name: "logout", value: "خروج" },
  { name: "َchangePassword", value: "تغییر رمز عبور" },
  { name: "easyAccessPage", value: "دسترسی سریع" },
  { name: "saveLocation", value: "" },
];

export const MainContents = ({ onItemClick, activeContent, isDesktop }) => {
  const [pageTitle, setPageTitle] = useState("");
  const [shouldRender, setShouldRender] = useState(null);

  const [sessionExpired, setSessionExpired] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();
  const pageLocation = useLocation();
  const { location, loadLocation } = useUserLocation();

  // useEffect(() => {
  //   // const path = pageLocation.pathname.replace("/", "") || "home";
  //   // setCurrentPageLocation(path);
  //   console.log(pageLocation);
  // }, [pageLocation]);

  useEffect(() => {
    navigate("/myhome/" + activeContent);
  }, [activeContent]);

  useEffect(() => {
    const findActiveContent = (item) => {
      if (!item || item === "") return;
      const valid = validContents.find((i) => i.name === item);
      if (!valid || valid.name === "") return;
      setPageTitle(valid.value);
      const element = SetActiveElement(valid.name);
      setShouldRender(element);
    };

    const saveLocation = async () => {
      await loadLocation();
      const response = await UpdateUserLocation({
        location: location.googleMapLink,
      });
      if (!response.success) {
        return;
      }
      toast({
        title: "توجه",
        description:
          location.googleMapLink == "Denied"
            ? "دسترسی به موقعیت مکانی داده نشد"
            : "آخرین موقعیت مکانی ثبت شد",
        status: location.googleMapLink == "Denied" ? "warning" : "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
        variant: "subtle",
        colorScheme: "blue",
        icon: <MapPin />,
      });
    };

    const SetActiveElement = (index) => {
      switch (index) {
        case "newProforma":
          return <NewProforma isDesktop={isDesktop} />;
        case "myProformas":
          return <ProformaDataTable listAll={false} isDesktop={isDesktop} />;
        case "allProformas":
          return <ProformaDataTable listAll={true} isDesktop={isDesktop} />;
        case "newInvoice":
          return <NewInvoice isDesktop={isDesktop} />;
        case "allInvoices":
          return <InvoiceDataTable listAll={true} isDesktop={isDesktop} />;
        case "myInvoices":
          return <InvoiceDataTable listAll={false} isDesktop={isDesktop} />;
        case "newDepotEntery":
          return <NewDepotEntry isDesktop={isDesktop} />;
        case "depotEntryList":
          return <DepotEntryList isDesktop={isDesktop} />;
        case "newDepotExit":
          return <NewDepotExit isDesktop={isDesktop} />;
        case "depotExitList":
          return <DepotExitList isDesktop={isDesktop} />;
        case "wareHouseRequests":
          return <WareHouseRequests isDesktop={isDesktop} />;
        case "saleStat":
          return <>Hi4</>;
        case "user":
          return <>User</>;
        case "incomeNotifications":
        case "userUnreadMessages":
          return <NotificationReceivedDataTable isDesktop={isDesktop} />;
        case "outgoNotifications":
          return <NotificationSentDataTable isDesktop={isDesktop} />;
        case "newNotification":
          return <NewNotification isDesktop={isDesktop} user={user} />;
        case "newCustomer":
          return <NewCustomer isDesktop={isDesktop} />;
        case "customers":
          return <CustomerDataTable isDesktop={isDesktop} />;
        case "uploadCustomers":
          return <UploadCustomers isDesktop={isDesktop} />;
        case "newGood":
          return <NewGood isDesktop={isDesktop} />;
        case "goods":
          return <GoodsDataTable isDesktop={isDesktop} />;
        case "uploadGoods":
          return <UploadGoods isDesktop={isDesktop} />;
        case "newUnit":
          return <NewUnit isDesktop={isDesktop} />;
        case "units":
          return <UnitsDataTable isDesktop={isDesktop} />;
        case "َchangeUsers":
          return <Users isDesktop={isDesktop} user={user} />;
        case "َchangePassword":
          return <ChangePasswordByUser isDesktop={isDesktop} />;
        case "acceptRequest":
          return <Requests isDesktop={isDesktop} />;
        case "easyAccessPage":
          return (
            <EasyAccessPage isDesktop={isDesktop} onItemClick={onItemClick} />
          );
        case "saveLocation":
          saveLocation();
          return (
            <EasyAccessPage isDesktop={isDesktop} onItemClick={onItemClick} />
          );
        case "logout":
          return <Logout />;
        default:
          break;
      }
    };

    const checkUserExp = () => {
      if (!user) return;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (user.exp < currentTimestamp) setSessionExpired(true);
    };

    const path = pageLocation.pathname.split("/")[2];
    if (path != activeContent) onItemClick(path);
    checkUserExp();
    findActiveContent(activeContent);
  }, [pageLocation]);

  if (sessionExpired) {
    return (
      <MyModal
        isOpen={sessionExpired}
        modalHeader="خطای دسترسی"
        size={isDesktop ? "2xl" : "xs"}
      >
        <Flex direction="column" rowGap={isDesktop ? 16 : 8}>
          <Heading
            mx="auto"
            mt={isDesktop ? 10 : 1}
            size={isDesktop ? "md" : "xs"}
            fontStyle="normal"
            fontFamily="IranSans"
          >
            نشست شما منقضی شده است، لطفا مجددا وارد سیستم شوید.
          </Heading>
          <Button
            colorScheme="red"
            onClick={() => {
              clearTokens();
              setUser(null);
              navigate("/login");
            }}
          >
            خروج
          </Button>
        </Flex>
      </MyModal>
    );
  }

  return (
    <Flex w="98%" mx={1} bg="#efefef" direction="column">
      <Box
        borderColor="gray.500"
        borderTopWidth={1}
        borderBottomWidth={1}
        boxShadow="rgba(0, 0, 0, 0.5) 1px 1px 1px 1px"
        alignItems="center"
        alignContent="center"
        bg="#373c50"
        color="white"
        px={1}
      >
        <Text h="38px" fontFamily="Yekan" mx={3} fontSize={"lg"}>
          {pageTitle}
        </Text>
      </Box>

      <Box display="flex" flexDirection="column" overflowY="auto">
        <Box overflowY="auto">{shouldRender}</Box>
      </Box>
    </Flex>
  );
};
