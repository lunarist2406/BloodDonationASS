import { Routes, Route } from "react-router-dom";
import HomePage from "../../page/HomePage";
import BusinessSystems from "../staff/BusinessSystem/BusinessSystem";

export default function StaffR() {
  return (
    <Routes>
      <Route path="/*">
        <Route index element={<HomePage />} />
        <Route path=":staff" element={<HomePage />} />
        <Route path="business-systems" element={<BusinessSystems />} />
      </Route>
    </Routes>
  );
}