import { useEffect, useState } from "react";
import { useAuth } from "../User/useAuth";
export interface StatusHealth {
  height: string;
  weight: string;
  bloodPressure: string;
  medicalHistory: string;
  currentCondition: string;
  medication: string;
  lastDonationDate: string;
  diseases: string[];
  imgHealth: string; // link ảnh giấy khám sức khỏe
}
export interface RegisterBlood {
  id: number;
  username: string;
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  roleDonation: string;
  location: string;
  bloodType: string;
  statusHealth: StatusHealth;
  status: string;
  level: string;
  hospital: string;
  cccd: string; // link ảnh CCCD
}
export const registerBlood = [
  {
    id: 1,
    username: "VanA",
    fullName: "Nguyen Van A",
    dob: "1990-01-01",
    phone: "0915461265",
    email: "nguyenvana@gmail.com",
    roleDonation: "Người Hiến Máu",
    location: "TPHCM",
    bloodType: "A",
    statusHealth: {
      height: "170cm",
      weight: "65kg",
      bloodPressure: "120/80",
      medicalHistory: "Không có tiền sử bệnh nghiêm trọng",
      currentCondition: "Khỏe mạnh",
      medication: "Không sử dụng thuốc",
      lastDonationDate: "2024-12-15",
      diseases: [
        "Không mắc bệnh nào",
        "Tim mạch",
        "Tiểu đường",
        "Viêm gan B/C",
        "HIV/AIDS",
      ],
      imgHealth: "https://example.com/health.jpg",
    },
    cccd: "https://example.com/cccd_front.jpg",
    status: "Đang chờ xác nhận",
    level: "",
    hospital: "",
  },
];

export const useRegisterBlood = () => {
  const { user } = useAuth();
  const [waitingList, setWaitingList] =
    useState<RegisterBlood[]>(registerBlood);
  const [formData, setFormData] = useState({
    id: user?.user_id,
    fullName: user?.fullname,
    dob: "",
    phone: "",
    email: "",
    roleDonation: "",
    location: "",
    bloodType: "",
    cccd: "",
    statusHealth: {
      height: "",
      weight: "",
      bloodPressure: "",
      medicalHistory: "",
      currentCondition: "",
      medication: "",
      lastDonationDate: "",
      imgHealth: "",
    },
    level: "",
    status: "",
    hospital: "",
  });
  useEffect(() => {
    // Gán dữ liệu mẫu khi load lần đầu
    setWaitingList(registerBlood);
  }, []);
  return {
    waitingList,
    setWaitingList,
    formData,
    setFormData,
  };
};
