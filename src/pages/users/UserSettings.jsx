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
import SepidarConnection from "./SepidarConnection";
import SepidarSyncronization from "./SepidarSyncronization";

export default function UserSettings({ isDesktop }) {
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
            <Text fontSize={isDesktop ? "md" : "sm"}>ارتباط با سپیدار</Text>
          </Tab>
          <Tab>
            <Text fontSize={isDesktop ? "md" : "sm"}>همسان سازی </Text>
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" />
        <TabPanels borderColor="gray.200" borderWidth="1px" borderRadius="5">
          <TabPanel>
            <SepidarConnection />
          </TabPanel>
          <TabPanel>
            <SepidarSyncronization />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
}
