import {  Route, } from "react-router-dom";
import HomePage from "../../page/HomePage";
import BloodDonationCenter from "../member/information/BloodDonationCenter";
import BloodDocuments from "../member/information/BloodDocuments";
import BloodNews from "../member/information/BloodNews";
import BloodExperience from "../member/information/BloodExperience";
import { ProtectedRoute } from "../../middleware/auth/ProtectedRoute";
import RegisterBlood from "../member/donationblood/RegisterBlood/registerBlood";
import RegisterBloodEmergency from "../member/donationblood/RegisterBloodEmergency/registerBloodEmergency";
import DonateBlood from "../member/donationblood/DonateBlood/DonateBlood";
import ReceiverBlood from "../member/donationblood/ReceiverBlood/ReceiverBlood";
import { SeekInformation } from "../member/donationblood/SearchingInformation/SeekInformation";

export default function MemberR(){
    return (
    <>

          <Route
            path=":user"
            element={<HomePage />}
          />
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
    </>
    )
}