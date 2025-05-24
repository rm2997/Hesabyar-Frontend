import {
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { ChangePassword } from "../../my-components/users/ChangePassword";
import { NewUser } from "../../my-components/users/NewUser";
import { useEffect, useState } from "react";
import { GetAllUsers } from "../../api/services/userService";
import { UsersDataTable } from "../../my-components/users/UsersDataTable";

export const Users = ({ isDesktop }) => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const loadUsersData = () => {
      setLoading(true);
      GetAllUsers()
        .then((res) => {
          if (!res.data) return;
          setUsersData(res.data);
        })
        .catch((err) =>
          toast({
            title: "خطایی رخ داد",
            description: `${err}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        )
        .finally(setLoading(false));
    };
    loadUsersData();
  }, []);
  return (
    <SimpleGrid>
      <Tabs
        borderWidth="1px"
        isFitted
        bg=""
        color="black"
        align="start"
        colorScheme=""
        variant="enclosed"
      >
        <TabList borderColor="green">
          <Tab>کاربر جدید</Tab>
          <Tab>تغییر کلمه عبور</Tab>
          <Tab>کاربران</Tab>
        </TabList>
        <TabPanels borderColor="green" borderWidth="1px">
          <TabPanel>
            <NewUser isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <ChangePassword isDesktop={isDesktop} />
          </TabPanel>
          <TabPanel>
            <UsersDataTable isDesktop={isDesktop} DataRows={usersData} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
