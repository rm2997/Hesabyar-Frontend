import {
  FormControl,
  FormLabel,
  HStack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Captions, ScrollText, User } from "lucide-react";
import { useEffect, useState } from "react";

import { MyInputBox } from "../MyInputBox";
import { GetAllUsers } from "../../api/services/userService";

export const ShowUserNotification = ({ id, notification }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [usersData, setUsersData] = useState([]);

  // useEffect(() => {
  //   const fetchUsersData = async () => {
  //     setLoading(true);
  //     const users = await GetAllUsers();
  //     if (!users.success) {
  //       console.log(users.error);
  //       setLoading(false);
  //       return;
  //     }
  //     setUsersData(users.data);
  //     setLoading(false);
  //   };

  //   fetchUsersData();
  // }, [id]);

  useEffect(() => {
    const loadData = async () => {
      // const notification = notifications.find((n) => n.id == id);

      setFormData(notification);
    };
    loadData();
  }, [id]);

  return (
    <VStack
      as="form"
      rowGap={3}
      columnGap={5}
      dir="rtl"
      filter={loading ? "blur(10px)" : ""}
    >
      <FormControl>
        <HStack>
          <FormLabel width={110}>عنوان</FormLabel>
          <MyInputBox
            readonly
            size={19}
            icon={Captions}
            name="title"
            title="عنوان"
            value={formData?.title}
          />
        </HStack>
      </FormControl>

      <FormControl>
        <HStack>
          <FormLabel width={110}>گیرنده</FormLabel>
          <MyInputBox
            readonly
            size={19}
            icon={User}
            title="گیرنده"
            name="toUser"
            value={formData?.toUser?.userfname}
          />
        </HStack>
      </FormControl>
      <FormControl>
        <HStack>
          <FormLabel width={110}>محتوا</FormLabel>
          <Textarea
            overflowWrap="normal"
            overflow="auto"
            readonly
            size={19}
            icon={ScrollText}
            title="محتوا"
            name="message"
            value={formData?.message}
          />
        </HStack>
      </FormControl>
    </VStack>
  );
};
