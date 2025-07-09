import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Image,
  Img,
  Link,
  LinkBox,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Menu, Phone, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  "/assets/images/slider/cabin1.jpg",
  "/assets/images/slider/door1.jpg",
  "/assets/images/slider/door2.jpg",
  "/assets/images/slider/motor3.jpg",
  "/assets/images/slider/wheel1.jpg",
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
  const position = [35.67646, 51.327177];

  return (
    <Box bg="#2E2E2E">
      {/* top menu */}
      <Flex
        dir="rtl"
        as="header"
        bg="#585858"
        color="white"
        px={4}
        py={3}
        align="center"
        borderWidth="1px"
        borderBottomRadius="20px"
        borderColor="gray.700"
        ml="auto"
        mr="auto"
        w={isDesktop ? 1000 : "full"}
        h={{ base: "55px", md: "70px", sm: "100" }}
        position="sticky"
        top="0px"
        zIndex={1}
      >
        {isDesktop ? (
          <Flex gap={5}>
            <Link>صفحه اصلی</Link>
            <Link>محصولات</Link>
            <Link>محصولات بازرگانی</Link>
            <Link>کاتالوگ</Link>
            <Link>ارتباط با ما</Link>
            <Link>تماس با ما</Link>
          </Flex>
        ) : (
          <Flex>
            <IconButton
              icon={<Menu size={24} />}
              variant="ghost"
              color="white"
              aria-label="باز کردن منو"
              onClick={onOpen}
            />
          </Flex>
        )}

        <Flex alignItems="center" direction="column" mr="auto" ml={2}>
          <Heading
            mt={1}
            size="md"
            fontFamily="EnglishHeader"
            color="whiteAlpha.900"
          >
            OLIAEI GROUP
          </Heading>
          <Text fontSize="md" fontFamily="Aseman" mb="5px">
            بزرگترین وارد کننده قطعات آسانسور
          </Text>
        </Flex>

        <IconButton
          mr={2}
          icon={<User2 size={24} />}
          variant="solid"
          colorScheme="teal"
          aria-label="ورود به سیستم"
          onClick={() => navigate("/myhome")}
        />
        <Link href="tel:+989123456789" mr={1}>
          <IconButton icon={<Phone size={24} />} colorScheme="teal">
            تماس با ما
          </IconButton>
        </Link>
      </Flex>

      {/* Rawer Menu */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
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

      {/* Slider */}
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

      {/* Show products section */}
      <Box bg="#3E3E3E" w="full" p={10}>
        <Flex
          columnGap={1}
          textAlign="center"
          alignContent="center"
          alignItems="center"
        >
          {isDesktop && <Divider />}
          <Box
            margin={isDesktop ? 0 : "20px 0 20px 0"}
            width="full"
            color="white"
          >
            <Heading size="lg" fontFamily="Vaziri">
              محصولات گروه صنعتی علیایی
            </Heading>
          </Box>
          {isDesktop && <Divider />}
        </Flex>

        <SimpleGrid
          spacing={4}
          columns={{ base: 1, md: 2, lg: 4 }}
          alignContent="center"
          alignItems="center"
          m={"auto"}
          mt={2}
          mb={2}
          p={isDesktop ? 5 : 1}
        >
          <Box display={{ base: "none", lg: "block" }} />

          <Box
            onMouseOver={(e) => {
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.borderColor = "#138d75";
              e.currentTarget.style.boxShadow = "#138d75 0px 5px 10px 1px";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgb(36, 35, 35)";
              e.currentTarget.style.boxShadow =
                "rgba(0, 0, 0, 0.5) 0px 5px 10px 1px";
            }}
            boxShadow={"rgba(0, 0, 0, 0.5) 0px 5px 10px px"}
            w="full"
            h={isDesktop ? 250 : 150}
            borderWidth={1}
            borderRadius={15}
            borderColor="rgb(36, 35, 35)"
            alignContent="center"
            alignItems="center"
          >
            <SimpleGrid columns={{ base: 2 }} p={1}>
              <Box
                color="white"
                alignContent="center"
                alignItems="center"
                p={2}
              >
                <Flex spacing={2} spacingX={0}>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="right"
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="EnglishHeader"
                    mr={2}
                  >
                    G
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  >
                    collection
                  </Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "sm" : "xs"}
                  fontFamily="Aseman"
                >
                  کابین آسانسور تمام شیشه ای
                </Text>
              </Box>
              <Box
                alignContent="center"
                alignItems="center"
                mt={-1}
                p={2}
                ml="auto"
                h={isDesktop ? "250px" : "150px"}
                w="full"
                overflow="hidden"
                borderRadius={15}
              >
                <Img
                  alt="..."
                  w="100%"
                  h="100%"
                  borderRadius={15}
                  objectFit="fit"
                  src="/assets/images/products/glassCabin3.jpg"
                />
              </Box>
            </SimpleGrid>
          </Box>

          <Box
            onMouseOver={(e) => {
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.borderColor = "#138d75";
              e.currentTarget.style.boxShadow = "#138d75 0px 5px 10px 1px";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgb(36, 35, 35)";
              e.currentTarget.style.boxShadow =
                "rgba(0, 0, 0, 0.5) 0px 5px 10px 1px";
            }}
            boxShadow={"rgba(0, 0, 0, 0.5) 0px 5px 10px 0px"}
            w="full"
            h={isDesktop ? 250 : 150}
            borderWidth={1}
            borderRadius={15}
            borderColor="rgb(36, 35, 35)"
            alignContent="center"
            alignItems="center"
          >
            <SimpleGrid columns={{ base: 2 }} p={1}>
              <Box
                color="white"
                alignContent="center"
                alignItems="center"
                p={2}
              >
                <Flex spacing={2} spacingX={0}>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="right"
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="EnglishHeader"
                    mr={2}
                  >
                    N
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  >
                    collection
                  </Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "sm" : "xs"}
                  fontFamily="Aseman"
                >
                  کابین آسانسور تمام استیل
                </Text>
              </Box>
              <Box
                alignContent="center"
                alignItems="center"
                mt={-1}
                p={2}
                ml="auto"
                h={isDesktop ? "250px" : "150px"}
                w="full"
                overflow="hidden"
                borderRadius={15}
              >
                <Img
                  alt="..."
                  w="100%"
                  h="100%"
                  borderRadius={15}
                  objectFit="fit"
                  src="/assets/images/products/glassCabin4.jpg"
                />
              </Box>
            </SimpleGrid>
          </Box>

          <Box display={{ base: "none", lg: "block" }} />

          <Box display={{ base: "none", lg: "block" }} />

          <Box
            onMouseOver={(e) => {
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.borderColor = "#138d75";
              e.currentTarget.style.boxShadow = "#138d75 0px 5px 10px 1px";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgb(36, 35, 35)";
              e.currentTarget.style.boxShadow =
                "rgba(0, 0, 0, 0.5) 0px 5px 10px 1px";
            }}
            boxShadow={"rgba(0, 0, 0, 0.5) 0px 5px 10px 0px"}
            w="full"
            h={isDesktop ? 250 : 150}
            borderWidth={1}
            borderRadius={15}
            borderColor="rgb(36, 35, 35)"
            alignContent="center"
            alignItems="center"
          >
            <SimpleGrid columns={{ base: 2 }} p={1}>
              <Box
                color="white"
                alignContent="center"
                alignItems="center"
                p={2}
              >
                <Flex spacing={2} spacingX={0}>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="right"
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="EnglishHeader"
                    mr={2}
                  >
                    Base
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  >
                    Parts
                  </Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "sm" : "xs"}
                  fontFamily="Aseman"
                >
                  ریل آسانسور
                </Text>
              </Box>
              <Box
                alignContent="center"
                alignItems="center"
                mt={-1}
                p={2}
                ml="auto"
                h={isDesktop ? "250px" : "150px"}
                w="full"
                overflow="hidden"
                borderRadius={15}
              >
                <Img
                  alt="..."
                  w="100%"
                  h="100%"
                  borderRadius={15}
                  objectFit="fit"
                  src="/assets/images/products/reil1.jpg"
                />
              </Box>
            </SimpleGrid>
          </Box>

          <Box
            onMouseOver={(e) => {
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.borderColor = "#138d75";
              e.currentTarget.style.boxShadow = "#138d75 0px 5px 10px 1px";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgb(36, 35, 35)";
              e.currentTarget.style.boxShadow =
                "rgba(0, 0, 0, 0.5) 0px 5px 10px 1px";
            }}
            boxShadow={"rgba(0, 0, 0, 0.5) 0px 5px 10px 0px"}
            w="full"
            h={isDesktop ? 250 : 150}
            borderWidth={1}
            borderRadius={15}
            borderColor="rgb(36, 35, 35)"
            alignContent="center"
            alignItems="center"
          >
            <SimpleGrid columns={{ base: 2 }} p={1}>
              <Box
                color="white"
                alignContent="center"
                alignItems="center"
                p={2}
              >
                <Flex spacing={2} spacingX={0}>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="right"
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="EnglishHeader"
                    mr={2}
                  >
                    O
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  >
                    collection
                  </Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "sm" : "xs"}
                  fontFamily="Aseman"
                >
                  آسانسور های بیرونی{" "}
                </Text>
              </Box>
              <Box
                alignContent="center"
                alignItems="center"
                mt={-1}
                p={2}
                ml="auto"
                h={isDesktop ? "250px" : "150px"}
                w="full"
                overflow="hidden"
                borderRadius={15}
              >
                <Img
                  alt="..."
                  w="100%"
                  h="100%"
                  borderRadius={15}
                  objectFit="fit"
                  src="/assets/images/products/glassCabin1.jpg"
                />
              </Box>
            </SimpleGrid>
          </Box>

          <Box display={{ base: "none", lg: "block" }} />
        </SimpleGrid>
      </Box>

      {/* Map */}
      <Box h="550px" w="100%" zIndex={2}>
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

      {/* Page Footer */}
      <VStack
        mt={1}
        color="white"
        bgImage="url(/assets/images/bg/world.png)"
        bgSize="auto"
        bgRepeat="no-repeat"
        bgPosition="left"
      >
        <Box width="full">
          <SimpleGrid
            bg="blackAlpha.600"
            spacing={50}
            color="white"
            p={10}
            columns={{ base: 1, md: 3, lg: 5 }}
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

            <VStack textAlign="right" alignItems="end">
              <Box
                bg="gray"
                boxSize="100px"
                maxH="300px"
                mb={8}
                mr="auto"
                ml="auto"
              >
                <LinkBox
                  referrerPolicy="origin"
                  target="_blank"
                  href="https://trustseal.enamad.ir/?id=621964&Code=QZvNJGhh1flyIQ2g8Y93bitVDZpUfM6X"
                >
                  <Image
                    referrerPolicy="origin"
                    src="https://trustseal.enamad.ir/logo.aspx?id=621964&Code=QZvNJGhh1flyIQ2g8Y93bitVDZpUfM6X"
                    alt=""
                    style={{ cursor: "pointer" }}
                    code="QZvNJGhh1flyIQ2g8Y93bitVDZpUfM6X"
                  />
                </LinkBox>
              </Box>
              <Text fontWeight="medium" textAlign="right">
                شرکت آسانسور علیایی دارای نشان نماد می‌باشد
              </Text>
            </VStack>
          </SimpleGrid>

          <Box width="full" bg="black" color="gray.500" textAlign="center">
            <Divider />
            <Heading fontFamily="Aseman" fontSize="lg" m={2}>
              کلیه حقوق مادی و معنی متعلق به گروه صنعتی علیایی می باشد
            </Heading>
            <Text fontSize="md" fontFamily="Aseman" m={2}>
              طراحی و توسعه داده شده توسط رضا میرعسگری - 09125213288
            </Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
