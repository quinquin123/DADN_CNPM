import { useState } from 'react';

function SubscribeSensor() {
  const [sensorId, setSensorId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API POST /api/v1/sensor/{sensorId}/user/subscribe ở đây
    console.log(`Subscribed to sensor: ${sensorId}`);
    setSensorId('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Đăng ký cảm biến</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Sensor ID</label>
          <input
            type="text"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập ID cảm biến"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Gửi yêu cầu đăng ký
        </button>
      </form>
    </div>
  );
}

export default SubscribeSensor;