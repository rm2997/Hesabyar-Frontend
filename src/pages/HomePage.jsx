// Home.jsx
import { useState, useEffect } from "react";
import {
  Flex,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { HeaderBar } from "../my-components/HeaderBar";
import { Sidebar } from "../my-components/SideBar";
import { MainContents } from "../my-components/MainContents";
import { useNotification } from "../contexts/NotificationContext";

export const MyHome = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("");
  const { notificationCount, loadUnreadeNotif } = useNotification();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    loadUnreadeNotif();
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
      />

      <Flex flex={1} position="relative" overflow="hidden">
        {isDesktop ? (
          <Sidebar
            sidebarWidth={sidebarWidth}
            onMenuItemClick={(e) => setActiveContent(e)}
          />
        ) : (
          <Drawer
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
                  sidebarWidth={sidebarWidth}
                  onMenuItemClick={(e) => setActiveContent(e)}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        <MainContents activeContent={activeContent} />
      </Flex>
    </Flex>
  );
};
