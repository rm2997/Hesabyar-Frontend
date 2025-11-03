import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  syncSepidarCustomer,
  syncSepidarGoods,
  syncSepidarUnits,
} from "../../api/services/sepidarService";

export default function SepidarSyncronization() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const syncGoods = async () => {
    setLoading(true);
    const res = await syncSepidarGoods();
    if (!res.success) {
      toast({
        title: "توجه",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (res.data.result == "ok")
      toast({
        title: "موفق",
        description: "اطلاعات کالاها بروزسانی شد",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    setLoading(false);
  };

  const syncUnits = async () => {
    setLoading(true);
    const res = await syncSepidarUnits();
    if (!res.success) {
      toast({
        title: "توجه",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (res.data.result == "ok")
      toast({
        title: "موفق",
        description: "اطلاعات واحدها بروزسانی شد",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    setLoading(false);
  };

  const syncCustomers = async () => {
    setLoading(true);
    const res = await syncSepidarCustomer();
    if (!res.success) {
      toast({
        title: "توجه",
        description: res.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (res?.data?.result == "ok") {
      toast({
        title: "موفق",
        description: "اطلاعات مشتریان بروزسانی شد",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "خطا",
        description: res.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box mt={5} flex="1" overflowY="auto">
      <Flex direction="column" px={2}>
        <Box borderTopRadius="md" p={3} w="full" bg="#68C15A">
          <Text>بروزرسانی اطلاعات سپیدار</Text>
        </Box>
        <SimpleGrid
          textColor="black"
          columns={1}
          gap={5}
          bg="white"
          p={5}
          borderBottomRadius="md"
          boxShadow={"md"}
        >
          <Button
            w="full"
            variant={"solid"}
            colorScheme="blue"
            onClick={syncUnits}
            isLoading={loading}
          >
            بروز رسانی واحدها
          </Button>
          <Button
            w="full"
            variant={"solid"}
            colorScheme="blue"
            onClick={syncGoods}
            isLoading={loading}
          >
            بروز رسانی کالاها
          </Button>
          <Button
            w="full"
            variant={"solid"}
            colorScheme="blue"
            onClick={syncCustomers}
            isLoading={loading}
          >
            بروز رسانی مشتریان
          </Button>
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
