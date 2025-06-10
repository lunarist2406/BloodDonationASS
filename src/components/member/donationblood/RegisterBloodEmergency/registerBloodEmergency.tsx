import {
  IconUser,
  IconCalendar,
  IconPhone,
  IconMapPin,
  IconDroplet,
  IconClock,
  IconUserCircle,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterBlood } from "../../../../hooks/RegistrationForm/useRegisterBlood";
import { useState } from "react";
import FormRegisterBloodEmergency from "./FormRegisterBlood";
import FormHealthEmergency from "./FormHealth";

export default function RegisterBloodEmergency() {
  interface MyProps {
    label: string;
    icon: React.ElementType;
    delay?: number;
  }
  const { waitingList, setWaitingList, formData, setFormData } =
    useRegisterBlood();
  const [currentStep, setCurrentStep] = useState<"health" | "register">(
    "health"
  );
  console.log("📋 Current waitingList:", waitingList);
  console.log("📋 Current formData:", formData);
  const MotionTh = ({ label, icon: Icon, delay }: MyProps) => (
    <motion.th
      className="border px-3 py-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-center gap-1 text-sm font-semibold text-red-800">
        <Icon size={16} />
        {label}
      </div>
    </motion.th>
  );

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <div className="grid grid-cols-20 gap-4 px-5 mt-10 mb-10">
        {/* Form */}
        <div className="col-span-7">
          <AnimatePresence mode="wait">
            {currentStep === "health" ? (
              <motion.div
                key="form-health"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setCurrentStep("register")}
                  className="mb-5 px-32 py-2 bg-red-500 text-white rounded items-center gap-2 flex"
                >
                  {" "}
                  Đăng ký hiến máu khẩn cấp
                  <IconChevronRight size={20} />
                </button>
                <FormHealthEmergency
                  formData={formData}
                  setFormData={setFormData}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form-register"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setCurrentStep("health")}
                  className="mb-5 px-34 py-2 bg-red-500 text-white rounded items-center gap-2 flex"
                >
                  {" "}
                  <IconChevronLeft size={20} />
                  Điền Thông Tin Sức Khỏe
                </button>
                <FormRegisterBloodEmergency
                  formData={formData}
                  setFormData={setFormData}
                  setWaitingList={setWaitingList}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          className="col-span-13"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-4 overflow-auto h-full">
            <h2 className="text-2xl font-bold mb-4 text-red-700 flex items-center gap-2">
              <IconClock size={24} className="text-red-700" />
              Thông Tin Đã Đăng Ký
            </h2>
            <table className="w-full table-auto border-collapse text-center text-sm  ">
              <thead>
                <tr className="bg-red-200 text-red-800 ">
                  <MotionTh label="STT" icon={IconClock} delay={0} />
                  <MotionTh label="Họ tên" icon={IconUser} delay={0.05} />
                  <MotionTh label="Ngày sinh" icon={IconCalendar} delay={0.1} />
                  <MotionTh label="SĐT" icon={IconPhone} delay={0.15} />
                  <MotionTh label="Vai trò" icon={IconUserCircle} delay={0.2} />
                  <MotionTh label="Nhóm máu" icon={IconDroplet} delay={0.25} />
                  <MotionTh label="Địa điểm" icon={IconMapPin} delay={0.3} />
                  <MotionTh label="Trạng thái" icon={IconClock} delay={0.35} />
                </tr>
              </thead>
              <tbody>
                {waitingList.map((item, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-red-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{item.fullName}</td>
                    <td className="border px-3 py-2">{item.dob}</td>
                    <td className="border px-3 py-2">{item.phone}</td>
                    <td className="border px-3 py-2">{item.roleDonation}</td>
                    <td className="border px-3 py-2">{item.bloodType}</td>
                    <td className="border px-3 py-2">{item.location}</td>
                    <td className="border px-3 py-2 text-orange-500 font-semibold">
                      {item.status}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
