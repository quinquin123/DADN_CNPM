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
import PropTypes from "prop-types";

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

const StatisticsPage = ({ sensorId }) => {
  const [field, setField] = useState("temperature");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [startYear, setStartYear] = useState(2025);
  const [startMonth, setStartMonth] = useState(2); // Tháng 2 (90 ngày trước)
  const [startDay, setStartDay] = useState(21);
  const [startHour, setStartHour] = useState(0);
  const [startMinute, setStartMinute] = useState(0);
  // const [endYear, setEndYear] = useState(2025);
  // const [endMonth, setEndMonth] = useState(5); // Tháng 5
  // const [endDay, setEndDay] = useState(21);
  // const [endHour, setEndHour] = useState(21); // 09:03 PM
  // const [endMinute, setEndMinute] = useState(3);
  const [granularity, setGranularity] = useState("day");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm state để kiểm soát loading

  // Chỉ gọi API, không sử dụng dữ liệu mẫu
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        field,
        ...(min && { min }),
        ...(max && { max }),
        granularity,
        year: startYear,
        month: startMonth,
        day: startDay,
        hour: startHour,
        minute: startMinute,
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
      console.log("API Data:", data);
      const labels = data.map((item) => item.label);
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

      const maxValue = values.length > 0 ? Math.max(...values) * 1.2 : 100;

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Đảm bảo kích thước cố định
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text:
              field === "temperature"
                ? "Biểu đồ Nhiệt độ"
                : field === "humidity"
                ? "Biểu đồ Độ ẩm"
                : "Biểu đồ Cường độ Ánh sáng",
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Thời gian" },
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
            max: maxValue,
          },
        },
      };

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
        options: chartOptions,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi fetchData khi component mount và khi các filter thay đổi
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    field,
    min,
    max,
    startYear,
    startMonth,
    startDay,
    startHour,
    startMinute,
    granularity,
    sensorId,
  ]);

  return (
    <div className="flex-1 p-6 bg-gray-900 text-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Sensor Data Dashboard</h1>
      </header>

      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium">Granularity</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
              <option value="hour">Hour</option>
              <option value="minute">Minute</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Start Year</label>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              min="2020"
              max="2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Month</label>
            <input
              type="number"
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              min="1"
              max="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Day</label>
            <input
              type="number"
              value={startDay}
              onChange={(e) => setStartDay(Number(e.target.value))}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              min="1"
              max="31"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Hour</label>
            <input
              type="number"
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              min="0"
              max="23"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Minute</label>
            <input
              type="number"
              value={startMinute}
              onChange={(e) => setStartMinute(Number(e.target.value))}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-700 text-gray-100"
              min="0"
              max="59"
            />
          </div>
          <div className="flex items-end col-span-1 md:col-span-2 lg:col-span-4">
            <button
              onClick={fetchData}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Apply Filters"}
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
        <div
          className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md"
          style={{ height: "400px" }} // Đảm bảo chiều cao cố định
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Line data={chartData} options={chartData.options} />
          )}
        </div>
      )}
    </div>
  );
};

StatisticsPage.propTypes = {
  sensorId: PropTypes.string,
};

StatisticsPage.defaultProps = {
  sensorId: null,
};

export default StatisticsPage;