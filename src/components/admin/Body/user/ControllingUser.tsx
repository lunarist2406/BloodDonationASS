import { IconUser } from "@tabler/icons-react";
import { motion } from "framer-motion";

import TableControlling from "./TableControlling";
import ChartUser from "./ChartUser";

export default function ControllingUser() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen px-5 pt-5">
      <motion.h4
        initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
        whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 mb-8"
      >
        <IconUser size={20} className="text-red-500" />
        Quản Lý Người Dùng
      </motion.h4>

      <div className="flex gap-4 mb-5 h-full">
        <div className="flex-1 max-w-[30%] rounded-lg shadow p-4 bg-white">
          <ChartUser />
        </div>
        <div className="flex-[2] bg-white rounded-lg shadow p-4">
          <TableControlling />
        </div>
      </div>
    </div>
  );
}
