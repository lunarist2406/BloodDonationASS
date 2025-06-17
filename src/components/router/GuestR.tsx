import { Route } from "react-router-dom";
import Login from "../guest/auth/Login";
import Register from "../guest/auth/Register";
import EmailVerification from "../guest/auth/EmailVerification";
import VerifyNotice from "../guest/auth/VerifyNotice";

export default function GuestR() {
  return (
    <>
      <Route index element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify-email" element={<EmailVerification />} />
      <Route path="verify-notice" element={<VerifyNotice />} />
    </>
  );
}
