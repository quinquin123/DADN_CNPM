// eslint-disable-next-line no-unused-vars
import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Upload, LogOut, Save, Edit } from "lucide-react";

// eslint-disable-next-line react/prop-types
const SettingsPage = ({ onLogout }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [faceIdImage, setFaceIdImage] = useState(null);
  const [faceIdMessage, setFaceIdMessage] = useState("");
  const [faceIdLoading, setFaceIdLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const response = await fetch("/api/v1/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setEditedData(data);
        setAvatarPreview(data.avatar || null);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert("Could not load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const greeting = getGreeting();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarChange = () => {
    if (selectedFile) {
      alert("Avatar updated successfully!");
    } else {
      alert("Please select a file first");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*]/.test(newPassword)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*)");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordError("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch("/api/v1/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          throw new Error("Invalid request: " + (errorData.message || "Bad request"));
        } else if (response.status === 401) {
          throw new Error("Unauthorized or current password is incorrect");
        } else if (response.status === 500) {
          throw new Error("Internal server error");
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

      const data = await response.json();
      alert(data.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordError(error.message || "Failed to change password. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const formData = new FormData();
      formData.append("firstName", editedData.firstName || "");
      formData.append("lastName", editedData.lastName || "");
      formData.append("email", editedData.email || "");
      formData.append("phone", editedData.phone || "");
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await fetch("/api/v1/user/me", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          throw new Error("Invalid request body: " + (errorData.message || "Bad request"));
        } else if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        } else if (response.status === 404) {
          throw new Error("User not found");
        } else if (response.status === 409) {
          throw new Error("Email or phone already exists");
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setEditedData(updatedData);
      setIsEditing(false);
      setSelectedFile(null);
      setAvatarPreview(updatedData.avatar || null);
      alert("Information updated successfully!");
    } catch (error) {
      console.error("Failed to update user data:", error);
      alert(error.message || "Failed to update information. Please try again.");
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setPasswordError("Failed to access camera: " + err.message);
      setShowCamera(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "face-id-capture.jpg", { type: "image/jpeg" });
      setFaceIdImage(file);
      setShowCamera(false);
      video.srcObject.getTracks().forEach(track => track.stop());
    }, "image/jpeg");
  };

  const handleFaceIdEnroll = async () => {
    setFaceIdLoading(true);
    setFaceIdMessage("");
    setPasswordError("");

    if (!faceIdImage) {
      setPasswordError("Please select or capture an image for Face ID!");
      setFaceIdLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setPasswordError("Please log in first to enroll Face ID!");
      setFaceIdLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", faceIdImage);

    try {
      const response = await fetch("/api/v1/user/me/face-id", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          throw new Error(errorData.message || "Invalid image for Face ID!");
        } else if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again!");
        } else if (response.status === 404) {
          throw new Error("User not found!");
        } else {
          throw new Error(errorData.message || "Failed to enroll Face ID!");
        }
      }

      const data = await response.json();
      setFaceIdMessage(data.message || "Face ID enrolled successfully!");
    } catch (error) {
      console.error("Failed to enroll Face ID:", error);
      setPasswordError(error.message);
    } finally {
      setFaceIdLoading(false);
    }
  };

  const handleFaceIdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setPasswordError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPasswordError("File size should not exceed 5MB");
        return;
      }
      setFaceIdImage(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {greeting}
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome, {userData?.firstName || "User"}!
                </h1>
              </div>
              <div className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <span className="text-2xl mr-2">👋</span>
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  Have a nice day!
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3">
                Profile Settings
              </h2>
              {!isEditing && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} className="mr-2" />
                  Change Information
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-600 shadow-md">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-500 dark:text-blue-300">
                        {userData?.firstName?.[0]}
                        {userData?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    onClick={() => document.getElementById("avatar-upload").click()}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose File
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAvatarChange}
                    disabled={!selectedFile}
                  >
                    <Save size={16} className="mr-2" />
                    Update Avatar
                  </button>
                  {selectedFile && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={isEditing ? editedData.firstName || "" : userData?.firstName || ""}
                      onChange={isEditing ? handleInputChange : undefined}
                      readOnly={!isEditing}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={isEditing ? editedData.lastName || "" : userData?.lastName || ""}
                      onChange={isEditing ? handleInputChange : undefined}
                      readOnly={!isEditing}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? editedData.email || "" : userData?.email || ""}
                    onChange={isEditing ? handleInputChange : undefined}
                    readOnly={!isEditing}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={isEditing ? editedData.phone || "" : userData?.phone || ""}
                    onChange={isEditing ? handleInputChange : undefined}
                    readOnly={!isEditing}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                      onClick={handleSaveChanges}
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(userData);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-3">
              Security Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="old-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-black bg-white dark:bg-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-black bg-white dark:bg-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-black bg-white dark:bg-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}
              {faceIdMessage && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-lg text-sm">
                  {faceIdMessage}
                </div>
              )}
              <div className="pt-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Enroll Face ID
                </h3>
                <div className="space-y-4">
                  <input
                    type="file"
                    id="face-id-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFaceIdImageChange}
                  />
                  <button
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    onClick={() => document.getElementById("face-id-upload").click()}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose File
                  </button>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center">Or</p>
                  {!showCamera ? (
                    <button
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                      onClick={startCamera}
                      disabled={faceIdLoading}
                    >
                      <Upload size={16} className="mr-2" />
                      Capture from Camera
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <video
                        ref={videoRef}
                        autoPlay
                        className="w-full max-w-md rounded-md border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                        onClick={captureImage}
                        disabled={faceIdLoading}
                      >
                        Take Photo
                      </button>
                    </div>
                  )}
                  {faceIdImage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 truncate max-w-xs">
                      {faceIdImage.name}
                    </p>
                  )}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleFaceIdEnroll}
                    disabled={faceIdLoading || !faceIdImage}
                  >
                    {faceIdLoading ? (
                      <span className="flex items-center">
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
                        Enrolling...
                      </span>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Enroll Face ID
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                  onClick={handlePasswordChange}
                >
                  <Save size={18} className="mr-2" />
                  Change Password
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                  onClick={onLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Log out
                </button>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;