import {
  SimpleGrid,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChangePassword } from "../../my-components/users/ChangePassword";
import { NewUser } from "../../my-components/users/NewUser";
import { UsersDataTable } from "../../my-components/users/UsersDataTable";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export const Users = ({}) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { user } = useContext(UserContext);
  return (
    <SimpleGrid>
      <Tabs
        isLazy
        borderWidth="1px"
        align="start"
        variant="line"
        borderRadius="5"
        color="black"
        colorScheme="blue"
        borderColor="gray.200"
      >
        <TabList>
          <Tab>کاربران</Tab>
          <Tab>کاربر جدید</Tab>
          <Tab>تغییر کلمه عبور</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" />
        <TabPanels borderColor="gray.200" borderWidth="1px" borderRadius="5">
          <TabPanel>
            <UsersDataTable isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <NewUser isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <ChangePassword isDesktop={isDesktop} user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
