import {
  Box,
  Flex,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  Tooltip,
  useSteps,
} from "@chakra-ui/react";

import { useEffect } from "react";

const steps = [
  {
    title: "مستندات انبار",
    description:
      "مسئول انبار تصاویر امضا راننده و خودرو حامل کالاها را به سند الصاق میکند",
  },
  {
    title: "تاییدیه انبار",
    description: "مسئول انبار درخواست را برای خروج کالا را تایید میکند",
  },
  {
    title: "تایید کاربر ارشد",
    description: "کاربر ارشد درخواست را برای خروج کالا را تایید میکند",
  },
];
export const MyDepotExitRequestStepper = ({ data }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const getCurrentStep = () => {
    if (!data?.driverSignImage && !data?.exitGoodImage) return setActiveStep(0);
    if (!data?.warehouseAcceptedBy) return setActiveStep(1);
    if (!data?.isAccepted) return setActiveStep(2);
    return setActiveStep(3);
  };

  useEffect(() => {
    getCurrentStep();
  }, [data]);

  return (
    <Flex
      borderLeftColor="gray.300"
      borderLeftWidth={1}
      borderLeftStyle="dashed"
      p={1}
    >
      <Stepper
        ml={2}
        size="sm"
        dir="ltr"
        index={activeStep}
        orientation="vertical"
        height="200px"
        gap="0"
        colorScheme="orange"
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator fontFamily="iransans">
              <StepStatus
                complete={<StepIcon fontFamily="iransans" />}
                incomplete={<StepNumber fontFamily="iransans" />}
                active={<StepNumber fontFamily="iransans" />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle textAlign="right">
                <Text fontFamily="iransans" fontSize="10px">
                  <Tooltip
                    hasArrow
                    dir="rtl"
                    textAlign="justify"
                    label={step.description}
                  >
                    {step.title}
                  </Tooltip>
                </Text>
              </StepTitle>
              {/* <StepDescription>
                <Text dir="rtl" fontFamily="Beiruti" fontSize="xs" maxW="100px">
                  {step.description}
                </Text>
              </StepDescription> */}
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Flex>
  );
};
