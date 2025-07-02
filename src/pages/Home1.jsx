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
  SimpleGrid,
  Image,
  Divider,
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
  "/assets/images/slider/datis.jpg",
  "/assets/images/slider/motor1.jpg",
  "/assets/images/slider/motor2.jpg",
];

export const Home1 = () => {
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
        bg="black"
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
        <Flex
          direction="row"
          alignContent="center"
          alignItems="center"
          columnGap={5}
        >
          <Heading fontFamily="Vaziri" fontSize="lg">
            حسابیار علیایی
          </Heading>
          <Box
            bgImg="url(/assets/images/logos/logoMedium.jpg)"
            boxSize={70}
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="center"
          />
        </Flex>
      </Flex>

      {/* منوی کناری */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="blackAlpha.500" color="white">
          <DrawerCloseButton />
          <DrawerHeader>
            <Box
              bgImg="url(/assets/images/logos/logo1.jpg)"
              boxSize={20}
              bgSize="contain"
              bgRepeat="no-repeat"
              bgPosition="center"
            />
          </DrawerHeader>
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
      <Box maxW="900px" mx="auto" mb={8} mt={8}>
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
        mb={1}
        mt={1}
        bg="blackAlpha.800"
        color="white"
        bgImage="url(/assets/images/bg/world.png)"
        bgSize="auto"
        bgRepeat="no-repeat"
        bgPosition="left"
      >
        <Box bg="blackAlpha.500" width="full">
          <SimpleGrid
            spacing={50}
            color="white"
            p={10}
            columns={{ base: 1, md: 2, lg: 3 }}
          >
            <VStack textAlign="right" alignItems="end">
              <Box boxSize={200} mr="auto" ml="auto" bg="blue.600" p={1}>
                <Image
                  objectFit="cover"
                  target="_blank"
                  rel="noopener noreferrer"
                  src="/assets/images/slider/motor2.jpg"
                ></Image>
              </Box>
              <Text fontWeight="medium">
                موتور خفن با پایه های چرخنده زرد رنگ انقلابی در موتور های
                آسانسور به پا کرد
              </Text>
            </VStack>

            <VStack textAlign="right" alignItems="end">
              <Box boxSize={200} mr="auto" ml="auto" bg="blue.600" p={1}>
                <Image
                  objectFit="cover"
                  target="_blank"
                  rel="noopener noreferrer"
                  src="/assets/images/slider/motor1.jpg"
                ></Image>
              </Box>
              <Text fontWeight="medium">
                موتور خفن با پایه های چرخنده نارنجی رنگ انقلابی در موتور های
                آسانسور به پا کرد که نمونه اش در دنیا وجود ندارد
              </Text>
            </VStack>

            <VStack textAlign="right" alignItems="end">
              <Box boxSize={200} mr="auto" ml="auto" bg="blue.600" p={1}>
                <Image
                  objectFit="cover"
                  target="_blank"
                  rel="noopener noreferrer"
                  src="/assets/images/slider/datis.jpg"
                ></Image>
              </Box>
              <Text fontWeight="medium">
                {" "}
                تابلو برق داتیس رو نگم براتون که هوا رو چرخ میکنه و برق میگیره
                این تابلو برق بدون نیاز به دست آسانسور رو بالا و پایین میکند
              </Text>
            </VStack>
          </SimpleGrid>

          <Box width="full" color="whiteAlpha.700" textAlign="center">
            <Divider color="white" />
          </Box>
        </Box>
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

      {/* فوتر  پایین صفحه */}
      <VStack
        mt={1}
        bg="blackAlpha.800"
        color="white"
        bgImage="url(/assets/images/bg/world.png)"
        bgSize="auto"
        bgRepeat="no-repeat"
        bgPosition="left"
      >
        <Box bg="blackAlpha.500" width="full">
          <SimpleGrid
            spacing={50}
            color="white"
            p={10}
            columns={{ base: 1, md: 2, lg: 4 }}
          >
            <VStack
              textAlign="right"
              alignItems="end"
              backdropFilter="opacity(50%)"
            >
              <Heading fontFamily="Vaziri" fontSize="2xl" mb={5}>
                سایر لینک ها
              </Heading>
              <Text fontWeight="medium">کاتالوگ آسانسور</Text>
              <Text fontWeight="medium">کاتالوگ رزومه</Text>
              <Text fontWeight="medium">کاتالوگ قطعات</Text>
              <Text fontWeight="medium">فرصت های شغلی</Text>
            </VStack>

            <VStack textAlign="right" alignItems="end">
              <Heading fontFamily="Vaziri" fontSize="2xl" mb={5}>
                لینک های مفید
              </Heading>
              <Text fontWeight="medium">نمونه کار</Text>
              <Text fontWeight="medium">تماس با ما</Text>
              <Text fontWeight="medium">درباره ما</Text>
              <Text fontWeight="medium">فروش آسانسور</Text>
              <Text fontWeight="medium">قیمت ها</Text>
            </VStack>

            <VStack textAlign="right" alignItems="end">
              <Heading fontFamily="Vaziri" fontSize="2xl" mb={5}>
                راه های ارتباطی
              </Heading>
              <Text fontWeight="medium">
                ‌info@hesab-yaar.ir : پست الکترونیک
              </Text>
              <Text fontWeight="medium">‌09121234567 : مدیریت</Text>
              <Text fontWeight="medium">‌09121234567 : مدیر فروش</Text>
              <Text fontWeight="medium">‌09121234567 : حسابداری</Text>
            </VStack>

            <VStack textAlign="right" alignItems="end">
              <Box
                bg="orange"
                boxSize={100}
                maxH={10}
                mb={8}
                mr="auto"
                ml="auto"
              >
                <Image
                  src="/assets/images/logos/logoMedium.jpg"
                  objectFit="cover"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </Box>
              <Text fontWeight="medium" textAlign="right">
                شرکت آسانسور علیایی با بیش از دو دهه تجربه در صنعت آسانسور ایران
                جزو بهترین شرکت‌های آسانسور در ایران بوده و همراه تلاش ما برای
                ارائه بهترین خدمات به شما مشتریان گرامی می‌باشد
              </Text>
            </VStack>
          </SimpleGrid>

          <Box width="full" color="whiteAlpha.700" textAlign="center">
            <Divider color="white" />
            <Heading fontFamily="Vaziri" fontSize="2xs" m={2}>
              Designed & developed by R.Mirasgari 09125213288
            </Heading>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
