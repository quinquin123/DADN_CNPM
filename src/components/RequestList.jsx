import React, { useState } from 'react';

function RequestList() {
  const [requests] = useState([
    { id: 'req1', sensorId: 'sensor1', userId: 'user1', createdAt: '2025-03-28' },
    { id: 'req2', sensorId: 'sensor2', userId: 'user2', createdAt: '2025-03-27' },
  ]);

  const handleApprove = (requestId) => {
    // Gọi API POST /api/v1/sensor/requests/{requestId}/approve
    console.log(`Approved request: ${requestId}`);
  };

  const handleReject = (requestId) => {
    // Gọi API POST /api/v1/sensor/requests/{requestId}/reject
    console.log(`Rejected request: ${requestId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Yêu cầu đăng ký</h2>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID Yêu cầu</th>
            <th className="p-2">Sensor ID</th>
            <th className="p-2">User ID</th>
            <th className="p-2">Thời gian</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="p-2">{req.id}</td>
              <td className="p-2">{req.sensorId}</td>
              <td className="p-2">{req.userId}</td>
              <td className="p-2">{req.createdAt}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleApprove(req.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Từ chối
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequestList;