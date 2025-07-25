import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconNews,
  IconClock,
  IconDroplet,
  IconHeartHandshake,
} from "@tabler/icons-react";

import NewsManagement from "./News/NewsManagement";
import WorkingTimeManagement from "./WorkingTimeManagement/WorkingTimeManagement";
import BloodManagement from "./Blood/BloodManagement";

const tabList = [
  {
    key: "news",
    label: "Tin Tức",
    icon: <IconNews size={18} />,
    component: <NewsManagement />,
  },
  {
    key: "workingTime",
    label: "Thời Gian Làm Việc",
    icon: <IconClock size={18} />,
    component: <WorkingTimeManagement />,
  },
  {
    key: "blood",
    label: "Blood",
    icon: <IconDroplet size={18} />,
    component: <BloodManagement />,
  },
];

export default function BusinessSystems() {
  const [selectedTab, setSelectedTab] = useState("news");

  const currentTab = tabList.find((tab) => tab.key === selectedTab)?.component;

  return (
    <div className="p-6">
      {/* Title with motion */}
      <motion.h2
        initial={{ x: 0, color: "#000" }}
        whileHover={{ x: 8, color: "#f43f5e" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 "
      >
        <IconHeartHandshake size={20} className="text-red-500" />
        Quản Lý Đơn Vị Kho Máu Trung Tâm
      </motion.h2>

      {/* Tab selection */}
      <div className="flex flex-wrap gap-4 mb-6">
        {tabList.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
              selectedTab === tab.key
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab content with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-black via-red-400 to-black rounded-2xl"
        >
          {currentTab}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
