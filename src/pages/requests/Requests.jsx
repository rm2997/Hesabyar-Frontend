import {
  SimpleGrid,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ProformaRequests } from "../../my-components/requests/ProformaRequests";
import { InvoiceRequests } from "../../my-components/requests/InvoiceRequests";
import { DepotEntryRequest } from "../../my-components/requests/DepotEntryRequests";
import { DepotExitRequests } from "../../my-components/requests/DepotExitRequests";

export const Requests = ({ isDesktop }) => {
  return (
    <SimpleGrid>
      <Tabs
        variant="line"
        isLazy
        borderWidth="1px"
        align="start"
        borderRadius="5"
        color="black"
        colorScheme="blue"
        borderColor="gray.200"
      >
        <TabList>
          <Tab>
            <Text fontSize={isDesktop ? "md" : "sm"}>پیش فاکتورها </Text>
          </Tab>
          <Tab>
            <Text fontSize={isDesktop ? "md" : "sm"}>فاکتورها</Text>
          </Tab>
          <Tab>
            <Text fontSize={isDesktop ? "md" : "sm"}>ورودی انبار</Text>
          </Tab>
          <Tab>
            <Text fontSize={isDesktop ? "md" : "sm"}>خروجی انبار</Text>
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" />
        <TabPanels borderColor="gray.200" borderWidth="1px" borderRadius="5">
          <TabPanel>
            <ProformaRequests isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <InvoiceRequests isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <DepotEntryRequest isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <DepotExitRequests isDesktop={isDesktop} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
