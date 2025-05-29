import {
  AbsoluteCenter,
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

export const MyLoading = ({ showLoading }) => {
  if (!showLoading) return <></>;
  return (
    <Box marginTop="180px" marginLeft="auto" marginRight="auto">
      <Center>
        <CircularProgress
          color="green.400"
          isIndeterminate
          value={50}
          size="220px"
        >
          <CircularProgressLabel color="blackAlpha.600" fontSize="md">
            لطفا شکیبا باشید
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
    </Box>
  );
};
