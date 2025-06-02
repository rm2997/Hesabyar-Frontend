import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { CircleX, Search } from "lucide-react";

export const SearchBar = ({
  userInfo,
  search,
  setSearch,
  handleResetSearch,
  loadData,
}) => {
  return (
    <Box
      width="100%"
      bg="#efefef"
      color="white"
      position="sticky"
      top="-5px"
      zIndex="1"
      borderBottomColor="gray.300"
    >
      <Flex mb={1} gap={1}>
        <Input
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
          variant="outline"
          colorScheme="orange"
          leftIcon={<Search />}
          onClick={() => loadData()}
        >
          جستجو
        </Button>
      </Flex>
    </Box>
  );
};
