import { useState } from "react";
import { useAuth } from "../User/useAuth";

export interface FormHealth {
  user_id: string;
  blood_id: string;
  height: number;
  weight: number;
  blood_pressure: number;
  medical_history: string;
  latest_donate: string | null;
  status_health: string;
  img_health: string;
}

export default function useFormHealth() {
  const { user } = useAuth();
  const [formHealth, setFormHealth] = useState<FormHealth>({
    user_id: user?.user_id ?? "",
    blood_id: "",
    height: 0,
    weight: 0,
    blood_pressure: 0,
    medical_history: "",
    
    latest_donate: "",
    status_health: "",
    img_health: "",
  });

  return {
    formHealth,
    setFormHealth,
  };
}
