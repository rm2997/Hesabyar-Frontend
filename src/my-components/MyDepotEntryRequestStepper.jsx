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
    title: "تایید کاربر ارشد",
    description: "کاربر ارشد درخواست  ورود کالا را تایید میکند",
  },
  {
    title: "مستندات انبار",
    description:
      "مسئول انبار تصاویر امضا راننده و خودرو حامل کالاها را به سند الصاق میکند",
  },
  {
    title: "تاییدیه انبار",
    description: "مسئول انبار  ورود کالا را تایید میکند",
  },
  {
    title: "ورود کالا",
    description: "تعداد اقلام به موجودی انبار اضافه می شود",
  },
];
export const MyDepotEntryRequestStepper = ({ data }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const getCurrentStep = () => {
    if (!data?.isAccepted) return setActiveStep(0);
    if (!data?.driverSignImage && !data?.exitGoodImage) return setActiveStep(1);
    if (!data?.warehouseAcceptedBy) return setActiveStep(2);
    if (!data?.finishd) return setActiveStep(3);

    return setActiveStep(4);
  };

  useEffect(() => {
    getCurrentStep();
  }, [data]);

  return (
    <Flex
      borderLeftColor="gray.300"
      borderLeftWidth={1}
      borderLeftStyle="dashed"
      float="right"
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
