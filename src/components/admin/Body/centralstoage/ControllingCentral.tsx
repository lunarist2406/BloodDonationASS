import { PieChartOutlined } from "@ant-design/icons";
import TableStorage from "./TableStorage";
import ChartStorage from "./ChartStorage";
import { motion } from "framer-motion";
import { IconChartArcs3 } from "@tabler/icons-react";
export default function ControllingCentralStorages() {
  return (
    <div className="p-6">
      <motion.h4
        initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
        whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 mb-8"
      >
        <IconChartArcs3 size={20} className="text-red-500" />
        Quản Lý Trung Tâm Hiến Máu
      </motion.h4>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Chart chiếm 3/10 (30%) */}
        <div className="col-span-1 lg:col-span-4 bg-white p-4 rounded-lg shadow-md ">
          <ChartStorage />
        </div>

        {/* Table chiếm 7/10 (70%) */}
        <div className="col-span-1 lg:col-span-6 bg-white p-4 rounded-lg shadow-md">
          <TableStorage />
        </div>
      </div>
    </div>
  );
}
