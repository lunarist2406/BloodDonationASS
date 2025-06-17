import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "../LoadingSpinner";

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
      <Route path="controlling-central" element={<ControllingCentral />} />
    </Routes>
  </Suspense>
);

export default AdminR;
