import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ControllingDonate from "../staff/ControllingDonation/ControllingDonation";

// Lazy load components
const HomePage = lazy(() => import("../../page/HomePage"));
const BusinessSystems = lazy(() => import("../staff/BusinessSystem/BusinessSystem"));

export default function StaffR() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <Routes>
        <Route path="/*">
          <Route index element={<HomePage />} />
          <Route path=":staff" element={<HomePage />} />
          <Route path="donate-controlling" element={<ControllingDonate />} />

          <Route path="business-systems" element={<BusinessSystems />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
