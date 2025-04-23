import {
  AbsoluteCenter,
  Center,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

export const MyLoading = ({ showLoading }) => {
  if (!showLoading) return <></>;
  return (
    <AbsoluteCenter>
      <Center>
        <CircularProgress isIndeterminate value={50} size="220px">
          <CircularProgressLabel fontSize="md">
            لطفا شکیبا باشید
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
    </AbsoluteCenter>
  );
};
