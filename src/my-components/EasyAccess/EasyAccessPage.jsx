import { Flex, IconButton, Text, useBreakpointValue } from "@chakra-ui/react";
import {
  ArrowUpFromLine,
  Boxes,
  Combine,
  DecimalsArrowLeft,
  FileSpreadsheet,
  GalleryHorizontalEnd,
  Layers,
  Layers2,
  ListChecks,
  LucideLayers,
  LucideLayers2,
  Newspaper,
  PackagePlus,
  Plus,
  ShieldUser,
  SquareLibrary,
  SquareStack,
  Users,
  UsersRound,
} from "lucide-react";

import { UserContext } from "../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { GetUserByUserid } from "../../api/services/userService";
import { MyModal } from "../MyModal";
import { ChangePasswordByUser } from "../users/ChangePasswordByUser";

export const EasyAccessPage = ({ onItemClick }) => {
  const { user, setUser } = useContext(UserContext);
  const [showChangePass, setShowChangePass] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const res = await GetUserByUserid(user?.sub);
      if (res?.success) {
        if (res?.data?.mustChangePassword) setShowChangePass(true);
      }
    };
    loadData();
  }, []);
  return (
    <Flex
      fontSize="10px"
      textColor="black"
      p={2}
      direction="column"
      bg="gray.100"
      rowGap={5}
      minH="86vh"
    >
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px">درخواست های تایید</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<ShieldUser />}
              onClick={() => onItemClick("acceptRequest")}
            />
            <Text fontFamily="iransans"> کاربر ارشد</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<ListChecks />}
              onClick={() => onItemClick("wareHouseRequests")}
            />
            <Text fontFamily="iransans"> انبار</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px">پیش فاکتورها</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<FileSpreadsheet />}
              onClick={() => onItemClick("newProforma")}
            />
            <Text fontFamily="iransans"> جدید</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<LucideLayers2 />}
              onClick={() => onItemClick("myProformas")}
            />
            <Text fontFamily="iransans"> سوابق من</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<LucideLayers />}
              onClick={() => onItemClick("allProformas")}
            />
            <Text fontFamily="iransans"> همه</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px"> فاکتورها</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Newspaper />}
              onClick={() => onItemClick("newInvoice")}
            />
            <Text fontFamily="iransans"> جدید</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Layers2 />}
              onClick={() => onItemClick("myInvoices")}
            />
            <Text fontFamily="iransans"> سوابق من</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Layers />}
              onClick={() => onItemClick("allInvoices")}
            />
            <Text fontFamily="iransans"> همه</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px"> انبار</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<DecimalsArrowLeft />}
              onClick={() => onItemClick("newDepotEntery")}
            />
            <Text fontFamily="iransans">ورود کالا</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<SquareStack />}
              onClick={() => onItemClick("depotEntryList")}
            />
            <Text fontFamily="iransans"> سوابق ورود</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Combine />}
              onClick={() => onItemClick("newDepotExit")}
            />
            <Text fontFamily="iransans">خروج کالا</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<GalleryHorizontalEnd />}
              onClick={() => onItemClick("depotExitList")}
            />
            <Text fontFamily="iransans"> سوابق خروج</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px"> مشتریان</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<UsersRound />}
              onClick={() => onItemClick("newCustomer")}
            />
            <Text fontFamily="iransans"> جدید</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Users />}
              onClick={() => onItemClick("customers")}
            />
            <Text fontFamily="iransans"> لیست</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<ArrowUpFromLine />}
              onClick={() => onItemClick("uploadCustomers")}
            />
            <Text fontFamily="iransans"> آپلود</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px"> کالاها</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<PackagePlus />}
              onClick={() => onItemClick("newGood")}
            />
            <Text fontFamily="iransans"> جدید</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Boxes />}
              onClick={() => onItemClick("goods")}
            />
            <Text fontFamily="iransans"> لیست</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<ArrowUpFromLine />}
              onClick={() => onItemClick("uploadGoods")}
            />
            <Text fontFamily="iransans"> آپلود</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        rowGap={1}
        direction="column"
        borderColor="gray.100"
        borderWidth={1}
        borderRadius="md"
        p={1}
        bg="white"
      >
        <Text fontSize="12px"> واحدها</Text>
        <Flex columnGap={3}>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<Plus />}
              onClick={() => onItemClick("newUnit")}
            />
            <Text fontFamily="iransans"> جدید</Text>
          </Flex>
          <Flex alignItems="center" direction="column" p={1}>
            <IconButton
              variant="outline"
              icon={<SquareLibrary />}
              onClick={() => onItemClick("units")}
            />
            <Text fontFamily="iransans"> لیست</Text>
          </Flex>
        </Flex>
      </Flex>
      <MyModal
        isOpen={showChangePass}
        size={isDesktop ? "xl" : "sm"}
        modalHeader={"شما باید کلمه عبور جدیدی انتخاب کنید"}
        onClose={() => setShowChangePass(false)}
      >
        <ChangePasswordByUser />
      </MyModal>
    </Flex>
  );
};
