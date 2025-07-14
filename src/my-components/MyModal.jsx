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
    <Modal
      isCentered={modalHeader == "خطای دسترسی"}
      dir="rtl"
      onClose={onClose}
      size={size}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          textAlign="right"
          bg={modalHeader == "خطای دسترسی" ? "red.400" : "#373c50"}
          color="white"
          mb="10px"
        >
          {modalHeader}
        </ModalHeader>
        {modalHeader !== "خطای دسترسی" && (
          <ModalCloseButton left="1rem" right="auto" color="white" />
        )}
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
