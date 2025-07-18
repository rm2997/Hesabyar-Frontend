import {
  SimpleGrid,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ProformaRequests } from "../../my-components/requests/ProformaRequests";
import { InvoiceRequests } from "../../my-components/requests/InvoiceRequests";

export const Requests = ({ isDesktop }) => {
  return (
    <SimpleGrid>
      <Tabs
        isLazy
        borderWidth="1px"
        align="start"
        variant="unstyled"
        borderRadius="5"
        color="black"
        colorScheme="blue"
        borderColor="gray.200"
      >
        <TabList>
          <Tab>پیش فاکتورها</Tab>
          <Tab>فاکتورها</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" />
        <TabPanels borderColor="gray.200" borderWidth="1px" borderRadius="5">
          <TabPanel>
            <ProformaRequests isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <InvoiceRequests isDesktop={isDesktop} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
