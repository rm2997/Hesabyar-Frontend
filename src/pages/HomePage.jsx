// Home.jsx
import { useState, useRef, useEffect } from "react";
import {
  Flex,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Box,
} from "@chakra-ui/react";
import { HeaderBar } from "../my-components/HeaderBar";
import { Sidebar } from "../my-components/SideBar";
import { MainContents } from "../my-components/MainContents";

export const MyHome = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("");
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const sidebarRef = useRef(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isResizingRef.current || !isDesktop) return;
      const touch = e.touches[0];
      const newWidth = window.innerWidth - touch.clientX;
      setSidebarWidth(Math.max(250, Math.min(newWidth, 400)));
    };

    const handleTouchEnd = () => {
      if (!isDesktop) return;
      isResizingRef.current = false;
    };

    if (isDesktop) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDesktop]);

  const startResize = (e) => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  };

  const handleResize = (e) => {
    if (isResizingRef.current) {
      const newWidth = window.innerWidth - e.clientX;
      setSidebarWidth(Math.max(250, Math.min(newWidth, 400)));
    }
  };

  const stopResize = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <Flex h="100vh" direction="column" bg="gray.900" color="white" dir="rtl">
      <HeaderBar
        isDesktop={isDesktop}
        setIsSidebarOpen={setIsSidebarOpen}
        OnItemClick={(e) => setActiveContent(e)}
      />

      <Flex flex={1} position="relative" overflow="hidden">
        {isDesktop ? (
          <Sidebar
            sidebarWidth={sidebarWidth}
            sidebarRef={sidebarRef}
            startResize={startResize}
            isDesktop={isDesktop}
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
                  sidebarRef={sidebarRef}
                  startResize={startResize}
                  isDesktop={isDesktop}
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
