import {
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ChangePassword } from "../../my-components/users/ChangePassword";

export const Users = ({ isDesktop }) => {
  return (
    <SimpleGrid>
      <Tabs
        borderWidth="1px"
        isFitted
        bg=""
        color="black"
        align="start"
        variant="enclosed"
      >
        <TabList>
          <Tab>کاربر جدید</Tab>
          <Tab>تغییر کلمه عبور</Tab>
          <Tab>کاربران</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>کاربر جدید</p>
          </TabPanel>
          <TabPanel>
            <ChangePassword isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <p>کاربران</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
