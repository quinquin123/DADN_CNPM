import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const YoloHomeLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/user/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Incorrect email or password!");
      }

      const data = await response.json();
      // Save token and authentication status
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("isAuthenticated", "true");
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-poppins bg-gray-100">
      {/* Left Panel - Login Form */}
      <div className="w-3/5 flex flex-col pt-48 items-center   ">
        

        <div className="w-full p-14 max-w-md bg-white rounded-xl drop-shadow-sm">
        <div className="text-4xl relative font-semibold text-center pb-20 text-gray-900  ">
          YOLOHOME
        </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Log In</h2>
          <p className="text-gray-500 mb-6">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

          {error && (
            <p className="text-red-500 mb-4 text-sm bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>

            <div className="text-center">
              <a
                href="#"
                className="text-blue-500 text-sm hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="w-2/5 relative bg-gray-200">
        <div
          className="absolute opacity-90 inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
            <h2 className="text-4xl font-semibold">Welcome to YoloHome</h2>
            <p className="text-xl mt-2">Smart living starts at home.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoloHomeLogin;