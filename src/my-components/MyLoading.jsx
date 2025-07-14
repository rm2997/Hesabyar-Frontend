import { Flex, Heading, Spinner } from "@chakra-ui/react";

export const MyLoading = () => {
  return (
    <Flex
      direction={"column"}
      top={0}
      position="absolute"
      zIndex={100}
      minHeight="78%"
      h="100%"
      minW="full"
      bg="blackAlpha.300"
    >
      <Flex alignItems="center" direction="column" my="auto">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="red.500"
          size="xl"
        />
        <Heading color="whiteAlpha.800" fontFamily="Aseman" fontSize="2xl">
          لطفا شکیبا باشید
        </Heading>
      </Flex>
    </Flex>
  );
};
