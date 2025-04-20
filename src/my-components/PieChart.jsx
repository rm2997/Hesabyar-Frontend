// components/PieChart.jsx
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Text } from "@chakra-ui/react";

const data = [
  { name: "بیش فاکتورها", value: 400 },
  { name: "فاکتورها", value: 300 },
  { name: "ورودی انبار", value: 300 },
  { name: "خروجی انبار", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const PieChart = () => {
  return (
    <Box h="300px" w="100%" bg="gray.700" p={4} borderRadius="md">
      <Text mb={2}>نمودار دایره‌ای</Text>
      <ResponsiveContainer width="100%" height="100%">
        <RechartPieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
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
