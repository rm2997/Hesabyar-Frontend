import {
  Box,
  Flex,
  IconButton,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleX,
  Search,
} from "lucide-react";
import { useState } from "react";

export const SearchBar = ({
  userInfo,
  search,
  setSearch,
  handleResetSearch,
  loadData,
  yTop = "-4px",
  zIndex = "1",
}) => {
  const [showSearch, SetShowSearch] = useState(true);
  const isDesktop = useBreakpointValue({ base: false, md: true, lg: true });
  return (
    <Box
      mt={1}
      py={0.5}
      mx={showSearch ? 3 : 1}
      mr={showSearch ? "auto" : ""}
      width={showSearch ? "50px" : "98%"}
      transition="width 0.2s,margin 0.2s"
      bg="#efefef"
      color="white"
      position="sticky"
      top={yTop}
      zIndex={zIndex}
      borderColor="gray.600"
      borderWidth={showSearch ? 0 : 0.5}
      borderRadius={7}
      _hover={{ boxShadow: !isDesktop ? "sm" : "lg" }}
    >
      <Flex direction={showSearch ? "row" : "row-reverse"} overflow="hidden">
        <IconButton
          title={userInfo}
          _hover={{ transform: "rotate(180deg)" }}
          transition="transform 0.5s"
          colorScheme="cyan"
          icon={showSearch ? <CircleArrowRight /> : <CircleArrowLeft />}
          onClick={() => SetShowSearch(!showSearch)}
          variant={showSearch ? "ghost" : "ghost"}
          mx={2}
        />
        <Flex width="full" direction="row" columnGap={1} overflow="hidden">
          <Input
            mx={1}
            px={2}
            color="gray.800"
            variant="flushed"
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
      </Flex>
    </Box>
  );
};
