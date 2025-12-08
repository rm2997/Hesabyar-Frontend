import { Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import jalali from "jalali-dayjs";

export const ShowUserNotification = ({ id, notification }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [usersData, setUsersData] = useState([]);
  dayjs.extend(jalali);
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
    <Flex direction="column" rowGap={5} filter={loading ? "blur(10px)" : ""}>
      <Flex p={2} justify="space-between" columnGap={2}>
        <Text fontFamily="iransans">عنوان :</Text>
        <Text fontFamily="iransans">{formData?.title}</Text>
      </Flex>
      <Divider />
      <Flex p={2} justify="space-between" columnGap={2}>
        <Text fontFamily="IranSans">تاریخ :</Text>
        <Text fontFamily="IranSans">
          {dayjs(formData?.createdAt).locale("fa").format("YYYY/MM/DD")}
        </Text>
      </Flex>
      <Divider />
      <Flex p={2} justify="space-between" columnGap={2}>
        <Text fontFamily="IranSans"> محتوا :</Text>
        <Text maxW="200px" fontFamily="IranSans">
          {formData?.message}
        </Text>
      </Flex>
    </Flex>
  );
};
