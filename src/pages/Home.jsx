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
import {
  Facebook,
  Linkedin,
  Menu,
  Phone,
  Smartphone,
  Twitter,
  User2,
} from "lucide-react";
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

const sliderData = [
  {
    title: "واردات مستقیم ریل آسانسور",
    image: "/assets/images/slider/Reil1.jpg",
    description:
      "واردات انحصاری از کشورهای چین، اسپانیا و ترکیه با بهترین ویژگی های کیفی",
  },
  {
    title: "سیم بکسل",
    image: "/assets/images/slider/Boxel12.jpg",
    description: "بالاترین استحکام کششی نسبت به موارد مشابه موجود",
  },
  {
    title: "موتور الکو",
    image: "/assets/images/slider/motor1.jpg",
    description:
      "نمایندگی رسمی شرکت الکو، اولین تولیدکننده موتور وگیربکس در ایران",
  },
  {
    title: "گیربکس الکو",
    image: "/assets/images/slider/motor2.jpg",
    description:
      "نمایندگی رسمی شرکت الکو، اولین تولیدکننده موتور وگیربکس در ایران",
  },
  {
    title: "کابل هدسان",
    image: "/assets/images/slider/Cable1.jpg",
    description: "نمایندگی رسمی تراول کابل هدسان",
  },
  {
    title: " ریل آسانسور",
    image: "/assets/images/slider/Reil2.jpg",
    description:
      "واردات انحصاری از کشورهای چین، اسپانیا و ترکیه با بهترین ویژگی های کیفی",
  },
  {
    title: "سیم بکسل",
    image: "/assets/images/slider/Boxel1.jpg",
    description: " واردات مستقیم سیم بکسل آسانسور به صورت انحصاری از کشور چین",
  },
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
    focusOnSelect: false,
  };
  const position = [35.67646, 51.327177];

  return (
    <Box overflow={!isDesktop ? "hidden" : ""} bg="#2E2E2E">
      {/* top menu */}
      <Flex
        dir="rtl"
        as="header"
        bg="#585858"
        color="white"
        position="sticky"
        top="0"
        zIndex={1000}
        px={2}
        // pt={{ base: 7, sm: 9, md: 9, lg: 8 }}
        // pb={{ base: 9, sm: 0, md: 9, lg: 9 }}
        align="center"
        borderBottomRadius="20px"
        mx="auto"
        maxW="100vw"
        w={isDesktop ? 1000 : "full"}
        h={{ base: "64px", md: "70px" }}
      >
        <Box
          mx={isDesktop ? 3 : 1}
          borderRadius="10%"
          _hover={{
            cursor: "pointer",
          }}
          boxShadow="0 0 25px orange"
          boxSize={20}
          maxH={5}
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
        >
          <Image
            borderRadius="10%"
            src="/assets/images/logos/logo1.png"
            objectFit="cover"
            target="_blank"
            rel="noopener noreferrer"
          />
        </Box>
        {isDesktop ? (
          <Flex columnGap={5}>
            <Link
              _hover={{ textShadow: "2px 2px 5px orange" }}
              transition="text-shadow 0.5s"
              fontFamily="IranSans"
            >
              صفحه اصلی
            </Link>
            <Link
              _hover={{ textShadow: "2px 2px 5px orange" }}
              transition="text-shadow 0.5s"
              fontFamily="IranSans"
            >
              محصولات
            </Link>
            <Link
              _hover={{ textShadow: "2px 2px 5px orange" }}
              transition="text-shadow 0.5s"
              fontFamily="IranSans"
            >
              محصولات بازرگانی
            </Link>
            <Link
              _hover={{ textShadow: "2px 2px 5px orange" }}
              transition="text-shadow 0.5s"
              fontFamily="IranSans"
            >
              کاتالوگ
            </Link>
            <Link
              _hover={{ textShadow: "2px 2px 5px orange" }}
              transition="text-shadow 0.5s"
              fontFamily="IranSans"
            >
              ارتباط با ما
            </Link>
            <Link
              _hover={{ textShadow: "2px 2px 5px orange" }}
              transition="text-shadow 0.5s"
              fontFamily="IranSans"
            >
              تماس با ما
            </Link>
          </Flex>
        ) : (
          <Flex>
            <IconButton
              icon={<Menu />}
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
          icon={<User2 />}
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
          {sliderData.map((slide, i) => (
            <Box key={i} h="600px" dir="rtl">
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                  borderRadius: "10px",
                }}
              />
              <Box
                mr={1}
                float="right"
                position="absolute"
                top="83.2%"
                h="100px"
                maxW="900px"
                color="gray"
                borderRadius="10px"
              >
                <Heading
                  fontSize={{ base: "2xl", md: "lg", lg: "4xl" }}
                  fontFamily="Aseman"
                >
                  {slide.title}
                </Heading>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontFamily="IranSans"
                  mt="1"
                >
                  {slide.description}
                </Text>
              </Box>
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
                    size={isDesktop ? "lg" : "md"}
                    fontFamily="Aseman"
                    ml="auto"
                    mb={2}
                  >
                    انواع ریل آسانسور
                  </Heading>
                  {/* <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  ></Heading> */}
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "xs" : "2xs"}
                  fontFamily="IranSans"
                >
                  وارد کننده ریل های با کیفیت اسپانیایی، ترکیه ای و چینی
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
                  src="/assets/images/products/Reil1.jpg"
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
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="Aseman"
                    ml="auto"
                    mb={2}
                  >
                    موتور آسانسور
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  ></Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "xs" : "2xs"}
                  fontFamily="IranSans"
                >
                  نمایندگی رسمی موتورهای الکو
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
                  src="/assets/images/products/motor1.jpg"
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
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="Aseman"
                    ml="auto"
                    mb={2}
                  >
                    گیربکس آسانسور
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  ></Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "xs" : "2xs"}
                  fontFamily="IranSans"
                >
                  نمایندگی رسمی گیربوکس های الکو
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
                  src="/assets/images/products/motor2.jpg"
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
                    size={isDesktop ? "xl" : "md"}
                    fontFamily="Aseman"
                    ml="auto"
                    mb={2}
                  >
                    سیم بکسل
                  </Heading>
                  <Heading
                    alignContent="center"
                    alignItems="center"
                    textAlign="left"
                    size={isDesktop ? "md" : "sm"}
                    fontFamily="EnglishHeader"
                  ></Heading>
                </Flex>
                <Text
                  dir="rtl"
                  fontSize={isDesktop ? "xs" : "2xs"}
                  fontFamily="IranSans"
                >
                  واردات مستقیم سیم بکسل به صورت انحصاری در ابعاد و ضخامت های
                  مختلف{" "}
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
                  src="/assets/images/products/Boxel1.jpg"
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
              <Flex mx="auto" mt={2} direction="row" columnGap={3}>
                <Link _hover={{ color: "orange" }}>
                  <Twitter />
                </Link>
                <Link _hover={{ color: "orange" }}>
                  <Phone />
                </Link>
                <Link _hover={{ color: "orange" }}>
                  <Smartphone />
                </Link>
                <Link _hover={{ color: "orange" }}>
                  <Linkedin />
                </Link>
                <Link _hover={{ color: "orange" }}>
                  <Facebook />
                </Link>
              </Flex>
            </VStack>

            <VStack textAlign="right" alignItems="end">
              <Box boxSize={100} maxH={10} mb={8} mr="auto" ml="auto">
                <Image
                  src="/assets/images/logos/logo1.png"
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
