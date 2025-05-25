import "./App.css";
import GuestLayout from "./layout/guest";
import Login from "./components/guest/auth/Login";
import Register from "./components/guest/auth/Register";
import BloodDonationCenter from "./components/guest/information/BloodDonationCenter";
import BloodDocuments from "./components/guest/information/BloodDocuments";
import BloodNews from "./components/guest/information/BloodNews";
import BloodExperience from "./components/guest/information/BloodExperience";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterBlood from "./components/guest/donationblood/RegisterBlood/registerBlood";
import HomePage from "./page/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="blood-donation-centers"
            element={<BloodDonationCenter />}
          />
          <Route path="blood-documents" element={<BloodDocuments />} />
          <Route path="blood-news" element={<BloodNews />} />
          <Route path="blood-experience" element={<BloodExperience />} />
          <Route path="register-blood" element={<RegisterBlood />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
