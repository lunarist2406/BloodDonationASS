import { Route } from "react-router-dom";
import HomePage from "../../page/HomePage";
import ControllingUser from "../admin/Body/user/ControllingUser";

export default function AdminR() {
  return (
    <>
      <Route path="/:admin" element={<HomePage />}/>
              <Route path="/controlling-user" element={<ControllingUser />} />
    </>
  );
}
