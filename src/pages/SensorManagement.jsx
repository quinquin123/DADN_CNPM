import { useState, useEffect } from "react";
import { FiUserPlus, FiUserX, FiCheck, FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi";

const SensorManagement = () => {
  const [activeTab, setActiveTab] = useState("subscribers");
  const [subscribers, setSubscribers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch subscribers and requests data
  useEffect(() => {
    console.log("Starting fetchData");
    const fetchData = async () => {
      setLoading(true);
      try {
        const subscribersResponse = await fetch("/api/v1/sensor/user/subscribers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!subscribersResponse.ok) {
          throw new Error(`Error fetching subscribers: ${subscribersResponse.status}`);
        }

        const subscribersData = await subscribersResponse.json();
        setSubscribers(subscribersData);

        const requestsResponse = await fetch("/api/v1/sensor/user/requests", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!requestsResponse.ok) {
          throw new Error(`Error fetching requests: ${requestsResponse.status}`);
        }

        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle approving a request
  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(`/api/v1/sensor/requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error approving request: ${response.status}`);
      }

      setRequests(requests.filter((request) => request.id !== requestId));
      const subscribersResponse = await fetch("/api/v1/sensor/user/subscribers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json();
        setSubscribers(subscribersData);
      }

      showNotification("The request was successfully accepted.", "success");
    } catch (err) {
      console.error("Error approving request:", err);
      showNotification(`Error: ${err.message}`, "error");
    }
  };

  // Handle rejecting a request
  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`/api/v1/sensor/requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error rejecting request: ${response.status}`);
      }

      setRequests(requests.filter((request) => request.id !== requestId));
      showNotification("Request has been denied", "success");
    } catch (err) {
      console.error("Error rejecting request:", err);
      showNotification(`Error: ${err.message}`, "error");
    }
  };

  // Handle removing a user's access
  const handleRemoveAccess = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user's access?")) {
      try {
        // Thử xóa bằng API DELETE
        const deleteResponse = await fetch(`/api/v1/sensor/user/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (deleteResponse.ok) {
          // Nếu DELETE thành công (không phải owner)
          setSubscribers(subscribers.filter((subscriber) => subscriber.userId !== userId));
          showNotification("Access removed successfully", "success");
          window.location.reload();
        } else {
          // Nếu DELETE thất bại (có thể là owner), thử API PUT
          const unsubscribeResponse = await fetch("/api/v1/sensor/user/unsubscribe", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }), // Gửi userId trong body nếu API yêu cầu
          });

          if (!unsubscribeResponse.ok) {
            throw new Error(`Error unsubscribing: ${unsubscribeResponse.status}`);
          }

          // Cập nhật UI sau khi unsubscribe thành công
          setSubscribers(subscribers.filter((subscriber) => subscriber.userId !== userId));
          showNotification("User unsubscribed successfully", "success");
          window.location.reload();
        }
      } catch (err) {
        console.error("Error removing access:", err);
        showNotification(`Error: ${err.message}`, "error");
      }
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    const date = new Date(Number(timestamp.seconds) * 1000);
    return date.toLocaleString("vi-VN");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-200">Loading data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="p-6 max-w-md bg-red-900 rounded-lg shadow-xl">
          <FiAlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">An error has occurred</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full py-2 px-4 bg-red-700 hover:bg-red-600 rounded text-white font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg ${
            notification.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Sensor Management</h1>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-10">
        <div className="border-b border-gray-700">
          <nav className="flex">
            <button
              className={`py-4 px-6 ${
                activeTab === "subscribers"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              } transition-colors duration-200 font-medium`}
              onClick={() => setActiveTab("subscribers")}
            >
              Registered User ({subscribers.length})
            </button>
            <button
              className={`py-4 px-6 ${
                activeTab === "requests"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              } transition-colors duration-200 font-medium relative`}
              onClick={() => setActiveTab("requests")}
            >
              Registration requirements ({requests.length})
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {requests.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "subscribers" && (
            <>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiUserPlus className="mr-2" /> Registered User
              </h2>

              {subscribers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No users have registered your sensor yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 text-left">
                        <th className="p-3 rounded-tl-lg w-1/5">Name</th>
                        <th className="p-3 w-1/4">ID</th>
                        <th className="p-3 w-1/4">SensorID</th>
                        <th className="p-3 w-1/7">Phone</th>
                        <th className="p-3 rounded-tr-lg w-1/3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-gray-700">
                          <td className="p-3 text-gray-300">{subscriber.firstName + " " + subscriber.lastName}</td>
                          <td className="p-3 text-gray-300">{subscriber.id.substring(0, 8)}...</td>
                          <td className="p-3 text-gray-300">{subscriber.sensorId.substring(0, 8)}...</td>
                          <td className="p-3 text-gray-300">{subscriber.phone}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemoveAccess(subscriber.id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-white text-sm transition-colors duration-200"
                            >
                              <FiTrash2 className="mr-1" /> Remove access
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === "requests" && (
            <>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiUserX className="mr-2" /> Registration requirements
              </h2>

              {requests.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No new registration requirements.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 text-left">
                        <th className="p-3 rounded-tl-lg">SensorID</th>
                        <th className="p-3">UserID</th>
                        <th className="p-3">Request date</th>
                        <th className="p-3 rounded-tr-lg text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-700">
                          <td className="p-3 text-gray-300">{request.sensorId.substring(0, 8)}...</td>
                          <td className="p-3">{request.userId}</td>
                          <td className="p-3 text-gray-300">{formatTimestamp(request.createdAt)}</td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="inline-flex items-center px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-white text-sm transition-colors duration-200"
                              >
                                <FiCheck className="mr-1" /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-white text-sm transition-colors duration-200"
                              >
                                <FiX className="mr-1" /> Refuse
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorManagement;