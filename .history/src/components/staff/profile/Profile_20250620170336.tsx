import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUser, IconHeartbeat, IconHistory } from "@tabler/icons-react";
import ProfileAccount from "./ProfileAccount";
// import ProfileHealth from "./ProfileHealth";
import HistoryDonation from "./History";
import useUser from "../../../hooks/User/useUser";

const profileTabs = [
  {
    key: "account",
    label: "Tài khoản",
    icon: <IconUser size={18} />,
    component: <ProfileAccount />,
  },
  {
    key: "health",
    label: "Sức khỏe",
    icon: <IconHeartbeat size={18} />,
    component: <ProfileHealth />,
  },
  {
    key: "history",
    label: "Lịch sử hiến máu",
    icon: <IconHistory size={18} />,
    component: <HistoryDonation />,
  },
];

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("account");
  const { userData } = useUser();

  const currentTab = profileTabs.find(
    (tab) => tab.key === selectedTab
  )?.component;

  return (
    <div className="p-6">
      {/* Header title */}
      <motion.h4
        initial={{ x: 0, color: "#ef4444" }}
        whileHover={{ x: 8, color: "#f87171" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-lg font-bold flex items-center gap-2 mb-6 text-red-500"
      >
        <IconUser size={24} className="text-red-500" />
        Thông Tin Cá Nhân
      </motion.h4>

      {/* Main layout: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-20 gap-6">
        {/* LEFT CONTENT: 3/5 width */}
        <div className="col-span-1 lg:col-span-13">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-red-400 to-red-700 rounded-xl shadow-md p-4"
            >
              {currentTab}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR: 2/5 width */}
        <div className="col-span-1 lg:col-span-7">
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-6 justify-end">
            {profileTabs.map((tab) => (
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

          {/* Avatar + Info */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <img
              src={`https://ui-avatars.com/api/?name=${userData?.data.fullname}&background=ff0000&color=fff&size=128`}
              alt="avatar"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold">{userData?.data.fullname}</h2>
            <p className="text-gray-600 mb-2">{userData?.data.email}</p>
            <p className="text-red-500 font-bold">Số lần hiến máu: 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
