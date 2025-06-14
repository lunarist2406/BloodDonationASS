import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutPage from "./layout/layoutPage";
import GuestR from "./components/router/GuestR";
import { useAuth } from "./hooks/User/useAuth";
import MemberR from "./components/router/MemberR";

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
            <Route
              path="admin/*"
              element={
                <div>
                  {/* Admin components can be added here */}
                  <h1>Admin Dashboard</h1>
                </div>
              }
            />
          )}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
