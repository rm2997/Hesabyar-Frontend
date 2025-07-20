// Home.jsx
import { useState, useEffect, useContext } from "react";
import {
  Flex,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useToast,
} from "@chakra-ui/react";
import { HeaderBar } from "../my-components/HeaderBar";
import { Sidebar } from "../my-components/SideBar";
import { MainContents } from "../my-components/MainContents";
import { useNotification } from "../contexts/NotificationContext";
import { useLocation } from "../contexts/LocationContext";
import { UpdateUserLocation } from "../api/services/userService";
import { UserContext } from "../contexts/UserContext";

export const MyHome = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("");
  const { notificationCount, loadUnreadeNotif } = useNotification();
  const { location, loadLocation } = useLocation();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const toast = useToast();

  const { user } = useContext(UserContext);

  useEffect(() => {
    loadUnreadeNotif();
    loadLocation().then((res) => {
      let userLocation = "";
      if (res === undefined || res == "") userLocation = "Denied";
      else userLocation = res;
      UpdateUserLocation({ location: userLocation }).then(() => {
        toast({
          title: "توجه",
          description:
            userLocation === "Denied"
              ? "دسترسی به موقعیت مکانی داده نشد"
              : "موقعیت مکانی ثبت شد",
          status: userLocation === "Denied" ? "warning" : "success",
          duration: 3000,
          isClosable: true,
        });
      });
    });
  }, []);

  useEffect(() => {
    loadUnreadeNotif();
  }, [activeContent]);

  return (
    <Flex h="100vh" direction="column" bg="gray.900" color="white" dir="rtl">
      <HeaderBar
        isDesktop={isDesktop}
        setIsSidebarOpen={setIsSidebarOpen}
        setSidebarWidth={(e) => setSidebarWidth(e)}
        sidebarWidth={sidebarWidth}
        OnItemClick={(e) => setActiveContent(e)}
        badgeCount={notificationCount}
        user={user}
      />

      <Flex flex={1} position="relative" overflow="hidden">
        {isDesktop ? (
          <Sidebar
            isDesktop={isDesktop}
            user={user}
            sidebarWidth={sidebarWidth}
            onMenuItemClick={(e) => setActiveContent(e)}
          />
        ) : (
          <Drawer
            closeOnEsc={true}
            closeOnOverlayClick={true}
            isOpen={isSidebarOpen}
            placement="right"
            onClose={() => setIsSidebarOpen(false)}
          >
            <DrawerOverlay />
            <DrawerContent bg="gray.800" color="white">
              <DrawerHeader>
                <DrawerCloseButton />
              </DrawerHeader>
              <DrawerBody bg="gray.800">
                <Sidebar
                  isDesktop={isDesktop}
                  user={user}
                  sidebarWidth={sidebarWidth}
                  onMenuItemClick={(e) => {
                    setActiveContent(e);
                    setIsSidebarOpen(false);
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        <MainContents isDesktop={isDesktop} activeContent={activeContent} />
      </Flex>
    </Flex>
  );
};
