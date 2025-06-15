import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useUser from "../../../../hooks/User/useUser";
import { IconUsers, IconMapPin } from "@tabler/icons-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#B620E0",
  "#8884D8",
  "#FF69B4",
  "#A52A2A",
  "#40E0D0",
  "#FFD700",
  "#DC143C",
  "#7FFF00",
];

export default function ChartUser() {
  const { fetchAllUsers } = useUser();
  const [roleData, setRoleData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [districtData, setDistrictData] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    fetchAllUsers(1, 1000).then((res) => {
      if (res?.data?.result) {
        const users = res.data.result;

        const roleCounts = users.reduce(
          (acc: Record<string, number>, user: any) => {
            const role = user.role_id?.role_name || "UNKNOWN";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
          },
          {}
        );
        setRoleData(
          Object.entries(roleCounts).map(([name, value]) => ({ name, value }))
        );

        const districtCounts = users.reduce(
          (acc: Record<string, number>, user: any) => {
            const district = user.location_id?.district?.trim() || "UNKNOWN";
            acc[district] = (acc[district] || 0) + 1;
            return acc;
          },
          {}
        );
        setDistrictData(
          Object.entries(districtCounts).map(([name, value]) => ({
            name,
            value,
          }))
        );
      }
    });
  }, []);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderChart = (
    title: string,
    data: { name: string; value: number }[],
    Icon: React.FC<{ size?: number; color?: string }>
  ) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2 justify-center">
          <Icon size={18} color="#4B5563" />
          {title}
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const percent = ((value / total) * 100).toFixed(1);
                return [`${value} (${percent}%)`, name];
              }}
              contentStyle={{ fontSize: "10px" }}
              itemStyle={{ fontSize: "10px" }}
              labelStyle={{ fontSize: "10px" }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              iconSize={10}
              wrapperStyle={{
                fontSize: "10px",
                marginTop: "4px",
                textAlign: "center",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="col-span-6 flex flex-col gap-4 items-center justify-center">
      {renderChart("Phân Bố Vai Trò Người Dùng", roleData, IconUsers)}
      {renderChart("Phân Bố Người Dùng Theo Quận", districtData, IconMapPin)}
    </div>
  );
}
