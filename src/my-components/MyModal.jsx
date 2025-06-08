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
import React, { useEffect } from "react";

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
        <ModalHeader bg="#61BB46" color="white" mb="25px">
          {modalHeader}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody dir="rtl">{children}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
