import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";

export const MyInputBox = ({ icon, size, title, onChange, type, ...props }) => {
  const [passIcon, setPassIcon] = useState(Eye);
  const [inputType, setInputType] = useState({ type });

  useEffect(() => {
    setInputType(type);
  }, []);

  const handleShowPassword = () => {
    if (inputType == "password") {
      setInputType("text");
      setPassIcon(EyeClosed);
    } else {
      setInputType("password");
      setPassIcon(Eye);
    }
  };
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <InputGroup>
      {icon && (
        <InputRightElement
          pointerEvents="none"
          borderLeftColor="gray.200"
          borderLeftWidth={1}
        >
          <Icon as={icon} pointerEvents="none" color="gray.500" />
        </InputRightElement>
      )}
      <Input
        type={inputType}
        pr={icon ? "2.9rem" : 0}
        pl={type == "password" ? "2.9rem" : 0}
        placeholder={title}
        htmlSize={type == "password" ? size - 3 : size}
        onChange={handleChange}
        {...props}
      />
      {type == "password" && (
        <InputLeftElement
          onClick={handleShowPassword}
          _hover={{ color: "orange", cursor: "pointer" }}
        >
          <Icon as={passIcon} />
        </InputLeftElement>
      )}
    </InputGroup>
  );
};
