import { Route } from "react-router-dom";
import HomePage from "../../page/HomePage";

export default function StaffR(){
    return (
        <>
              <Route path="/:staff" element={<HomePage />}/>

        /</>
    )
}