import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SubmitContent from "./pages/SubmitContent";
import Approvals from "./pages/Approvals";
import Navbar from "./components/Navbar";

// PrivateRoute
function PrivateRoute({ children, requireAdmin = false }: { children:ReactNode, requireAdmin?: boolean }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== "admin") return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }/>
          <Route path="/admin" element={
            <PrivateRoute requireAdmin>
              <AdminDashboard />
            </PrivateRoute>
          }/>
          <Route path="/submit" element={
            <PrivateRoute>
              <SubmitContent />
            </PrivateRoute>
          }/>
          <Route path="/approvals" element={
            <PrivateRoute requireAdmin>
              <Approvals />
            </PrivateRoute>
          }/>
          
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
