/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Mode from '../components/mode';

const HomePage = ({ onLogout, sensorId }) => {
  const [deviceState, setDeviceState] = useState({
    lightOn: true,
    lightMode: 'Warm',
    lightLevel: 50,
    fanMode: 0,
    temperature: 25,
    humidity: 0,
    lightIntensity: 0,
  });

  const [appState, setAppState] = useState({
    currentMode: 'null',
    modes: [],
    loadingModeId: null,
    errorMessage: null,
  });

  const [connectionState, setConnectionState] = useState({
    socket: null,
    newSensorId: '',
    registrationError: null,
  });

  const accessToken = localStorage.getItem('accessToken') || 'default-token';

  // Fetch modes from API
  useEffect(() => {
    const fetchModes = async () => {
      try {
        const response = await fetch(`/api/v1/user/me/mode-configs`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: '*/*',
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setAppState((prev) => ({
          ...prev,
          modes: data,
          currentMode: data.length > 0 ? data[0].id : null,
        }));

        if (data.length > 0) {
          switchMode(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching modes:', error);
        setAppState((prev) => ({
          ...prev,
          errorMessage: 'Could not load modes. Please try again.',
        }));
      }
    };

    fetchModes();
  }, [accessToken]);

  // WebSocket setup
  useEffect(() => {
    if (!sensorId) return;

    const ws = new WebSocket(`wss://smarthomeserver-1wdh.onrender.com/ws/realtime?token=${accessToken}`);

    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('Server error:', data.error);
          return;
        }

        setDeviceState((prev) => ({
          ...prev,
          lightOn: data.led_mode > 0,
          lightLevel: data.led_brightness || prev.lightLevel,
          fanMode: data.fan_mode || prev.fanMode,
          humidity: data.humidity || prev.humidity,
          lightIntensity: data.light_intensity || prev.lightIntensity,
          temperature: data.temperature || prev.temperature,
        }));
      } catch (err) {
        console.error('JSON parse error:', err);
      }
    };

    ws.onclose = () => console.log('WebSocket disconnected');

    setConnectionState((prev) => ({ ...prev, socket: ws }));

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [sensorId, accessToken]);

  // Control functions
  const sendControlCommand = (command) => {
    const { socket } = connectionState;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(command));
    } else {
      console.warn('WebSocket not ready');
    }
  };

  const toggleLight = () => {
    const newState = !deviceState.lightOn;
    setDeviceState((prev) => ({ ...prev, lightOn: newState }));
    sendControlCommand({ led_mode: newState ? 1 : 0 });
  };

  const handleLightChange = (mode, level) => {
    const updates = {};
    if (mode !== undefined) {
      updates.lightMode = mode;
    }
    if (level !== undefined) {
      updates.lightLevel = level;
      sendControlCommand({ led_brightness: level });
    }
    setDeviceState((prev) => ({ ...prev, ...updates }));
  };

  const handleFanModeChange = (mode) => {
    setDeviceState((prev) => ({ ...prev, fanMode: mode }));
    sendControlCommand({ fan_mode: mode });
  };

  const switchMode = async (modeId) => {
    try {
      setAppState((prev) => ({ ...prev, loadingModeId: modeId }));

      const response = await fetch(`/api/v1/user/me/mode-configs/${modeId}/activate`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: '*/*',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Mode activated:', data.message);

      const selectedMode = appState.modes.find((mode) => mode.id === modeId);
      if (selectedMode) {
        const ledModeMap = { 1: 'Cold', 2: 'Cool', 3: 'Warm', 4: 'Hot' };

        setDeviceState({
          lightOn: selectedMode.ledMode > 0,
          lightMode: ledModeMap[selectedMode.ledMode] || 'Warm',
          lightLevel: selectedMode.brightness,
          fanMode: selectedMode.fanMode,
          temperature: deviceState.temperature,
          humidity: deviceState.humidity,
          lightIntensity: deviceState.lightIntensity,
        });

        setAppState((prev) => ({ ...prev, currentMode: modeId }));

        sendControlCommand({
          led_mode: selectedMode.ledMode,
          led_brightness: selectedMode.brightness,
          fan_mode: selectedMode.fanMode,
        });
      }
    } catch (error) {
      console.error('Mode activation failed:', error);
      let errorMsg = 'Error activating mode. Please try again.';
      if (error.message.includes('409')) errorMsg = 'This mode is already active';
      if (error.message.includes('404')) errorMsg = 'Mode not found';

      setAppState((prev) => ({ ...prev, errorMessage: errorMsg }));
    } finally {
      setAppState((prev) => ({ ...prev, loadingModeId: null }));
    }
  };

  const handleRegisterSensor = async () => {
    const { newSensorId } = connectionState;
    if (!newSensorId) {
      setConnectionState((prev) => ({ ...prev, registrationError: 'Please enter Sensor ID' }));
      return;
    }

    try {
      const response = await fetch(`/api/v1/sensor/${newSensorId}/user/subscribe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConnectionState((prev) => ({ ...prev, registrationError: null }));
        console.log('Sensor registered:', data.message);
        window.location.reload();
      } else {
        const errorData = await response.json();
        const errorMap = {
          404: 'Sensor or user not found',
          409: 'Sensor already assigned to another user',
          500: 'Server error, please try again later',
        };

        setConnectionState((prev) => ({
          ...prev,
          registrationError: errorMap[response.status] || errorData.message || 'Registration failed',
        }));
      }
    } catch (error) {
      setConnectionState((prev) => ({
        ...prev,
        registrationError: 'Connection error, please check your network',
      }));
      console.error('Sensor registration error:', error);
    }
  };

  // Render functions
  if (!sensorId) {
    return (
      <div className="w-full font-poppins flex flex-col text-gray-100 h-screen bg-gray-900 justify-center items-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Register Sensor</h2>
          <div className="mb-6">
            <label htmlFor="sensorId" className="block text-sm font-medium text-gray-300 mb-2">
              Sensor ID
            </label>
            <input
              id="sensorId"
              type="text"
              value={connectionState.newSensorId}
              onChange={(e) =>
                setConnectionState((prev) => ({
                  ...prev,
                  newSensorId: e.target.value,
                  registrationError: null,
                }))
              }
              placeholder="Enter Sensor ID"
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={handleRegisterSensor}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Submit Registration Request
          </button>
          {connectionState.registrationError && (
            <p className="text-red-400 mt-4 text-center text-sm">
              {connectionState.registrationError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-poppins flex flex-col text-gray-100 h-screen bg-gray-900">
      <div className="flex-1 p-6 flex gap-6">
        {/* Left panel - Sensor data and modes */}
        <div className="w-1/2 flex flex-col gap-6">
          <div className="flex gap-6 mb-4">
            <SensorDisplay label="Temperature" value={`${deviceState.temperature}°C`} />
            <SensorDisplay label="Light" value={`${deviceState.lightIntensity} lux`} />
            <SensorDisplay label="Humidity" value={`${deviceState.humidity}%`} />
          </div>

          {appState.modes.length > 0 ? (
            appState.modes.map((mode) => (
              <Mode
                key={mode.id}
                mode={mode.id}
                label={mode.name}
                isActive={appState.currentMode === mode.id}
                isLoading={appState.loadingModeId === mode.id}
                onClick={() => switchMode(mode.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">
              Loading... Please create a new mode.
            </p>
          )}
        </div>

        {/* Right panel - Controls */}
        <div className="w-1/2 flex flex-col gap-6">
          <LightControl
            lightOn={deviceState.lightOn}
            lightMode={deviceState.lightMode}
            lightLevel={deviceState.lightLevel}
            onToggle={toggleLight}
            onModeChange={(mode) => handleLightChange(mode)}
            onLevelChange={(level) => handleLightChange(undefined, level)}
          />
          <FanControl currentMode={deviceState.fanMode} onModeChange={handleFanModeChange} />
        </div>
      </div>
    </div>
  );
};

// Sub-components for better readability
const SensorDisplay = ({ label, value }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-4 flex-1 flex flex-col items-center">
    <div className="text-lg font-medium text-gray-300">{label}</div>
    <div className="text-xl font-semibold text-gray-100">{value}</div>
  </div>
);

const LightControl = ({ lightOn, lightMode, lightLevel, onToggle, onModeChange, onLevelChange }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-medium text-gray-100">Light</span>
      <button
        className={`font-medium py-2 px-6 rounded-lg ${
          lightOn ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-white hover:bg-gray-700'
        } transition-colors duration-200`}
        onClick={onToggle}
      >
        {lightOn ? 'On' : 'Off'}
      </button>
    </div>

    <div className={`${!lightOn ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between mb-6">
        {['Cold', 'Cool', 'Warm', 'Hot'].map((mode) => (
          <div key={mode} className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full border-2 border-gray-500 cursor-pointer ${
                lightMode === mode ? 'bg-blue-600' : 'bg-gray-700'
              } hover:bg-blue-500 transition-colors duration-200`}
              onClick={() => onModeChange(mode)}
            />
            <span className="mt-1 text-gray-300">{mode}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="text-lg text-gray-300 mb-2">Level</div>
        <div className="h-2 bg-gray-600 rounded-full relative">
          <input
            type="range"
            min="0"
            max="100"
            value={lightLevel}
            onChange={(e) => onLevelChange(parseInt(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"
            style={{ left: `${lightLevel}%` }}
          />
        </div>
        <div className="text-right mt-1 text-gray-300">{lightLevel}%</div>
      </div>
    </div>
  </div>
);

const FanControl = ({ currentMode, onModeChange }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-6">
    <div className="text-lg font-medium text-gray-100 mb-4">Fan Mode</div>
    <div className="grid grid-cols-4 gap-2">
      {[
        { value: 0, label: 'Off' },
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' },
      ].map((mode) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          className={`py-2 rounded-lg font-medium ${
            currentMode === mode.value
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          } transition-colors duration-200`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  </div>
);

export default HomePage;