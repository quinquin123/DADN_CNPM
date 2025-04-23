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
import SensorDashboard from "./pages/StatisticsPage";

// Component PrivateRoute
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ element, sensorId, accessToken, userName }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const hasValidToken = accessToken && accessToken !== "";
  return isAuthenticated && hasValidToken
    ? React.cloneElement(element, { sensorId, accessToken, userName })
    : <Navigate to="/login" replace />;
};

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [sensorId, setSensorId] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            throw new Error("No access token found");
          }
          console.log("Fetching user info with token:", token);
          const response = await fetch("/api/v1/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setSensorId(data.sensorId || null);
            setUserName(data.firstName + " " + data.lastName || "User");
          } else {
            throw new Error(`API error: ${response.status}`);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API user/me:", error);
          // Đăng xuất nếu token không hợp lệ
          localStorage.removeItem("accessToken");
          localStorage.setItem("isAuthenticated", "false");
          setIsAuthenticated(false);
          setAccessToken("");
          setSensorId(null);
          setUserName("");
          navigate("/login", { replace: true });
        }
      }
      setLoading(false);
    };
  
    fetchUserInfo();
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
    setAccessToken(token); 
    navigate("/", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/user/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.setItem("isAuthenticated", "false");
      setIsAuthenticated(false);
      setAccessToken(""); // Cập nhật trạng thái
      setSensorId(null);
      navigate("/login", { replace: true });
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
        {isAuthenticated && location.pathname !== "/settings" && (
          <Assistant 
            accessToken={accessToken}
            onLogout={handleLogout}
            userName={userName}
          />
        )}
        
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
                <PrivateRoute
                  element={<HomePage onLogout={handleLogout} />}
                  sensorId={sensorId}
                  accessToken={accessToken}
                  userName={userName} // Truyền userName vào PrivateRoute
                />
              }
            />
            
            <Route
              path="/settings"
              element={
                <PrivateRoute
                  element={<SettingsPage onLogout={handleLogout} />}
                  sensorId={sensorId}
                  accessToken={accessToken}
                  userName={userName} // Truyền userName vào PrivateRoute
                />
              }
            />

            <Route
              path="/notification"
              element={
                <PrivateRoute
                  element={<Notification />}
                  sensorId={sensorId}
                  accessToken={accessToken}
                  userName={userName} // Truyền userName vào PrivateRoute
                />
              }
            />

            <Route
              path="/mode-manager"
              element={
                <PrivateRoute
                  element={<Modemanager />}
                  sensorId={sensorId}
                  accessToken={accessToken}
                  userName={userName} // Truyền userName vào PrivateRoute
                />
              }
            />  

            <Route
              path="/sensor-management"
              element={<PrivateRoute element={<SensorManagement />} sensorId={sensorId} accessToken={accessToken} />}
            />

            <Route
              path="/statistics"
              element={
                <PrivateRoute
                  element={<SensorDashboard />}
                  sensorId={sensorId}
                  accessToken={accessToken}
                  userName={userName} // Truyền userName vào PrivateRoute
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;