import { useEffect, useState } from "react";
import type { FormHealth } from "../HealthInfor/useFormHealth";
import { api } from "../../components/config/axios/axiosInstance";

export interface viewDonationBlood {
  donate_id: string;
  blood_id: string;
  date_register: string;
  date_donation: string;
  ml: number;
  unit: number;
  status_regist: string;
  status_receiver: string;
  infor_health: FormHealth;
  centralBlood_id: number;
  createdAt: string;
  updatedAt: string;
}
export default function useDonationView() {
  const { viewBlood, setViewBlood } = useState<viewDonationBlood>();
  const 
  useEffect(() => {
    const response = api.get("localhost:3000/api/v1/donate-bloods",);
  });
  return <div></div>;
}
