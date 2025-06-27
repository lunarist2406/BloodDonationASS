import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { ProtectedRoute } from "../../middleware/auth/ProtectedRoute";
import Profile from "../member/profile/Profile";
import CentralInformation from "../member/information/central/ControllingCentral";

// Lazy load các page
const HomePage = lazy(() => import("../../page/HomePage"));
const BloodDonationCenter = lazy(
  () => import("../member/information/BloodDonationCenter")
);
const BloodDocuments = lazy(
  () => import("../member/information/BloodDocuments")
);
const BloodNews = lazy(() => import("../member/information/BloodNews"));
const BloodExperience = lazy(
  () => import("../member/information/BloodExperience")
);
const RegisterBlood = lazy(
  () => import("../member/donationblood/RegisterBlood/registerBlood")
);
const RegisterBloodEmergency = lazy(
  () =>
    import(
      "../member/donationblood/RegisterBloodEmergency/registerBloodEmergency"
    )
);
const DonateBlood = lazy(
  () => import("../member/donationblood/DonateBlood/DonateBlood")
);
const ReceiverBlood = lazy(
  () => import("../member/donationblood/ReceiverBlood/ReceiverBlood")
);
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
        <Route path="user-profile" element={<Profile />} />
        <Route path="blood-donation-centers" element={<CentralInformation />} />
        <Route path="blood-documents" element={<BloodDocuments />} />
        <Route path="blood-news" element={<BloodNews />} />
        <Route path="blood-experience" element={<BloodExperience />} />
        <Route path="register-blood" element={<RegisterBlood />} />
        <Route
          path="register-blood-emergency"
          element={<RegisterBloodEmergency />}
        />
        <Route path="donate-blood" element={<DonateBlood />} />
        <Route path="receiver-blood" element={<ReceiverBlood />} />
        <Route path="seek-information" element={<SeekInformation />} />
      </Route>
    </Routes>
  </Suspense>
);

export default MemberR;
