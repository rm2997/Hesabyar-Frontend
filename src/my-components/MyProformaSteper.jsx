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
    title: "درخواست تایید",
    description:
      "یک لینک برای مشتری فرستاده می شود تا اطلاعات پیش فاکتور را تایید کند",
  },
  {
    title: "تایید مشتری",
    description: "مشتری پیش فاکتور خود را تایید می نماید",
  },
  {
    title: "تایید کاربر ارشد",
    description: "کاربر ارشد سیستم پیش فاکتور را تایید میکند",
  },
  {
    title: "تهیه فاکتور",
    description: "پیش فاکتور تبدیل به فاکتور می شود",
  },
];
export const MyProformaStepper = ({ data }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const getCurrentStep = () => {
    if (!data?.isSent) return setActiveStep(0);
    if (!data?.approvedFile) return setActiveStep(1);
    if (!data?.isAccepted) return setActiveStep(2);
    if (!data?.isConverted) return setActiveStep(3);
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

            <Box minWidth="55px" flexShrink="0">
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
