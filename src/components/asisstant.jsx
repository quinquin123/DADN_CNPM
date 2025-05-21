import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const Assistant = ({ accessToken, onLogout, userName = 'User' }) => {
  const [message, setMessage] = useState(`Hi ${userName}, Have a nice day!`);
  // eslint-disable-next-line no-unused-vars
  const [decisionMade, setDecisionMade] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [currentNotificationId, setCurrentNotificationId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      console.log('No accessToken provided, skipping WebSocket');
      return;
    }

    const wsConnection = new WebSocket(`wss://smarthomeserver-1wdh.onrender.com/ws/notification?token=${accessToken}`);

    wsConnection.onopen = () => {
      console.log('WebSocket connected');
    };

    wsConnection.onmessage = (event) => {
      console.log('WebSocket message:', event.data);
      let parsedData;
      try {
        parsedData = JSON.parse(event.data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        return;
      }

      if (parsedData.error) {
        console.error('WebSocket error:', parsedData.error);
        return;
      }

      handleNotification(parsedData);
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsConnection.onclose = () => {
      console.log('WebSocket đã đóng kết nối');
      setTimeout(() => {
        console.log('Reconnecting WebSocket...');
        const newSocket = new WebSocket(`wss://smarthomeserver-1wdh.onrender.com/ws/notification?token=${accessToken}`);
        newSocket.onopen = wsConnection.onopen;
        newSocket.onmessage = wsConnection.onmessage;
        newSocket.onerror = wsConnection.onerror;
        newSocket.onclose = wsConnection.onclose;
        setSocket(newSocket);
      }, 5000);
    };

    setSocket(wsConnection);

    return () => {
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleNotification = (data) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    let newMessage = '';
    let requiresResponse = false;

    if (data.request) {
      newMessage = `Hi ${userName}, ${data.request}`;
      requiresResponse = true;
    } else if (data.details && data.details.length > 0) {
      const detail = data.details[0];
      const notificationType = detail.type || 'Notification';
      const notificationMode = detail.mode || '';

      if (notificationType.toLowerCase().includes('temperature') && notificationMode.toLowerCase().includes('high')) {
        newMessage = `Hi ${userName}, temperature is high so you wanna turn on the air condition?`;
        requiresResponse = true;
      } else {
        newMessage = `Hi ${userName}, ${notificationType} ${notificationMode}`.trim();
        requiresResponse = false;
      }
    }

    setMessage(newMessage);
    setCurrentNotificationId(data.id || data.sensorID || Date.now().toString());
    setDecisionMade(!requiresResponse);

    const newTimeoutId = setTimeout(() => {
      setMessage(`Hi ${userName}, Have a nice day!`);
      setDecisionMade(true);
      setCurrentNotificationId(null);
    }, 10000);

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="flex items-center p-4 bg-gray-800 text-gray-100 font-poppins shadow-md">
      <div className="flex-1">
        <span className="text-lg font-medium text-gray-200">
          {message}
        </span>
      </div>
      <button
        className="ml-4 bg-transparent border-2 border-gray-400 text-gray-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-700 hover:border-gray-300 transition-colors duration-200"
        onClick={onLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default Assistant;