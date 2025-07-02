import { motion } from "framer-motion";
import { IconTruckDelivery } from "@tabler/icons-react";
import TableExportBlood from "./TableBloodExport";

export default function ControllingExportBlood() {
  return (
    <div className="p-6">
      <motion.h4
        initial={{ x: 0, color: "#000" }}
        whileHover={{ x: 8, color: "#f43f5e" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 mb-8"
      >
        <IconTruckDelivery size={20} className="text-red-500" />
        Quản Lý Xuất Máu
      </motion.h4>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <TableExportBlood />
      </div>
    </div>
  );
}
