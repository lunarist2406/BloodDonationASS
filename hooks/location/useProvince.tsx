import { useEffect, useState } from "react";
import axios from "axios";
export type Ward = {
  code: string;
  name: string;
};

export type District = {
  code: string;
  name: string;
  wards: Ward[];
};

export type Province = {
  code: string;
  name: string;
  districts: District[];
};

export default function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => {
        setProvinces(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch provinces:", err);
        setLoading(false);
      });
  }, []);

  return { provinces, loading };
}
