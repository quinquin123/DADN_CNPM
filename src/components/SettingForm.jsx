// src/components/SettingForm.jsx
import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
const SettingForm = ({ initialData = {}, onConfirm, onCancel, isEditingDefault = false }) => {
  const [name, setName] = useState(initialData.name || '');
  const [lightOn, setLightOn] = useState(initialData.ledMode !== 0);
  const [lightMode, setLightMode] = useState(
    initialData.ledMode === 1 ? 'Cold' :
    initialData.ledMode === 2 ? 'Cool' :
    initialData.ledMode === 3 ? 'Warm' :
    initialData.ledMode === 4 ? 'Hot' : 'Warm'
  );
  const [lightLevel, setLightLevel] = useState(initialData.brightness || 50);
  const [fanMode, setFanMode] = useState(initialData.fanMode || 0);

  const handleConfirm = () => {
    const ledModeMap = {
      Cold: 1,
      Cool: 2,
      Warm: 3,
      Hot: 4,
    };
    const ledMode = lightOn ? ledModeMap[lightMode] : 0;

    const formData = {
      name: isEditingDefault ? 'Default Mode' : name.trim(),
      ledMode,
      brightness: lightLevel,
      fanMode,
    };

    if (!formData.name && !isEditingDefault) {
      alert('Please enter mode name.');
      return;
    }

    onConfirm(formData);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const toggleLight = () => setLightOn(!lightOn);

  const handleFanModeChange = (mode) => {
    setFanMode(mode);
  };

  return (
    <div className="w-4/5 font-poppins flex flex-col gap-4 text-black m-auto justify-between">
      {/* Mode name */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-xl font-medium mb-4">Mode name</div>
        <input
          type="text"
          value={isEditingDefault ? 'Default Mode' : name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên chế độ"
          className={`w-full p-2 border rounded ${isEditingDefault ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          required={!isEditingDefault}
          disabled={isEditingDefault}
        />
      </div>

      {/* Light control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-medium">Light</span>
          <button
            className={`font-medium py-1 px-6 rounded-full ${
              lightOn ? 'bg-blue-400 text-white' : 'bg-red-600 text-white'
            }`}
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
                  className={`w-6 h-6 rounded-sm border-2 border-gray-300 cursor-pointer ${
                    lightMode === mode ? 'bg-black' : ''
                  }`}
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

      {/* Fan control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-xl font-medium mb-4">Fan Mode</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 0, label: 'Off' },
            { value: 1, label: 'Low' },
            { value: 2, label: 'Medium' },
            { value: 3, label: 'High' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleFanModeChange(mode.value)}
              className={`py-2 rounded-lg ${
                fanMode === mode.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex m-auto space-x-16">
        <button
          onClick={handleConfirm}
          className="bg-blue-400 text-white font-medium py-2 px-6 rounded-full"
        >
          Confirm
        </button>
        <button
          onClick={handleCancel}
          className="bg-blue-400 text-white font-medium py-2 px-6 rounded-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SettingForm;