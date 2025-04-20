// components/SidebarItem.jsx
import { useState } from "react";
import { Box, Collapse, Text, Icon, VStack } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const SidebarItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        bg="gray.700"
        borderRadius="md"
        _hover={{ bg: "gray.600" }}
      >
        <Text>{title}</Text>
        <Icon as={isOpen ? ChevronUp : ChevronDown} />
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <VStack align="start" pl={4} mt={2} spacing={1}>
          {children.map((child, idx) => (
            <Text
              key={idx}
              fontSize="sm"
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
            >
              {child}
            </Text>
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
};
