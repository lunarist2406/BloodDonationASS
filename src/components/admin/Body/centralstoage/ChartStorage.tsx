import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, message, Button } from "antd";
import useStorage from "../../../../hooks/storage/useStorage";
import useBloodService from "../../../../hooks/Blood/useBloodService";
import { motion, AnimatePresence } from "framer-motion";
import { IconChartPie, IconChartBar } from "@tabler/icons-react";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#8BC34A",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
  "#E91E63",
];

export default function ChartStorage() {
  const { getStorages } = useStorage();
  const { getAllBloods } = useBloodService();
  const [dataPie, setDataPie] = useState<any>([]);
  const [dataBar, setDataBar] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [totalML, setTotalML] = useState<any>(0);
  const [totalUnits, setTotalUnits] = useState<any>(0);
  const [showPie, setShowPie] = useState<any>(true);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const [res, bloodRes] = await Promise.all([
        getStorages(),
        getAllBloods(),
      ]);
      const storages = res.data.result;
      const bloods = bloodRes.data.result;

      const map: { [label: string]: { label: string; unit: number; ml: number } } = {};
      let mlSum = 0;
      let unitSum = 0;

      storages.forEach((item: any) => {
        const blood = bloods.find((b: any) => b.blood_id === item.blood_id);
        if (!blood) return;

        const label = `${blood.blood_type_id?.blood_name || ""} ${
          blood.rh_id?.blood_Rh || ""
        }`;
        const unit = item.unit || 0;
        const mlPerUnit = item.ml || 0;
        const totalItemMl = unit * mlPerUnit;

        if (!map[label]) {
          map[label] = { label, unit: 0, ml: 0 };
        }

        map[label].unit += unit;
        map[label].ml += totalItemMl;

        mlSum += totalItemMl;
        unitSum += unit;
      });

      setTotalML(mlSum);
      setTotalUnits(unitSum);

      const pieData = Object.values(map).map((m) => ({
        name: m.label,
        value: m.unit,
      }));

      const barData = Object.values(map).map((m) => ({
        name: m.label,
        ml: m.ml,
      }));

      setDataPie(pieData);
      setDataBar(barData);
    } catch (err) {
      message.error("Không thể tải dữ liệu biểu đồ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  // Tạo component header chart cho gọn
  const ChartHeader = ({ title }:any) => (
    <div className="flex items-center justify-between mb-4 px-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button
        onClick={() => setShowPie(!showPie)}
        icon={showPie ? <IconChartBar size={16} /> : <IconChartPie size={16} />}
        size="small"
      >
        {showPie ? "Xem biểu đồ cột" : "Xem biểu đồ tròn"}
      </Button>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6 relative">
      {/* Container cố định chiều cao và ẩn overflow */}
      <div style={{ height: 500, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          {showPie ? (
            <motion.div
              key="pie"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", width: "100%" }}
            >
              <Card
                loading={loading}
                className="w-full"
              >
                <ChartHeader title="Tỷ lệ các loại máu (Unit)" />
                <div className="w-full h-[400px] px-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataPie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {dataPie.map((_:any, index:any) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="bar"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", width: "100%" }}
            >
              <Card
                loading={loading}
                className="w-full"
                bodyStyle={{ padding: 0 }}
              >
                <ChartHeader title="Tổng thể tích máu (ML) theo nhóm máu" />
                <div className="flex justify-between px-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Tổng thể tích máu (mL)
                    </p>
                    <p className="text-xl font-semibold text-red-600">
                      {totalML.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Tổng đơn vị máu</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {totalUnits.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="w-full h-[350px] px-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dataBar}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="ml" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
