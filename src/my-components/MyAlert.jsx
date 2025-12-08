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
      motionPreset="scale"
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      allowPinchZoom={true}
    >
      <AlertDialogOverlay />
      <AlertDialogContent borderRadius={"md"}>
        <AlertDialogCloseButton />
        <AlertDialogHeader
          borderTopRadius={"md"}
          textAlign={"right"}
          px={12}
          fontFamily="IranSans"
          bg="blue.400"
          color="white"
        >
          {AlertHeader}
        </AlertDialogHeader>

        <AlertDialogBody fontFamily="IranSans" dir="rtl">
          {AlertMessage}
        </AlertDialogBody>
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
