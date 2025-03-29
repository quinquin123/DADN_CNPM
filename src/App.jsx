import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import YoloHomeLogin from "./pages/YoloHomeLogin";
import YoloHomeSignUp from "./pages/YoloHomeSignUp";
import Assistant from "./components/asisstant";
import Notification from "./pages/Notification";
import Modemanager from "./pages/ModeManager";
import SensorManagement from "./pages/SensorManagement";
import SensorDashboard from "./pages/StatisticsPage"; // Thêm import

// Component PrivateRoute
const PrivateRoute = ({ element, sensorId }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? React.cloneElement(element, { sensorId }) : <Navigate to="/login" replace />;
};

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [sensorId, setSensorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch("/api/v1/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setSensorId(data.sensorId || null);
          } else {
            console.error("Không thể lấy thông tin người dùng:", response.status);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API user/me:", error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [isAuthenticated]);

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
      localStorage.removeItem("accessToken");
      localStorage.setItem("isAuthenticated", "false");
      setIsAuthenticated(false);
      setSensorId(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (
      !isAuthenticated &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-auto">
      {isAuthenticated && <Sidebar />}
      
      <div className="flex-1 flex flex-col">
        {isAuthenticated && location.pathname !== "/settings" && <Assistant onLogout={handleLogout} />}
        
        <div className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={<YoloHomeLogin onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/signup" element={<YoloHomeSignUp />} />
            
            <Route
              path="/"
              element={<PrivateRoute element={<HomePage onLogout={handleLogout} />} sensorId={sensorId} />}
            />
            
            <Route
              path="/settings"
              element={<PrivateRoute element={<SettingsPage onLogout={handleLogout} />} sensorId={sensorId} />}
            />

            <Route
              path="/notification"
              element={<PrivateRoute element={<Notification />} sensorId={sensorId} />}
            />

            <Route
              path="/mode-manager"
              element={<PrivateRoute element={<Modemanager />} sensorId={sensorId} />}
            />

            <Route
              path="/sensor-management"
              element={<PrivateRoute element={<SensorManagement />} sensorId={sensorId} />}
            />

            <Route
              path="/statistics"
              element={<PrivateRoute element={<SensorDashboard />} sensorId={sensorId} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;