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

export const MyModal = ({ children, isOpen, onClose, modalHeader }) => {
  useEffect(() => {}, [children]);

  return (
    <Modal dir="rtl" onClose={onClose} size={"full"} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="blue.400" color="white">
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
