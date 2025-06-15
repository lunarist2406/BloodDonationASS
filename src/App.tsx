import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutPage from "./layout/layoutPage";
import GuestR from "./components/router/GuestR";
import { useAuth } from "./hooks/User/useAuth";
import MemberR from "./components/router/MemberR";
import AdminR from "./components/router/AdminR";

function App() {
  const {user} = useAuth();
  const isMember = user?.role === "MEMBER";
  const isAdmin = user?.role === "ADMIN";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          {GuestR()}
          {isMember && (
            (MemberR())
          )}
          {isAdmin && (
            (AdminR())
          )}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
