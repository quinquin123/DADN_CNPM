/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Mode from '../components/mode';
import Asisstant from '../components/asisstant'; 

const HomePage = ({ onLogout, sensorId }) => {
  const [lightOn, setLightOn] = useState(true);
  const [lightMode, setLightMode] = useState('Warm');
  const [lightLevel, setLightLevel] = useState(50);
  const [airConditionOn, setAirConditionOn] = useState(true);
  const [acMode, setAcMode] = useState('Cool');
  const [temperature, setTemperature] = useState(25);
  const [airPurifierOn, setAirPurifierOn] = useState(true);
  const [currentMode, setCurrentMode] = useState('default');
  const [humidity, setHumidity] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [socket, setSocket] = useState(null);
  const [newSensorId, setNewSensorId] = useState(''); // State cho ô nhập sensorId
  const [registrationError, setRegistrationError] = useState(null);

  const accessToken = localStorage.getItem('accessToken') || "default-token";

  // WebSocket setup (chỉ chạy nếu có sensorId)
  useEffect(() => {
    if (sensorId) {
      const ws = new WebSocket(`wss://smarthomeserver-1wdh.onrender.com/ws/realtime?token=${accessToken}`);
      setSocket(ws);

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (parsedData.error) {
            console.error("Lỗi từ server:", parsedData.error);
            return;
          }
          setLightOn(parsedData.led_mode > 0);
          setLightLevel(parsedData.led_brightness || 0);
          setAirConditionOn(parsedData.fan_mode > 0);
          setTemperature(parsedData.temperature || 25);
          setHumidity(parsedData.humidity || 0);
          setLightIntensity(parsedData.light_intensity || 0);
        } catch (err) {
          console.error("Lỗi khi parse JSON:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket đã đóng kết nối.");
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [accessToken, sensorId]);

  const sendControlCommand = (command) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(command));
    } else {
      console.log("WebSocket chưa sẵn sàng.");
    }
  };

  const toggleLight = () => {
    const newState = !lightOn;
    setLightOn(newState);
    sendControlCommand({ led_mode: newState ? 1 : 0 });
  };

  const toggleAirCondition = () => {
    const newState = !airConditionOn;
    setAirConditionOn(newState);
    sendControlCommand({ fan_mode: newState ? 1 : 0 });
  };

  const toggleAirPurifier = () => {
    setAirPurifierOn(!airPurifierOn);
  };

  const handleLightLevelChange = (value) => {
    setLightLevel(value);
    sendControlCommand({ led_brightness: value });
  };

  const handleTemperatureChange = (value) => {
    setTemperature(value);
    sendControlCommand({ temperature: value });
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    sendModeToBackend(mode);
  };

  const sendModeToBackend = (mode) => {
    console.log(`Switching to ${mode} mode - sending to backend`);
  };

  const handleLogout = () => {
    onLogout();
  };

  // Hàm đăng ký sensorId với API mới
  const handleRegisterSensor = async () => {
    if (!newSensorId) {
      setRegistrationError("Vui lòng nhập Sensor ID");
      return;
    }

    try {
      const response = await fetch(`/api/v1/sensor/${newSensorId}/user/subscribe`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrationError(null);
        console.log(data.message); // "Subscribed successfully"
        window.location.reload(); // Reload để cập nhật sensorId từ API /me
      } else {
        const errorData = await response.json();
        switch (response.status) {
          case 404:
            setRegistrationError("Cảm biến hoặc người dùng không tồn tại");
            break;
          case 409:
            setRegistrationError("Cảm biến đã được gán cho người dùng khác");
            break;
          case 500:
            setRegistrationError("Lỗi server, vui lòng thử lại sau");
            break;
          default:
            setRegistrationError(errorData.message || "Đăng ký thất bại");
        }
      }
    } catch (error) {
      setRegistrationError("Lỗi kết nối, vui lòng kiểm tra mạng");
      console.error("Lỗi khi gọi API đăng ký sensor:", error);
    }
  };

  // Nếu chưa có sensorId, hiển thị giao diện đăng ký
  if (!sensorId) {
    return (
      <div className="w-full font-poppins flex flex-col text-black h-screen bg-gray-200 justify-center items-center">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register Sensor</h2>
          <div className="mb-6">
            <label htmlFor="sensorId" className="block text-sm font-medium text-gray-700 mb-2">
              Sensor ID
            </label>
            <input
              id="sensorId"
              type="text"
              value={newSensorId}
              onChange={(e) => setNewSensorId(e.target.value)}
              placeholder="Enter Sensor ID"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={handleRegisterSensor}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Submit Registration Request
          </button>
          {registrationError && (
            <p className="text-red-500 mt-4 text-center text-sm">{registrationError}</p>
          )}
        </div>
      </div>
    );
  }

  // Nếu đã có sensorId, hiển thị giao diện hiện tại
  return (
    <div className="w-full font-poppins flex flex-col text-black h-screen bg-gray-200">
      <div className="flex-1 p-4 flex gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex gap-4 mb-2">
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
              <div className="text-xl font-medium">Temperature</div>
              <div className="text-2xl font-medium">{temperature}°C</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
              <div className="text-xl font-medium">Light</div>
              <div className="text-2xl font-medium">{lightIntensity} lux</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
              <div className="text-xl font-medium">Humidity</div>
              <div className="text-2xl font-medium">{humidity}%</div>
            </div>
          </div>

          <Mode 
            mode="default"
            label="Default Mode"
            isActive={currentMode === 'default'}
            onClick={() => switchMode('default')}
          />
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <Mode 
              key={i}
              mode={`reading-${i}`}
              label="Reading Book Mode"
              isActive={currentMode === `reading-${i}`}
              onClick={() => switchMode(`reading-${i}`)}
            />
          ))}
        </div>
        
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-medium">Light</span>
              <button 
                className={`font-medium py-1 px-6 rounded-full ${lightOn ? 'bg-blue-400 text-white' : 'bg-red-600 text-white'}`}
                onClick={toggleLight}
              >
                {lightOn ? 'On' : 'Off'}
              </button>
            </div>
            <div className={`${!lightOn ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex justify-between mb-6">
                {['Cold', 'Cool', 'Warm', 'Hot'].map((mode) => (
                  <div key={mode} className="flex flex-col items-center">
                    <div 
                      className={`w-6 h-6 rounded-sm border-2 border-gray-300 cursor-pointer ${lightMode === mode ? 'bg-black' : ''}`}
                      onClick={() => setLightMode(mode)}
                    />
                    <span className="mt-1">{mode}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-lg mb-2">Level</div>
                <div className="h-2 bg-gray-300 rounded-full relative">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={lightLevel}
                    onChange={(e) => handleLightLevelChange(parseInt(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-black rounded-full"
                    style={{ left: `${lightLevel}%` }}
                  />
                </div>
                <div className="text-right mt-1">{lightLevel}%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-medium">Air condition</span>
              <button 
                className={`font-medium py-1 px-6 rounded-full ${airConditionOn ? 'bg-blue-400 text-white' : 'bg-red-600 text-white'}`}
                onClick={toggleAirCondition}
              >
                {airConditionOn ? 'On' : 'Off'}
              </button>
            </div>
            <div className={`${!airConditionOn ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex justify-between mb-6">
                {['Cold', 'Cool', 'Warm', 'Hot'].map((mode) => (
                  <div key={mode} className="flex flex-col items-center">
                    <div 
                      className={`w-6 h-6 rounded-sm border-2 border-gray-300 cursor-pointer ${acMode === mode ? 'bg-black' : ''}`}
                      onClick={() => setAcMode(mode)}
                    />
                    <span className="mt-1">{mode}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-lg mb-2">Temperature</div>
                <div className="flex items-center justify-center">
                  <button 
                    className="w-8 h-8 rounded-full bg-white border border-gray-400 flex items-center justify-center"
                    onClick={() => handleTemperatureChange(Math.max(16, temperature - 1))}
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <span className="mx-4 text-2xl font-medium">{temperature}°C</span>
                  <button 
                    className="w-8 h-8 rounded-full bg-white border border-gray-400 flex items-center justify-center"
                    onClick={() => handleTemperatureChange(Math.min(30, temperature + 1))}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium">Air Purifier</span>
              <button 
                className={`font-medium py-1 px-6 rounded-full ${airPurifierOn ? 'bg-blue-400 text-white' : 'bg-red-600 text-white'}`}
                onClick={toggleAirPurifier}
              >
                {airPurifierOn ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;