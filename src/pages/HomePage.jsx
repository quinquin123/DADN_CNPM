import React, { useState } from 'react';

const HomePage = () => {
// Merged state
const [lightOn, setLightOn] = useState(true);
const [lightMode, setLightMode] = useState('Warm');
const [lightLevel, setLightLevel] = useState(50);

const [airConditionOn, setAirConditionOn] = useState(true);
const [acMode, setAcMode] = useState('Cool');
const [temperature, setTemperature] = useState(25);

const [airPurifierOn, setAirPurifierOn] = useState(true);
const [currentMode, setCurrentMode] = useState('default');
  // Toggle functions with visual feedback
  const toggleLight = () => {
    setLightOn(!lightOn);
    // You can add backend API call here
  };

  const toggleAirCondition = () => {
    setAirConditionOn(!airConditionOn);
    // You can add backend API call here
  };

  const toggleAirPurifier = () => {
    setAirPurifierOn(!airPurifierOn);
    // You can add backend API call here
  };


  // Function to handle mode switching
  const switchMode = (mode) => {
    setCurrentMode(mode);
    
    // Send data to backend
    sendModeToBackend(mode);
  };

  // Function to simulate sending data to backend
  const sendModeToBackend = (mode) => {
    console.log(`Switching to ${mode} mode - sending to backend`);
    // In a real application, you would use fetch or axios here
    // Example:
    // fetch('/api/switch-mode', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ mode })
    // });
  };

  return (
    <div className="w-full font-poppins flex flex-col text-black h-screen bg-gray-200">
      {/* Top bar */}
      <div className="flex items-center p-4 bg-white">
        <div className="flex items-center">
          <span className="text-gray-800 font-medium">Hi Mike, temperature is high so you wanna turn on the air condition?</span>
        </div>
        <div className="flex ml-5 space-x-2">
          <button className="bg-blue-400 text-white font-medium py-1 px-6 rounded-full">Yes</button>
          <button className="bg-blue-400 text-white font-medium py-1 px-6 rounded-full">No</button>
        </div>
        <button className=" ml-auto mr-4 border border-black rounded-full px-4 py-1 font-medium">Log out</button>

      </div>
      
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
                  <div 
            className={`${currentMode === 'default' ? 'bg-green-300' : 'bg-white'} rounded-lg p-4 text-center font-medium text-lg shadow-md cursor-pointer transition-colors duration-200`}
            onClick={() => switchMode('default')}
          >
            Default Mode
          </div>
          
          {/* Reading book mode repeats */}
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div 
              key={i} 
              className={`${currentMode === `reading-${i}` ? 'bg-green-300' : 'bg-white'} rounded-lg shadow-md p-4 text-center font-medium text-lg cursor-pointer transition-colors duration-200`}
              onClick={() => switchMode(`reading-${i}`)}
            >
              Reading Book Mode
            </div>
          ))}
        </div>
        
        {/* Right panel - Controls */}
        <div className="w-1/2 flex flex-col gap-4">
      {/* Light control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-medium">Light</span>
          <button 
            className={`font-medium py-1 px-6 rounded-full ${
              lightOn 
                ? 'bg-blue-400 text-white' 
                : 'bg-red-600 text-white'
            }`}
            onClick={toggleLight}
          >
            {lightOn ? 'On' : 'Off'}
          </button>
        </div>
        
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
      
      {/* Air condition control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-medium">Air condition</span>
          <button 
            className={`font-medium py-1 px-6 rounded-full ${
              airConditionOn 
                ? 'bg-blue-400 text-white' 
                : 'bg-red-600 text-white'
            }`}
            onClick={toggleAirCondition}
          >
            {airConditionOn ? 'On' : 'Off'}
          </button>
        </div>
        
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
      
      {/* Air purifier */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">Air Purifier</span>
          <button 
            className={`font-medium py-1 px-6 rounded-full ${
              airPurifierOn 
                ? 'bg-blue-400 text-white' 
                : 'bg-red-600 text-white'
            }`}
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