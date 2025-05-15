import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

export const MyInputBox = ({ icon, size, title, onChange, type, ...props }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <InputGroup>
      <InputRightElement
        pointerEvents="none"
        borderLeftColor="gray.200"
        borderLeftWidth={1}
      >
        {icon && <Icon as={icon} pointerEvents="none" color="gray.500" />}
      </InputRightElement>
      <Input
        type={type}
        pr="2.9rem"
        placeholder={title}
        htmlSize={size}
        width="auto"
        onChange={handleChange}
        {...props}
      />
    </InputGroup>
  );
};
