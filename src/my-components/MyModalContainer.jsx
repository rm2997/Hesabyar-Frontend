import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { use, useEffect, useState } from "react";

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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{modalHeader}</ModalHeader>
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{modalHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>
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
