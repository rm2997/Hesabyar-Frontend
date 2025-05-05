import {
  Box,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";

export const SidebarItem = ({
  id,
  title,
  children,
  onMenuItemClick,
  icon,
  color,
  justIcon,
}) => {
  return (
    <AccordionItem id={id}>
      <h2>
        <AccordionButton>
          <HStack spacing={2}>
            <Icon color={color}>{icon}</Icon>
            {!justIcon && (
              <Box flex="2" textAlign="right">
                {title}
              </Box>
            )}
          </HStack>
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
              {child.type === "text" ? (
                <HStack>
                  <Icon color="#50b742">{child.icon}</Icon>
                  {!justIcon && <Text>{child.name}</Text>}
                </HStack>
              ) : (
                child.element
              )}
            </Box>
          </AccordionButton>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
