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
import { CheckCheck, Sandwich, WatchIcon } from "lucide-react";
import { useEffect } from "react";

const steps = [
  {
    title: "ارسال لینک",
    description: "یک لینک برای مشتری بفرستید تا فیش واریزی خود را ثبت کند",
  },
  {
    title: "دریافت فیش ",
    description: "مشتری مدارک واریز خود را به فاکتور الصاق میکند",
  },
  {
    title: "اخذ تاییدیه",
    description: "کاربر ارشد سیستم فاکتور را تایید میکند",
  },
  {
    title: "تعیین راننده",
    description: "لینکی به مشتری ارسال می شود تا راننده را تعیین کند",
  },
  {
    title: "پایان",
    description: "همه مراحل انجام شده است",
  },
];
export const MyStepper = ({ data }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const getCurrentStep = () => {
    if (!data?.isSent) return setActiveStep(0);
    if (!data?.approvedFile) return setActiveStep(1);
    if (!data?.isAccepted) return setActiveStep(2);
    if (!data?.finished) return setActiveStep(3);
    return setActiveStep(4);
  };

  useEffect(() => {
    getCurrentStep();
  }, [data]);

  return (
    <Flex float="right">
      <Stepper
        size="sm"
        dir="ltr"
        index={activeStep}
        orientation="vertical"
        height="250px"
        gap="0"
        colorScheme="orange"
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle textAlign="right">
                <Text fontFamily="Beiruti" fontSize="xs">
                  <Tooltip label={step.description}>{step.title}</Tooltip>
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
