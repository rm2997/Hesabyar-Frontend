//import { Box, Container, Grid, GridItem } from "@chakra-ui/react";

// export const MyHome= ()=>{
//    return(
//       <Container marginTop='5' marginBottom='5' maxW='full' maxH='full' dir="rtl">
//  			 <Grid templateColumns='repeat(3, 1fr)' templateRows='repeat(14,1fr)' gap={5}>
// 				<GridItem  rowSpan='14' colSpan='1'  bg='yellow' >
// 					<Box ></Box>
// 			   </GridItem>
// 				<GridItem  rowSpan='14' colSpan='1' bg='red.500' >
// 					<Box ></Box>
// 				</GridItem>
// 				<GridItem  rowSpan='14' colSpan='1' bg='blue'  >
// 					<Box ></Box>
// 				</GridItem>
				
// 			</Grid>
//   	  </Container>
//     );
// }

import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
  Badge,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const MyHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (

	<Box dir="rtl" bg="gray.50" minH="100vh">
	{/* نوار بالا */}
	<Flex justify="space-between" bg="blue.500" color="white" p={4}>
	  <Text fontWeight="bold">لوگو</Text>
	  <Flex gap={4}>
		 <Button colorScheme="blue">خروج</Button>
		 <Avatar size="sm" />
		 <Badge colorScheme="red">3</Badge>
	  </Flex>
	</Flex>

	<Flex minH="calc(100vh - 64px)" flexDirection="column">
	  <Flex flex={1}>
		 {/* سایدبار */}
		 <Box
			bg="gray.200"
			w={sidebarOpen ? '250px' : '50px'}
			transition="width 0.3s"
			p={sidebarOpen ? 4 : 2}
		 >
			<IconButton
			  aria-label="Toggle Sidebar"
			  icon={sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			  onClick={toggleSidebar}
			/>
			{sidebarOpen && <Text mt={4}>منو</Text>}
		 </Box>

		 {/* قسمت مرکزی */}
		 <Box flex={1} p={4}>
			<Text fontSize="lg">محتوای اصلی</Text>
			{/* جدول نمایش اطلاعات */}
			<Box bg="white" shadow="md" p={4} borderRadius="md" mt={4}>
			  <Text>جدول اطلاعات و آمار</Text>
			</Box>
		 </Box>
	  </Flex>
	  
	  {/* نوار پایین */}
	  <Flex bg="blue.700" color="white" p={4} justify="center">
		 <Text>درباره سایت | ارتباط با ما</Text>
	  </Flex>
	</Flex>
 </Box>


  );
};


