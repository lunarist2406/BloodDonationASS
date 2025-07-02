import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ControllingDonate from "../staff/ControllingDonation/ControllingDonation";
import StaffProfile from "../staff/profile/Profile";
import ControllingStorage from "../staff/ControllingStorage/ControllingStorage";
import ControllingHealth from "../staff/ControllingHealth/ControllingHealth";
import ControllingReceiver from "../staff/ControllingReceiver/ControllingReceiver";
import ControllingExportBlood from "../staff/bloodExport/ControllingBloodExport";

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
          <Route path="receiver-controlling" element={<ControllingReceiver />} />

          <Route path="health-controlling" element={<ControllingHealth />} />

          <Route path="storage-controlling" element={<ControllingStorage />} />

          <Route path="staff-profile" element={<StaffProfile />} />

          <Route path="business-systems" element={<BusinessSystems />} />

          <Route path="controlling-blood-export" element={<ControllingExportBlood />} />

        </Route>
      </Routes>
    </Suspense>
  );
}
