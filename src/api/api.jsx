
export const unsubscribeSensor = async () => {
  const response = await fetch(`/api/v1/sensor/user/unsubscribe`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const subscribeSensor = async (sensorId) => {
  const response = await fetch(`/api/v1/sensor/${sensorId}/user/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const approveRequest = async (requestId) => {
  const response = await fetch(`/api/v1/sensor/requests/${requestId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const rejectRequest = async (requestId) => {
  const response = await fetch(`/api/v1/sensor/requests/${requestId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const getSubscribers = async () => {
  const response = await fetch(`/api/v1/sensor/user/subscribers`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const getPendingRequests = async () => {
  const response = await fetch(`/api/v1/sensor/user/requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const getChartData = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`/api/v1/sensor/chart/filters?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const removeUserAccess = async (userId) => {
  const response = await fetch(`/api/v1/sensor/user/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};
