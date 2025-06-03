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
import ReceiverBlood from "./components/guest/donationblood/ReceiverBlood/ReceiverBlood";
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
          <Route
            path="register-blood"
            element={
              <ProtectedRoute>
                <RegisterBlood />
              </ProtectedRoute>
            }
          />
          <Route
            path="register-blood-emergency"
            element={
              <ProtectedRoute>
                <RegisterBloodEmergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="donation-blood"
            element={
              <ProtectedRoute>
                <DonateBlood />
              </ProtectedRoute>
            }
          />
          <Route
            path="receiver-blood"
            element={
              <ProtectedRoute>
                <ReceiverBlood />
              </ProtectedRoute>
            }
          />
          <Route
            path="seek-information"
            element={
              <ProtectedRoute>
                <SeekInformation />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
