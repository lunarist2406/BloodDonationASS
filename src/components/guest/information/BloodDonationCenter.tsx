import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconMapPin,
  IconPhone,
  IconClock,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";
// import GuestHeader from "../header/Header";
// import GuestFooter from "../footer/GuestFooter";
import { IconBuilding } from "@tabler/icons-react";

// Import centers data from the new file
import { centers } from "./donationCentersData";

export default function BloodDonationCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      selectedCity === "all" || center.address.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Nội dung giới thiệu */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-2 mb-2">
            <IconBuilding size={32} className="text-red-700" />
            Tìm kiếm cơ sở hiến máu gần bạn nhất
          </h1>
          <p className="text-gray-700 text-lg">
            Chúng tôi cung cấp thông tin chi tiết về các loại hiến tặng trung
            tâm trên toàn quốc
          </p>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm cơ sở hiến máu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Tất cả thành phố</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                {/* Thêm các thành phố khác */}
              </select>
            </div>
          </div>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredCenters.map((center) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-40 overflow-hidden relative group">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {center.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <IconMapPin className="text-red-500 mt-1 mr-2" />
                      <span className="text-gray-600">{center.address}</span>
                    </div>
                    <div className="flex items-center">
                      <IconPhone className="text-red-500 mr-2" />
                      <span className="text-gray-600">{center.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <IconMail className="text-red-500 mr-2" />
                      <span className="text-gray-600">{center.email}</span>
                    </div>
                    <div className="flex items-center">
                      <IconClock className="text-red-500 mr-2" />
                      <span className="text-gray-600">
                        {center.workingHours}
                      </span>
                    </div>
                  </div>
                  {/* <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-900 text-white py-2 rounded-lg font-semibold"
                  >
                    Xem chi tiết
                  </motion.button> */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}