import { Route } from "react-router-dom";
import Login from "../guest/auth/Login";
import Register from "../guest/auth/Register";

export default function GuestR() {
  return (
    <>
      <Route index element={<Login />} />
      <Route path="register" element={<Register />} />
    </>
  );
}
