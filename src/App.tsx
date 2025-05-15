import "./App.css";
import GuestLayout from "./layout/guest";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BloodDonationCenter from "./components/guest/information/BloodDonationCenter";
import BloodDocuments from "./components/guest/information/BloodDocuments";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blood-donation-centers" element={<BloodDonationCenter />} />
        <Route path="/blood-documents" element={<BloodDocuments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
