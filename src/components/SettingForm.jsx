// src/components/SettingForm.jsx
import React, { useState } from 'react';

const SettingForm = ({ onConfirm, onCancel }) => {
  // State cho Light
  const [lightOn, setLightOn] = useState(true);
  const [lightMode, setLightMode] = useState('Warm');
  const [lightLevel, setLightLevel] = useState(50);

  // State cho Air Condition
  const [airConditionOn, setAirConditionOn] = useState(true);
  const [acMode, setAcMode] = useState('Cool');
  const [temperature, setTemperature] = useState(25);

  // State cho Air Purifier
  const [airPurifierOn, setAirPurifierOn] = useState(true);

  // Toggle functions
  const toggleLight = () => setLightOn(!lightOn);
  const toggleAirCondition = () => setAirConditionOn(!airConditionOn);
  const toggleAirPurifier = () => setAirPurifierOn(!airPurifierOn);

  // Khi nhấn Confirm (Yes): gửi API cho backend, sau đó đóng form
  const handleConfirm = async () => {
    try {
      const response = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lightOn,
          lightMode,
          lightLevel,
          airConditionOn,
          acMode,
          temperature,
          airPurifierOn,
        }),
      });
      const data = await response.json();
      console.log('API response:', data);
    } catch (error) {
      console.error('Error sending settings:', error);
    } finally {
      if (onConfirm) onConfirm(); // Đóng form sau khi nhấn Confirm
    }
  };

  // Khi nhấn Cancel (No): chỉ đóng form
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="w-4/5 font-poppins flex flex-col gap-4 text-black m-auto justify-between">
      {/* Light control */}
      <div className="bg-white rounded-lg shadow-md p-6 ">
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

      {/* 2 nút Confirm & Cancel */}
      <div className="flex m-auto space-x-16">
        <button onClick={handleConfirm} className="bg-blue-400 text-white font-medium py-2 px-6 rounded-full">
          Confirm
        </button>
        <button onClick={handleCancel} className="bg-blue-400 text-white font-medium py-2 px-6 rounded-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SettingForm;