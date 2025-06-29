import { useContext } from "react";
import { HealthContext } from "./useHealthContext";

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth phải được dùng trong HealthProvider");
  }
  return context;
};
