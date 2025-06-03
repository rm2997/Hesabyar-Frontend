// components/PieChart.jsx
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ShowUserAllProformas } from "../api/services/proformaService";
import { ShowUserAllInvoices } from "../api/services/invoiceService";
import {
  ShowUserAllNotifications,
  ShowUserRcvAllNotifications,
} from "../api/services/notificationService";

// const data = [
//   { name: "بیش فاکتورها", value: 400 },
//   { name: "فاکتورها", value: 300 },
//   { name: "ورودی انبار", value: 300 },
//   { name: "خروجی انبار", value: 200 },
// ];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const PieChart = ({ sidebarWidth }) => {
  const [pieData, setPieData] = useState([]);
  const [showPie, setShowPie] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = [];
      await ShowUserAllProformas().then((p) =>
        data.push({ name: "پیش فاکتورها", value: p?.data?.total })
      );
      await ShowUserAllInvoices().then((i) =>
        data.push({ name: "فاکتورها", value: i?.data?.total })
      );
      await ShowUserRcvAllNotifications(1, 10, "").then((n) =>
        data.push({ name: "پیام های دریافتی", value: n?.data?.total })
      );
      await ShowUserRcvAllNotifications(1, 10, "").then((n) =>
        data.push({ name: "پیام های ارسالی", value: n?.data?.total })
      );
      setPieData(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (sidebarWidth === 300) setShowPie(false);
    else setShowPie(true);
  }, [sidebarWidth]);

  if (pieData)
    return (
      <Box
        mt={3}
        h="300px"
        w="100%"
        bg="gray.700"
        p={4}
        borderRadius="md"
        hidden={showPie}
      >
        <Text mb={1}>وضعیت</Text>
        <ResponsiveContainer width="100%" height="70%">
          <RechartPieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={6}
              fill="#8884d8"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </RechartPieChart>
        </ResponsiveContainer>
      </Box>
    );
};
