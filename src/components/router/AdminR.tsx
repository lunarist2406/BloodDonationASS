import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "../LoadingSpinner";
import AdminProfile from "../admin/Body/profile/Profile";
import ControllingCentralStorages from "../admin/Body/centralstoage/ControllingCentral";

const HomePage = lazy(() => import("../../page/HomePage"));
const ControllingUser = lazy(
  () => import("../admin/Body/user/ControllingUser")
);
const ControllingCentral = lazy(
  () => import("../admin/Body/central/ControllingCentral")
);

const AdminR: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="controlling-user" element={<ControllingUser />} />
      <Route path="admin-profile" element={<AdminProfile />} />
      <Route path="controlling-central" element={<ControllingCentral />} />
      <Route path="controlling-storage" element={<ControllingCentralStorages />} />

    </Routes>
  </Suspense>
);

export default AdminR;
