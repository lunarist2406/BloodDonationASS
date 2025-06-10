import { motion, AnimatePresence } from "framer-motion";
import type { BloodDonationData } from "../../../../hooks/useBloodDonationFilter";
interface FormViewFilterProps {
  data: BloodDonationData[];
}

export const FormViewFilter = ({ data }: FormViewFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="bg-gradient-to-b from-red-500 to-black p-6 rounded-lg shadow-md h-[100%]"
    >
      <h2 className="text-xl font-semibold mb-4 text-red-100">
        Danh Sách Tìm Kiếm
      </h2>
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.05,
              }}
              className="p-4 bg-white rounded-lg shadow border border-red-200"
            >
              <p className="font-semibold text-gray-800">
                {index + 1}. {item.name}
              </p>
              <p className="text-sm text-gray-500 italic">
                Vai trò:{" "}
                {item.type === "hien"
                  ? "Hiến máu"
                  : item.type === "can"
                  ? "Cần máu"
                  : "Đã hiến và cần máu"}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};