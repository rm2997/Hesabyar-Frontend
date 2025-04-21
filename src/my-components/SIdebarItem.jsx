// components/SidebarItem.jsx
import {
  Box,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

export const SidebarItem = ({ id, title, children, onMenuItemClick }) => {
  return (
    <AccordionItem id={id}>
      <h2>
        <AccordionButton>
          <Box flex="2" textAlign="right">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={1}>
        {children.map((child) => (
          <AccordionButton
            id={child.id}
            onClick={() => onMenuItemClick(child.id)}
          >
            <Box as="h3" flex="3" textAlign="right">
              {child.type === "text" ? child.name : child.element}
            </Box>
          </AccordionButton>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
