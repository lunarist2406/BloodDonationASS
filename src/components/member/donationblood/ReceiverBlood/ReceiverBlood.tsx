import TableReceiverBlood from "./TableReceiver";
import FormViewReceiver from "./FormViewReceiver";
import { motion } from "framer-motion";
import { IconDroplet } from "@tabler/icons-react";
export default function ReceiverBlood() {

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <motion.h4
        initial={{ x: 0, color: "#000" }} 
        whileHover={{ x: 8, color: "#f43f5e" }} 
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 ml-5 pt-5"
      >
        <IconDroplet size={20} className="text-red-500" />
        Bảng Người Nhận Máu
      </motion.h4>
      <div className="grid grid-cols-20 gap-4 px-5 mb-10">
        <div className="col-span-7">
          <TableReceiverBlood />
        </div>
        <div className="col-span-13">
          <FormViewReceiver  />
        </div>
      </div>
    </div>
  );
}
