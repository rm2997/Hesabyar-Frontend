import {
  SimpleGrid,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ChangePassword } from "../../my-components/users/ChangePassword";
import { NewUser } from "../../my-components/users/NewUser";
import { UsersDataTable } from "../../my-components/users/UsersDataTable";

export const Users = ({ isDesktop, user }) => {
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
          <Tab>کاربر جدید</Tab>
          <Tab>تغییر کلمه عبور</Tab>
          <Tab>کاربران</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels borderColor="gray.200" borderWidth="1px" borderRadius="5">
          <TabPanel>
            <NewUser isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <ChangePassword isDesktop={isDesktop} user={user} />
          </TabPanel>
          <TabPanel>
            <UsersDataTable isDesktop={isDesktop} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
