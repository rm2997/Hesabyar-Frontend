import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Menu, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Slider from "react-slick";

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

export const Home = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  return (
    <Box bg="gray.600">
      {/* top menu */}
      {isDesktop ? (
        <Flex
          columnGap={8}
          dir="rtl"
          as="header"
          bg="gray"
          color="white"
          px={4}
          py={3}
          align="center"
          justify="space-between"
          borderWidth="1px"
          borderBottomRadius="20px"
          borderColor="gray.700"
          ml="auto"
          mr="auto"
          w={1000}
          h={70}
        >
          <Link>صفحه اصلی</Link>
          <Link>محصولات</Link>
          <Link>محصولات بازرگانی</Link>
          <Link>کاتالوگ</Link>
          <Link>ارتباط با ما</Link>
          <Link>تماس با ما</Link>

          <Box mt="-15px" w="180px" textAlign="center" h="45px" mr="auto">
            <VStack rowGap={-2}>
              <Heading fontFamily="arial"> OLIFT</Heading>
              <Text fontSize="xs"> بزرگترین وارد کننده قطعات آسانسور</Text>
            </VStack>
          </Box>
          <IconButton
            mr="auto"
            icon={<User2 size={24} />}
            variant="ghost"
            color="white"
            aria-label="ورود به سیستم"
            onClick={() => navigate("/myhome")}
          />
        </Flex>
      ) : (
        <Flex
          as="header"
          bg="gray"
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
            <VStack rowGap={-2}>
              <Heading fontFamily="arial"> OLIFT</Heading>
            </VStack>
          </Flex>
        </Flex>
      )}

      {/* منوی کناری */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="blackAlpha.100" color="white">
          <DrawerCloseButton />
          <DrawerHeader>
            {/* <Box
              bgImg="url(/assets/images/logos/logo1.jpg)"
              boxSize={20}
              bgSize="contain"
              bgRepeat="no-repeat"
              bgPosition="center"
            /> */}
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Link>صفحه اصلی</Link>
              <Link>محصولات</Link>
              <Link>محصولات بازرگانی</Link>
              <Link>کاتالوگ</Link>
              <Link>ارتباط با ما</Link>
              <Link>تماس با ما</Link>
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
    </Box>
  );
};
