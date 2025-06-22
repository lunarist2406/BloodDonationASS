
import FormViewDonate from "./FormViewDonate";
import TableDonateBlood from "./TableDonation";
import { motion } from "framer-motion";
import { IconDroplet } from "@tabler/icons-react";
export default function DonateBlood() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <motion.h4
        initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
        whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 ml-5 pt-5"
      >
        <IconDroplet size={20} className="text-red-500" />
        Bảng Đăng Ký Hiến Máu
      </motion.h4>
      <div className="grid grid-cols-20 gap-4 px-5 mb-10">
        {/* Truyền formData để hiển thị */}
        <div className="col-span-6">
          <TableDonateBlood />
        </div>
        <div className="col-span-14">
          <FormViewDonate />
        </div>
      </div>
    </div>
  );
}
