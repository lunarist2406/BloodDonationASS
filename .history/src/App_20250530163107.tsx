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
import SeekInformation from "./components/guest/donationblood/SearchingInformation/SeekInformation";
import RegisterBloodEmergency from "./components/guest/donationblood/RegisterBloodEmergency/registerBloodEmergency";
import DonateBlood from "./components/guest/donationblood/DonateBlood/DonateBlood";

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
          <Route path="register-blood-emergency" element={<RegisterBloodEmergency />} />
          <Route path="donation-blood" element={<DonateBlood />} />
          <Route path="receiver-blood" element={<DonateBloo />} />

          <Route path="seek-information" element={<SeekInformation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
