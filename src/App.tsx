import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import LayoutPage from "./layout/layoutPage";
import { useAuth } from "./hooks/User/useAuth";
import Login from "./components/guest/auth/Login";
import Register from "./components/guest/auth/Register";
import EmailVerification from "./components/guest/auth/EmailVerification";
import VerifyNotice from "./components/guest/auth/VerifyNotice";
import ForgotPassword from "./components/guest/auth/ForgotPassword";

const MemberR = lazy(() => import("./components/router/MemberR"));
const AdminR = lazy(() => import("./components/router/AdminR"));
const StaffR = lazy(() => import("./components/router/StaffR"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuth();

  if (user === undefined) return <div>Loading...</div>;

  const isMember = user?.role === "MEMBER";
  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";

  const formattedName = user?.fullname?.replace(/\s+/g, "") || "";

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route
              index
              element={
                user ? (
                  <Navigate to={`/${formattedName}`} replace />
                ) : (
                  <Login />
                )
              }
            />

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email" element={<EmailVerification />} />
            <Route path="verify-notice" element={<VerifyNotice />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {isMember && (
              <Route
                path=":member/*" 
                element={
                  <ProtectedRoute>
                    <MemberR />
                  </ProtectedRoute>
                }
              />
            )}

            {isAdmin && (
              <Route
                path=":admin/*"
                element={
                  <ProtectedRoute>
                    <AdminR />
                  </ProtectedRoute>
                }
              />
            )}

            {isStaff && (
              <Route
                path=":staff/*"
                element={
                  <ProtectedRoute>
                    <StaffR />
                  </ProtectedRoute>
                }
              />
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
