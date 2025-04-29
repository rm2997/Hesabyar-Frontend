import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  useToast,
  VStack,
  Icon,
} from "@chakra-ui/react";
import {
  Captions,
  DollarSign,
  Hash,
  IdCard,
  ScrollText,
  UserSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MyLoading } from "./MyLoading";
import { MyInputBox } from "./MyInputBox";
import { ShowNotifictionById } from "../api/services/notificationService";
import { GetAllUsers } from "../api/services/userService";

export const ShowUserNotification = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [usersData, setUsersData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const loadFormData = async (id) => {
      setLoading(true);
      try {
        const response = await ShowNotifictionById(id);
        if (!response.data) return;
        setFormData(...response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsersData = async () => {
      setLoading(true);
      const response = await GetAllUsers();
      const result = response.data;
      setUsersData(result);
      setLoading(false);
    };
    fetchUsersData();
    loadFormData(id);
    setLoading(false);
  }, [id]);

  const handleChangeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <VStack as="form" spacing={5} dir="rtl">
      {loading} && <MyLoading />
      <FormControl isRequired isDisabled>
        <HStack>
          <FormLabel width={110}>ردیف</FormLabel>
          <MyInputBox
            name="id"
            size={19}
            icon={Hash}
            title="ردیف"
            value={formData.id}
          />
        </HStack>
      </FormControl>
      <FormControl isDisabled isRequired>
        <HStack>
          <FormLabel width={110}>عنوان</FormLabel>
          <MyInputBox
            onChange={(e) => handleChangeFormData(e)}
            size={19}
            icon={Captions}
            name="title"
            title="عنوان"
            value={formData.title}
          />
        </HStack>
      </FormControl>
      <FormControl isDisabled isRequired>
        <HStack>
          <FormLabel width={110}>محتوا</FormLabel>
          <MyInputBox
            size={19}
            icon={ScrollText}
            title="محتوا"
            name="message"
            value={formData.message}
            onChange={handleChangeFormData}
          />
        </HStack>
      </FormControl>
      <FormControl isDisabled isRequired>
        <HStack>
          <FormLabel width={110}>گیرنده</FormLabel>
          <MyInputBox
            size={19}
            icon={ScrollText}
            title="گیرنده"
            name="touser"
            value={formData.touser}
            onChange={handleChangeFormData}
          />
        </HStack>
      </FormControl>
      <HStack>
        <Button colorScheme="blue" onClick={onClose}>
          تایید
        </Button>
      </HStack>
    </VStack>
  );
};
