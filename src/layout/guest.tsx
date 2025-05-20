import GuestFooter from "../components/guest/footer/GuestFooter";
import GuestHeader from "../components/guest/header/Header";

import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
      <GuestHeader />


      <main>
        <Outlet />
      </main>

      <GuestFooter />
    </div>
  );
}
