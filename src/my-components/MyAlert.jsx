import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

export const MyAlert = ({ AlertHeader, AlertMessage, onClose, isOpen }) => {
  return (
    <AlertDialog
      motionPreset="slideInTop"
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader bg="blue.400" color="white">
          {AlertHeader}
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody dir="rtl">{AlertMessage}</AlertDialogBody>
        <AlertDialogFooter>
          <Button
            onClick={(e) => {
              onClose("Cancel");
            }}
          >
            خیر
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            onClick={(e) => {
              onClose("Confirm");
            }}
          >
            بله
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
