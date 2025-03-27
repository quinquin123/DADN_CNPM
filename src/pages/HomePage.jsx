// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Mode from '../components/mode';
import Asisstant from '../components/asisstant';  // Import component mới

const HomePage = ({ onLogout }) => {
  const [lightOn, setLightOn] = useState(true);
  const [lightMode, setLightMode] = useState('Warm');
  const [lightLevel, setLightLevel] = useState(50);

  const [airConditionOn, setAirConditionOn] = useState(true);
  const [acMode, setAcMode] = useState('Cool');
  const [temperature, setTemperature] = useState(25);

  const [airPurifierOn, setAirPurifierOn] = useState(true);
  const [currentMode, setCurrentMode] = useState('default');

  // Toggle functions
  const toggleLight = () => setLightOn(!lightOn);
  const toggleAirCondition = () => setAirConditionOn(!airConditionOn);
  const toggleAirPurifier = () => setAirPurifierOn(!airPurifierOn);

  // Hàm xử lý chuyển đổi chế độ
  const switchMode = (mode) => {
    setCurrentMode(mode);
    sendModeToBackend(mode);
  };

  // Giả lập gửi dữ liệu đến backend
  const sendModeToBackend = (mode) => {
    console.log(`Switching to ${mode} mode - sending to backend`);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="w-full font-poppins flex flex-col text-black h-screen bg-gray-200">
      
      {/* Main content */}
      <div className="flex-1 p-4 flex gap-4">
        {/* Left panel */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Sensor readings */}
          <div className="flex gap-4 mb-2">
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
              <div className="text-xl font-medium">Temperature</div>
              <div className="text-2xl font-medium">60°C</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
              <div className="text-xl font-medium">Light</div>
              <div className="text-2xl font-medium">18 lux</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
              <div className="text-xl font-medium">Humidity</div>
              <div className="text-2xl font-medium">80%</div>
            </div>
          </div>

          {/* Mode buttons */}
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
        
        {/* Right panel - Controls */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Light control */}
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
            {/* Container cho giao diện điều chỉnh */}
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
                    onChange={(e) => setLightLevel(parseInt(e.target.value))}
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
          
          {/* Air condition control */}
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
            {/* Container cho giao diện điều chỉnh */}
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
                    onClick={() => setTemperature(Math.max(16, temperature - 1))}
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <span className="mx-4 text-2xl font-medium">{temperature}°C</span>
                  <button 
                    className="w-8 h-8 rounded-full bg-white border border-gray-400 flex items-center justify-center"
                    onClick={() => setTemperature(Math.min(30, temperature + 1))}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Air purifier */}
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
