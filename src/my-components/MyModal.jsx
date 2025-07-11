import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect } from "react";

export const MyModal = ({
  children,
  isOpen,
  onClose,
  modalHeader,
  size = "full",
}) => {
  useEffect(() => {}, [children]);

  return (
    <Modal dir="rtl" onClose={onClose} size={size} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          bg={modalHeader == "خطای دسترسی" ? "red.400" : "#61BB46"}
          color="white"
          mb="10px"
        >
          {modalHeader}
        </ModalHeader>
        {modalHeader !== "خطای دسترسی" && <ModalCloseButton />}
        <ModalBody dir="rtl">{children}</ModalBody>
        <ModalFooter>
          {modalHeader !== "خطای دسترسی" && (
            <Button onClick={onClose}>بستن</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
