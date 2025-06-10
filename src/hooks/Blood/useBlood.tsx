import { useEffect, useState } from "react";
import useBloodService from "./useBloodService";

export interface RhType {
  rh_id: number;
  blood_Rh: string;
}
export interface BloodType {
  blood_type_id: number;
  blood_name: string;
}
export interface Blood {
  blood_id: string;
  blood_type_id: BloodType;
  rh_id: RhType;
}
export interface ResultBlood {
  result: Blood[]; // <-- Là một mảng!
}
export interface DataBlood {
  data: ResultBlood;
}

export default function useBlood() {
  const [blood, setBlood] = useState<DataBlood>();
  const { getAllBloods } = useBloodService();

  useEffect(() => {
    const fetchBlood = async () => {
      const response = await getAllBloods();
      console.log("Dữ liệu API:", response); // Debug
      setBlood(response as DataBlood);
    };
    fetchBlood();
  }, []);

  return { blood, setBlood };
}
