import {
  Box,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export const SearchGoods = ({ onSelect, isOpen, onClose, searchItems }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const initData = async () => {
      const res = await searchItems("");
      setResults(res);
    };
    initData();
  }, [isOpen]);

  const searchGoods = async (q) => {
    setLoading(true);
    try {
      const res = await searchItems(q);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val?.length > 2) {
      searchGoods(val);
    } else {
      setResults([]);
    }
  };

  return (
    <Modal
      initialFocusRef={inputRef}
      motionPreset="slideInTop"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="blue.300" textAlign="center">
          جستجوی کالا
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={10} dir="rtl">
          <Box position="relative" w="100%">
            <Input
              ref={inputRef}
              placeholder="جستجوی نام کالا..."
              value={query}
              onChange={handleChange}
            />
            {loading && (
              <Spinner size="sm" position="absolute" top="12px" right="12px" />
            )}
            {results?.length > 0 && (
              <Box
                position="absolute"
                top="80%"
                zIndex={10}
                w="100%"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                maxH="250px"
                overflowY="auto"
                mt={1}
              >
                <List spacing={0}>
                  {results?.map((item) => (
                    <ListItem
                      key={item?.id}
                      p={2}
                      _hover={{ bg: "gray.100", cursor: "pointer" }}
                      onClick={() => {
                        onSelect(item);
                        setQuery("");
                        setResults([]);
                      }}
                    >
                      <Text fontFamily="iranSans">
                        <Badge
                          fontFamily="iransans"
                          fontSize="sm"
                          colorScheme="blue"
                          ml="10px"
                        >
                          کد کالا: {item?.id}
                        </Badge>
                        {item?.goodName}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
