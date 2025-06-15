import { motion } from "framer-motion";
import { IconUser } from "@tabler/icons-react";
import ChartUser from "./ChartUser";
import TableControlling from "./TableControlling";

export default function ControllingUser() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen px-5 pt-10">
      <motion.h1
        className="flex items-center gap-2 text-3xl font-bold text-gray-800 mb-6 text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <IconUser size={32} />
        Quản lý người dùng
      </motion.h1>

      <div className="flex gap-4 mb-10 h-full">
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
