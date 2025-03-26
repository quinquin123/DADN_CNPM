import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import YoloHomeLogin from "./pages/YoloHomeLogin";
import YoloHomeSignUp from "./pages/YoloHomeSignUp";
import Assistant from "./components/asisstant";

// Component PrivateRoute
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // Xử lý đăng nhập thành công
  const handleLoginSuccess = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    navigate("/", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/user/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("authToken"); 
      localStorage.setItem("isAuthenticated", "false");
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Điều hướng khi chưa đăng nhập
  useEffect(() => {
    if (
      !isAuthenticated &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {/* Hiển thị Assistant cho các private route */}
        {isAuthenticated && <Assistant onLogout={handleLogout} />}
        <div className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={<YoloHomeLogin onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/signup" element={<YoloHomeSignUp />} />
            <Route
              path="/"
              element={
                <PrivateRoute element={<HomePage onLogout={handleLogout} />} />
              }
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<SettingsPage />} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
