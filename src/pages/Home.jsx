import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Heading,
  Text,
  VStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link,
} from "@chakra-ui/react";
import { Menu, User, User2 } from "lucide-react"; // Lucide icon
import Slider from "react-slick";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// تنظیم آیکون پیش‌فرض مارکر در leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const images = [
  "/assets/images/bg/login.jpg",
  "/asstes/images/bg/forgetPassword.jpg",
  "assets/images/bg/login.jpg",
];

export const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const position = [35.67646, 51.327177];
  return (
    <Box fontFamily="Vaziri">
      {/* نوار بالا */}
      <Flex
        as="header"
        bg="blue.600"
        color="white"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        <Flex>
          <IconButton
            icon={<Menu size={24} />}
            variant="ghost"
            color="white"
            aria-label="باز کردن منو"
            onClick={onOpen}
          />
          <IconButton
            icon={<User2 size={24} />}
            variant="ghost"
            color="white"
            aria-label="ورود به سیستم"
            onClick={() => navigate("/myhome")}
          />
        </Flex>
        <Flex>
          <Heading fontFamily="Vaziri" fontSize="lg">
            حسابیار
          </Heading>
        </Flex>
      </Flex>

      {/* منوی کناری */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="blackAlpha.700" color="white">
          <DrawerCloseButton />
          <DrawerHeader>حسابیار لوگو</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Link href="#">خانه</Link>
              <Link href="#">خدمات</Link>
              <Link href="#">پروژه‌ها</Link>
              <Link href="#">تماس با ما</Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* اسلایدر */}
      <Box maxW="900px" mx="auto" mt={8}>
        <Slider {...sliderSettings}>
          {images.map((img, i) => (
            <Box key={i} h="600px">
              <img
                src={img}
                alt={`slider-${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* بخش تبلیغاتی */}
      <VStack
        bg="#47405D"
        borderTopRadius="lg"
        mt={10}
        color="white"
        spacing={4}
        textAlign="center"
        px={8}
        p={10}
      >
        <Heading fontFamily="Vaziri" fontSize="2xl">
          بهترین خدمات‌ آسانسور در ایران
        </Heading>
        <Text fontSize="md">با ما تماس بگیرید</Text>
        <Text fontWeight="medium">تلفن: 0912000000</Text>
        <Text fontWeight="medium">ایمیل: info@example.com</Text>
      </VStack>

      {/* نقشه */}
      <Box h="550px" w="100%">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>اینجا موقعیت ماست</Popup>
          </Marker>
        </MapContainer>
      </Box>

      <VStack
        bg="#0D0443"
        borderBottomRadius="lg"
        mt={10}
        color="white"
        spacing={4}
        textAlign="center"
        px={4}
        p={10}
      >
        <Heading fontFamily="Vaziri" fontSize="2xl">
          بهترین خدمات‌ آسانسور در ایران
        </Heading>
        <Text fontSize="md">با ما تماس بگیرید</Text>
        <Text fontWeight="medium">تلفن: 0912000000</Text>
        <Text fontWeight="medium">ایمیل: info@example.com</Text>
      </VStack>
    </Box>
  );
};
