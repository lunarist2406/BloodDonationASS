import { useEffect, useState } from "react";
import useBloodService from "./useBloodService";
import useBloodTypeService from "./useBloodTypeService";
import useRh from "./useRh";

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
  result: Blood[];
}
export interface DataBlood {
  data: ResultBlood;
}

export default function useBlood() {
  const [blood, setBlood] = useState<DataBlood>();
  const [bloodTypes, setBloodTypes] = useState<BloodType[]>([]);
  const [rhs, setRhs] = useState<RhType[]>([]);

  const { getAllBloods } = useBloodService();
  const { getAllBloodTypes } = useBloodTypeService();
  const { getAllRh } = useRh();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const bloodResponse = await getAllBloods();
        const bloodTypeResponse = await getAllBloodTypes(1, 100) as { data: { result: BloodType[] } };
        const rhResponse = await getAllRh(1, 100) as { data: { result: RhType[] } };

        console.log("Bloods:", bloodResponse);
        console.log("BloodTypes:", bloodTypeResponse);
        console.log("Rhs:", rhResponse);

        setBlood(bloodResponse as DataBlood);
        setBloodTypes(bloodTypeResponse.data.result);
        setRhs(rhResponse.data.result);
      } catch (error) {
        console.error("Lỗi khi fetch toàn bộ dữ liệu:", error);
      }
    };

    fetchAll();
  }, []);

  return {
    blood,
    setBlood,
    bloodTypes,
    setBloodTypes,
    rhs,
    setRhs,
  };
}
