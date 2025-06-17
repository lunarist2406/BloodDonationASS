import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { ProtectedRoute } from "../../middleware/auth/ProtectedRoute";

// Lazy load các page
const HomePage = lazy(() => import("../../page/HomePage"));
const BloodDonationCenter = lazy(() => import("../member/information/BloodDonationCenter"));
const BloodDocuments = lazy(() => import("../member/information/BloodDocuments"));
const BloodNews = lazy(() => import("../member/information/BloodNews"));
const BloodExperience = lazy(() => import("../member/information/BloodExperience"));
const RegisterBlood = lazy(() => import("../member/donationblood/RegisterBlood/registerBlood"));
const RegisterBloodEmergency = lazy(() => import("../member/donationblood/RegisterBloodEmergency/registerBloodEmergency"));
const DonateBlood = lazy(() => import("../member/donationblood/DonateBlood/DonateBlood"));
const ReceiverBlood = lazy(() => import("../member/donationblood/ReceiverBlood/ReceiverBlood"));
const SeekInformation = lazy(() =>
  import("../member/donationblood/SearchingInformation/SeekInformation").then(
    (module) => ({ default: module.SeekInformation }) // 👈 lấy đúng cái named export
  )
);
const MemberR: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/*">
        <Route index element={<HomePage />} />
        <Route path=":user" element={<HomePage />} />
        <Route path="blood-donation-centers" element={<BloodDonationCenter />} />
        <Route path="blood-documents" element={<BloodDocuments />} />
        <Route path="blood-news" element={<BloodNews />} />
        <Route path="blood-experience" element={<BloodExperience />} />
        <Route
          path="register-blood"
          element={
            <ProtectedRoute>
              <RegisterBlood />
            </ProtectedRoute>
          }
        />
        <Route
          path="register-blood-emergency"
          element={
            <ProtectedRoute>
              <RegisterBloodEmergency />
            </ProtectedRoute>
          }
        />
        <Route
          path="donation-blood"
          element={
            <ProtectedRoute>
              <DonateBlood />
            </ProtectedRoute>
          }
        />
        <Route
          path="receiver-blood"
          element={
            <ProtectedRoute>
              <ReceiverBlood />
            </ProtectedRoute>
          }
        />
        <Route
          path="seek-information"
          element={
            <ProtectedRoute>
              <SeekInformation />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </Suspense>
);

export default MemberR;
