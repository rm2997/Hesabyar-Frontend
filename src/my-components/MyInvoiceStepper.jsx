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
    description:
      "یک لینک برای مشتری فرستاده میشود تا فیش واریزی خود را ثبت کند",
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
    title: "درخواست راننده",
    description: "لینکی به مشتری ارسال می شود تا راننده را تعیین کند",
  },
  {
    title: "تعیین راننده",
    description:
      "مشتری مشخصات کسی که اقلام فاکتور را تحویل خواهد گرفت مشخص می کند",
  },
  {
    title: "سند خروج",
    description: "کالا از انبار خارج می شود",
  },
];
export const MyInvoiceStepper = ({ data }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const getCurrentStep = () => {
    if (!data?.isSent) return setActiveStep(0);
    if (!data?.approvedFile) return setActiveStep(1);
    if (!data?.isAccepted) return setActiveStep(2);
    if (!data?.driverTokenIsSent) return setActiveStep(3);
    if (!data?.driver) return setActiveStep(4);
    if (!data?.finished) return setActiveStep(5);
    return setActiveStep(6);
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
        height="250px"
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
