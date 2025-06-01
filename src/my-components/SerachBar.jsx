import React, { useState, useEffect } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";

export const SearchBar = ({
  data,
  searchField = "name",
  placeholder = "جستجو کنید...",
  renderItem,
  debounceTime = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchTerm) {
        setFilteredData(data);
      } else {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = data.filter((item) =>
          item[searchField]?.toString().toLowerCase().includes(lowerTerm)
        );
        setFilteredData(filtered);
      }
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [searchTerm, data, searchField, debounceTime]);

  return (
    <Box>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
        {filteredData.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            موردی یافت نشد
          </Text>
        ) : (
          filteredData.map((item, index) =>
            renderItem ? (
              renderItem(item, index)
            ) : (
              <ListItem
                key={index}
                p={2}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: "gray.300" }}
              >
                {item[searchField]}
              </ListItem>
            )
          )
        )}
      </VStack>
    </Box>
  );
};
