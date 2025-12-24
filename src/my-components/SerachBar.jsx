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
  X,
} from "lucide-react";
import { LuScanSearch } from "react-icons/lu";
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
      boxShadow={!showSearch ? "md" : ""}
      mt={1}
      py={0.5}
      mx={showSearch ? 3 : "auto"}
      mr={showSearch ? "auto" : ""}
      width={showSearch ? "50px" : "98%"}
      transition="width 0.2s,margin 0.2s"
      // bg="#efefef"
      bg={!showSearch ? "#f3f5deff" : "gray.100"}
      opacity={".9"}
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
          title={showSearch ? userInfo : "انصراف"}
          _hover={{ transform: "rotate(360deg)" }}
          transition="transform 0.5s"
          colorScheme=""
          icon={
            showSearch ? (
              <LuScanSearch color="orange" size={"30px"} />
            ) : (
              <X color="orange" />
            )
          }
          onClick={() => {
            SetShowSearch(!showSearch);
            handleResetSearch(!showSearch);
          }}
          variant={showSearch ? "ghost" : "ghost"}
          mx={1}
        />
        <Flex width="full" direction="row" columnGap={1} overflow="hidden">
          <Input
            mx={1}
            px={2}
            color="gray.800"
            variant="unstyled"
            placeholder={userInfo}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key == "Enter") loadData();
            }}
          />
          <IconButton
            hidden={!search}
            variant="ghost"
            color="red"
            icon={<CircleX />}
            onClick={() => {
              handleResetSearch(true);
            }}
          />
          <IconButton
            hidden={search.length == 0}
            variant="ghost"
            color="green"
            icon={<Search />}
            onClick={() => loadData()}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
