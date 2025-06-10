import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestLayout from "../../layout/layoutPage";
import Login from "../guest/auth/Login";
import Register from "../guest/auth/Register";

export default function GuestR() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
