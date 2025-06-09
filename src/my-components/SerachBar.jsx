import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { CircleX, Search } from "lucide-react";

export const SearchBar = ({
  userInfo,
  search,
  setSearch,
  handleResetSearch,
  loadData,
  yTop = "-8px",
  zIndex = "1",
}) => {
  return (
    <Box
      width="100%"
      bg="#efefef"
      color="white"
      position="sticky"
      top={yTop}
      zIndex={zIndex}
      borderBottomColor="gray.300"
    >
      <Flex mb={1} gap={1}>
        <Input
          mr="20px"
          borderWidth="1px"
          borderColor="gray.400"
          color="gray.600"
          placeholder={userInfo}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <IconButton
          hidden={!search}
          variant="ghost"
          colorScheme="red"
          icon={<CircleX />}
          onClick={() => {
            handleResetSearch(true);
          }}
        />
        <Button
          ml="20px"
          maxWidth="100px"
          variant="outline"
          colorScheme="cyan"
          leftIcon={<Search />}
          onClick={() => loadData()}
        >
          جستجو
        </Button>
      </Flex>
    </Box>
  );
};
