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
import FormHealth from "../FormHealth";
import ReceiverTable from "./ReceiverTable";

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
      <motion.h4
        initial={{ x: 0, color: "#000" }} // màu mặc định (đen)
        whileHover={{ x: 8, color: "#f43f5e" }} // màu đỏ khi hover
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 ml-5 pt-5"
      >
        <IconDroplet size={20} className="text-red-500" />
        Đăng Ký Nhận Máu Khẩn Cấp
      </motion.h4>
      <div className="grid grid-cols-20 gap-4 px-5 mb-10">
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
                  <span className="text-white">Đăng ký hiến máu khẩn cấp</span>
                  <IconChevronRight
                    size={20}
                    stroke={2}
                    className="cursor-pointer"
                    color="white"
                  />
                </button>
                <FormHealth />
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
                  <IconChevronLeft
                    size={20}
                    stroke={2}
                    className="cursor-pointer"
                    color="white"
                  />
                  <span className="text-white"> Điền Thông Tin Sức Khỏe </span>
                </button>
                <FormRegisterBloodEmergency
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="col-span-13">
            <ReceiverTable/>
        </div>
      </div>
    </div>
  );
}
