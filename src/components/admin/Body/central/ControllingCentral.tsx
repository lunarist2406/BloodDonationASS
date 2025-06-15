import { useState } from "react";
import TableCentral from "./TableCentral";
import GoogleMapCentral from "./GoogleMapCentral";
import { motion } from "framer-motion";

import { IconBuildingBank } from "@tabler/icons-react";

export default function ControllingCentral() {
  const [selectedCentral, setSelectedCentral] = useState<any>(null);

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen px-5 pt-5">
      <motion.h4
        initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
        whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 mb-8"
      >
        <IconBuildingBank size={20} className="text-red-500" />
        Quản Lý Trung Tâm Hiến Máu
      </motion.h4>

      <div className="flex gap-4 mb-10 h-full">
        <div className="flex-1 max-w-[30%] rounded-lg shadow p-4 bg-white">
          <GoogleMapCentral central={selectedCentral} />
        </div>
        <div className="flex-[2] bg-white rounded-lg shadow p-4">
          <TableCentral onSelectCentral={setSelectedCentral} />
        </div>
      </div>
    </div>
  );
}
