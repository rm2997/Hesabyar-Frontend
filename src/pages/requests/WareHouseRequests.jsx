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

import { DepotWareHouseExitRequests } from "../../my-components/warehouse/DepotWareHouseExitRequests";
import { DepotWareHouseEntyRequests } from "../../my-components/warehouse/DepotWareHouseEntryRequests";

export const WareHouseRequests = ({ isDesktop }) => {
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
            <Text fontSize={isDesktop ? "md" : "sm"}>ورودی انبار</Text>
          </Tab>
          <Tab>
            <Text fontSize={isDesktop ? "md" : "sm"}>خروجی انبار</Text>
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" />
        <TabPanels borderColor="gray.200" borderWidth="1px" borderRadius="5">
          <TabPanel>
            <DepotWareHouseEntyRequests isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <DepotWareHouseExitRequests isDesktop={isDesktop} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
