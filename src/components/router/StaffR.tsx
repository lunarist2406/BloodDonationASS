import { Route } from "react-router-dom";
import HomePage from "../../page/HomePage";
import BusinessSystems from "../staff/BusinessSystem/BusinessSystem";

export default function StaffR(){
    return (
        <>
              <Route path="/:staff" element={<HomePage />}/>
              <Route path="/business-systems" element={<BusinessSystems />} />

        /</>
    )
}