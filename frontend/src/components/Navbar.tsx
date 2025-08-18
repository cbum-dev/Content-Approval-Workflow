import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Hide on login and signup pages
  if (["/login", "/signup"].includes(location.pathname)) return null;

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link to="/dashboard" className="font-bold text-blue-600 text-lg">ContentApp</Link>
          {user && user.role === "user" && (
            <>
              <Link to="/dashboard" className="text-gray-800 hover:text-blue-700">Dashboard</Link>
              <Link to="/submit" className="text-gray-800 hover:text-blue-700">Submit Content</Link>
            </>
          )}
          {user && user.role === "admin" && (
            <>
              <Link to="/admin" className="text-gray-800 hover:text-blue-700">Admin Dashboard</Link>
              <Link to="/approvals" className="text-gray-800 hover:text-blue-700">Approvals</Link>
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
