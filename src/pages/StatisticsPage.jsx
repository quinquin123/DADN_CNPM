import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// eslint-disable-next-line react/prop-types
const StatisticsPage = ({ sensorId }) => {
  const [field, setField] = useState("temperature");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [startTime, setStartTime] = useState(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  ); // 3 tháng trước
  const [endTime, setEndTime] = useState(new Date().toISOString().slice(0, 16)); // Hiện tại
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      const params = new URLSearchParams({
        field,
        ...(min && { min }),
        ...(max && { max }),
        startTime: startTimestamp,
        endTime: endTimestamp,
        ...(sensorId && { sensorId }),
      }).toString();

      const response = await fetch(`/api/v1/sensor/chart/filters?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 400) throw new Error("Invalid field value");
        if (status === 403) throw new Error("User does not have permission");
        if (status === 404) throw new Error("Sensor/User not found");
        if (status === 500) throw new Error("Internal server error");
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const labels = data.map((item) =>
        new Date(item.timestamp * 1000).toLocaleTimeString()
      );
      const values = data.map((item) => item.data);

      const datasetLabel =
        field === "temperature"
          ? "Nhiệt độ (°C)"
          : field === "humidity"
          ? "Độ ẩm (%)"
          : "Cường độ ánh sáng (lux)";

      const borderColor =
        field === "temperature"
          ? "red"
          : field === "humidity"
          ? "blue"
          : "yellow";

      setChartData({
        labels,
        datasets: [
          {
            label: datasetLabel,
            data: values,
            borderColor: borderColor,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Thêm dữ liệu mẫu để test
  useEffect(() => {
    // Dữ liệu mẫu: mô phỏng giá trị trong 24 giờ (từ 0h đến 23h)
    const sampleData = {
      temperature: [
        { id: "1", data: 20, timestamp: 1672531200 }, // 0h
        { id: "2", data: 21, timestamp: 1672534800 }, // 1h
        { id: "3", data: 22, timestamp: 1672538400 }, // 2h
        { id: "4", data: 23, timestamp: 1672542000 }, // 3h
        { id: "5", data: 24, timestamp: 1672545600 }, // 4h
        { id: "6", data: 25, timestamp: 1672549200 }, // 5h
        { id: "7", data: 26, timestamp: 1672552800 }, // 6h
        { id: "8", data: 27, timestamp: 1672556400 }, // 7h
        { id: "9", data: 28, timestamp: 1672560000 }, // 8h
        { id: "10", data: 29, timestamp: 1672563600 }, // 9h
        { id: "11", data: 30, timestamp: 1672567200 }, // 10h
        { id: "12", data: 29, timestamp: 1672570800 }, // 11h
        { id: "13", data: 28, timestamp: 1672574400 }, // 12h
        { id: "14", data: 27, timestamp: 1672578000 }, // 13h
        { id: "15", data: 26, timestamp: 1672581600 }, // 14h
        { id: "16", data: 25, timestamp: 1672585200 }, // 15h
        { id: "17", data: 24, timestamp: 1672588800 }, // 16h
        { id: "18", data: 23, timestamp: 1672592400 }, // 17h
        { id: "19", data: 22, timestamp: 1672596000 }, // 18h
        { id: "20", data: 21, timestamp: 1672599600 }, // 19h
        { id: "21", data: 20, timestamp: 1672603200 }, // 20h
        { id: "22", data: 20, timestamp: 1672606800 }, // 21h
        { id: "23", data: 20, timestamp: 1672610400 }, // 22h
        { id: "24", data: 20, timestamp: 1672614000 }, // 23h
      ],
      humidity: [
        { id: "1", data: 60, timestamp: 1672531200 }, // 0h
        { id: "2", data: 61, timestamp: 1672534800 }, // 1h
        { id: "3", data: 62, timestamp: 1672538400 }, // 2h
        { id: "4", data: 63, timestamp: 1672542000 }, // 3h
        { id: "5", data: 64, timestamp: 1672545600 }, // 4h
        { id: "6", data: 65, timestamp: 1672549200 }, // 5h
        { id: "7", data: 66, timestamp: 1672552800 }, // 6h
        { id: "8", data: 67, timestamp: 1672556400 }, // 7h
        { id: "9", data: 68, timestamp: 1672560000 }, // 8h
        { id: "10", data: 69, timestamp: 1672563600 }, // 9h
        { id: "11", data: 70, timestamp: 1672567200 }, // 10h
        { id: "12", data: 65, timestamp: 1672570800 }, // 11h
        { id: "13", data: 60, timestamp: 1672574400 }, // 12h
        { id: "14", data: 55, timestamp: 1672578000 }, // 13h
        { id: "15", data: 50, timestamp: 1672581600 }, // 14h
        { id: "16", data: 55, timestamp: 1672585200 }, // 15h
        { id: "17", data: 60, timestamp: 1672588800 }, // 16h
        { id: "18", data: 65, timestamp: 1672592400 }, // 17h
        { id: "19", data: 70, timestamp: 1672596000 }, // 18h
        { id: "20", data: 65, timestamp: 1672599600 }, // 19h
        { id: "21", data: 60, timestamp: 1672603200 }, // 20h
        { id: "22", data: 55, timestamp: 1672606800 }, // 21h
        { id: "23", data: 50, timestamp: 1672610400 }, // 22h
        { id: "24", data: 50, timestamp: 1672614000 }, // 23h
      ],
      light_intensity: [
        { id: "1", data: 0, timestamp: 1672531200 }, // 0h
        { id: "2", data: 0, timestamp: 1672534800 }, // 1h
        { id: "3", data: 0, timestamp: 1672538400 }, // 2h
        { id: "4", data: 0, timestamp: 1672542000 }, // 3h
        { id: "5", data: 0, timestamp: 1672545600 }, // 4h
        { id: "6", data: 100, timestamp: 1672549200 }, // 5h
        { id: "7", data: 200, timestamp: 1672552800 }, // 6h
        { id: "8", data: 300, timestamp: 1672556400 }, // 7h
        { id: "9", data: 400, timestamp: 1672560000 }, // 8h
        { id: "10", data: 500, timestamp: 1672563600 }, // 9h
        { id: "11", data: 600, timestamp: 1672567200 }, // 10h
        { id: "12", data: 700, timestamp: 1672570800 }, // 11h
        { id: "13", data: 800, timestamp: 1672574400 }, // 12h
        { id: "14", data: 700, timestamp: 1672578000 }, // 13h
        { id: "15", data: 600, timestamp: 1672581600 }, // 14h
        { id: "16", data: 500, timestamp: 1672585200 }, // 15h
        { id: "17", data: 400, timestamp: 1672588800 }, // 16h
        { id: "18", data: 300, timestamp: 1672592400 }, // 17h
        { id: "19", data: 200, timestamp: 1672596000 }, // 18h
        { id: "20", data: 100, timestamp: 1672599600 }, // 19h
        { id: "21", data: 0, timestamp: 1672603200 }, // 20h
        { id: "22", data: 0, timestamp: 1672606800 }, // 21h
        { id: "23", data: 0, timestamp: 1672610400 }, // 22h
        { id: "24", data: 0, timestamp: 1672614000 }, // 23h
      ],
    };

    const labels = sampleData[field].map((item) =>
      new Date(item.timestamp * 1000).toLocaleTimeString()
    );
    const values = sampleData[field].map((item) => item.data);

    const datasetLabel =
      field === "temperature"
        ? "Nhiệt độ (°C)"
        : field === "humidity"
        ? "Độ ẩm (%)"
        : "Cường độ ánh sáng (lux)";

    const borderColor =
      field === "temperature"
        ? "red"
        : field === "humidity"
        ? "blue"
        : "yellow";

    setChartData({
      labels,
      datasets: [
        {
          label: datasetLabel,
          data: values,
          borderColor: borderColor,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
        },
      ],
    });
  }, [field]); // Cập nhật dữ liệu khi field thay đổi

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text:
          field === "temperature"
            ? "Biểu đồ Nhiệt độ trong ngày"
            : field === "humidity"
            ? "Biểu đồ Độ ẩm trong ngày"
            : "Biểu đồ Cường độ Ánh sáng trong ngày",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Thời gian (giờ)" },
      },
      y: {
        title: {
          display: true,
          text:
            field === "temperature"
              ? "Nhiệt độ (°C)"
              : field === "humidity"
              ? "Độ ẩm (%)"
              : "Cường độ ánh sáng (lux)",
        },
        min: 0,
        max:
          field === "temperature"
            ? 70 // Phạm vi cho nhiệt độ
            : field === "humidity"
            ? 70 // Phạm vi cho độ ẩm
            : 1000, // Phạm vi cho cường độ ánh sáng
      },
    },
  };

  return (
    <div className="flex-1 p-6 bg-gray-900 text-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Sensor Data Dashboard</h1>
      </header>

      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Field</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
            >
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="light_intensity">Light Intensity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Min Value</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              placeholder="Min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Value</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              placeholder="Max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchData}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto bg-red-600 text-white p-4 rounded-md mb-8">
          {error}
        </div>
      )}

      {chartData && (
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;