import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

export const MyInputBox = ({ icon, size, title, onChange, ...props }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
      console.log("Hi from MyInputBox");
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
