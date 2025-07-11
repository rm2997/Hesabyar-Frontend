import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { CircleX, Search } from "lucide-react";

export const SearchBar = ({
  isDesktop = true,
  userInfo,
  search,
  setSearch,
  handleResetSearch,
  loadData,
  yTop = "-4px",
  zIndex = "1",
}) => {
  return (
    <Box
      mt={1}
      mx={1}
      width="98%"
      bg="#efefef"
      color="white"
      position="sticky"
      top={yTop}
      zIndex={zIndex}
      borderBottomColor="gray.300"
      borderRadius={7}
      boxShadow={!isDesktop ? "rgba(0, 0, 0, 0.5) 2px 5px 5px 1px" : ""}
    >
      <Flex columnGap={2}>
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
        <IconButton
          hidden={search.length == 0}
          variant="ghost"
          colorScheme="cyan"
          icon={<Search />}
          onClick={() => loadData()}
        />
      </Flex>
    </Box>
  );
};
