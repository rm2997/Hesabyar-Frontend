import {
  AbsoluteCenter,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Captions, Hash, ScrollText, User } from "lucide-react";
import { useEffect, useState } from "react";
import { MyLoading } from "../MyLoading";
import { MyInputBox } from "../MyInputBox";
import { ShowNotifictionById } from "../../api/services/notificationService";
import { GetAllUsers } from "../../api/services/userService";

export const ShowUserNotification = ({ id, notifications, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        GetAllUsers().then((res) => {
          setUsersData(res.data);
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      const notification = notifications.find((n) => n.id === id);
      setFormData(notification);
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <AbsoluteCenter>
        <Spinner size="xl" colorScheme="red" />
      </AbsoluteCenter>
    );

  return (
    <VStack as="form" spacing={5} dir="rtl">
      {loading} && <MyLoading />
      <FormControl isDisabled>
        <HStack>
          <FormLabel width={110}>عنوان</FormLabel>
          <MyInputBox
            size={19}
            icon={Captions}
            name="title"
            title="عنوان"
            value={formData?.title}
          />
        </HStack>
      </FormControl>
      <FormControl isDisabled>
        <HStack>
          <FormLabel width={110}>محتوا</FormLabel>
          <MyInputBox
            size={19}
            icon={ScrollText}
            title="محتوا"
            name="message"
            value={formData?.message}
          />
        </HStack>
      </FormControl>
      <FormControl isDisabled>
        <HStack>
          <FormLabel width={110}>گیرنده</FormLabel>
          <MyInputBox
            size={19}
            icon={User}
            title="گیرنده"
            name="toUser"
            value={formData?.toUser?.userfname}
          />
        </HStack>
      </FormControl>
    </VStack>
  );
};
