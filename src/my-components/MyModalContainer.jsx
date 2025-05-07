import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

export const MyModalContainer = ({
  children,
  onSave,
  isOpen,
  onClose,
  proformaId,
  modalHeader,
}) => {
  useEffect(() => {}, [children]);

  if (!children) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader textAlign="center" bg="#FFC300">
            {modalHeader}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} dir="rtl">
            <Spinner />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSave}>
              تایید
            </Button>
            <Button onClick={onClose}>انصراف</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" bg="#68C15A">
          {modalHeader}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} borderTopWidth={2}>
          {children}
        </ModalBody>
        {/* <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSave}>
            تایید
          </Button>
          <Button onClick={onClose}>انصراف</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};
