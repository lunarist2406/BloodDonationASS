import { useState } from "react";
import { Checkbox, Divider } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  { id: 1, type: "hien", name: "Nguyễn Văn A - Đăng ký hiến máu" },
  { id: 2, type: "can", name: "Trần Thị B - Cần máu khẩn cấp" },
  { id: 3, type: "lichsu", name: "Lê Văn C - Đã hiến và cần máu" },
  { id: 4, type: "hien", name: "Phạm Thị D - Đăng ký hiến máu" },
];

export default function FilterInformation() {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleChange = (checkedValues) => {
    setSelectedTypes(checkedValues);
  };

  const filteredData = data.filter((item) =>
    selectedTypes.length === 0 ? true : selectedTypes.includes(item.type)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto ">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Bộ lọc thông tin
      </h2>

      <Checkbox.Group
        style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
        onChange={handleChange}
      >
        <Checkbox value="hien">Đã đăng ký hiến máu</Checkbox>
        <Checkbox value="can">Đăng ký cần máu</Checkbox>
        <Checkbox value="lichsu">Đã hiến & cần máu</Checkbox>
      </Checkbox.Group>

      <Divider />

      <AnimatePresence>
        {filteredData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 p-4 rounded-md mb-3 shadow-sm border border-red-200"
          >
            {item.name}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
