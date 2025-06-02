// src/pages/Notification.jsx
import { useState, useEffect } from 'react';
import Notice from '../components/Notice';

// eslint-disable-next-line react/prop-types
const Notification = ({ accessToken }) => {
  const [notifications, setNotifications] = useState([]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Gọi API để lấy thông báo
  useEffect(() => {
    console.log('Starting API fetch with accessToken:', accessToken);
    if (!accessToken) {
      console.log('No accessToken provided, skipping API fetch');
      return;
    }

    const fetchNotifications = async () => {
      try {
        console.log('Fetching notifications from API...');
        const response = await fetch('/api/v1/user/me/notifications', {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        console.log('API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response data:', data);

        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          return;
        }

        // Tạo nhiều thông báo từ details
        const formattedNotifications = data.flatMap((item) =>
          item.details?.map((detail, index) => ({
            id: `${item.id}-${index}`,
            sensorId: item.sensorId || 'unknown',
            type: detail.mode?.toLowerCase() || 'info',
            message: `${detail.type} ${detail.mode || ''}`.trim(),
            time: item.timestamp ? formatTimestamp(item.timestamp) : new Date().toLocaleString('en-GB'),
          })) || []
        );

        console.log('Setting notifications:', formattedNotifications);
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [accessToken]);

  // WebSocket để nhận thông báo mới
  useEffect(() => {
    console.log('Starting WebSocket with accessToken:', accessToken);
    if (!accessToken) {
      console.log('No accessToken provided, skipping WebSocket');
      return;
    }

    const socket = new WebSocket(`wss://smarthomeserver-wdt0.onrender.com/ws/notification?token=${accessToken}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
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

      // Kiểm tra loại tin nhắn
      if (parsedData.request) {
        // Thông báo hệ thống (ví dụ: yêu cầu theo dõi cảm biến)
        setNotifications((prev) => [
          {
            id: `system-${Date.now()}`,
            sensorId: parsedData.sensorID || 'unknown',
            type: 'system',
            message: parsedData.request,
            time: new Date().toLocaleString('en-GB'),
            actions: [
              {
                label: 'Accept',
                onClick: () => {
                  console.log('Accept subscription for user:', parsedData.userID);
                  // Gọi API để chấp nhận yêu cầu (nếu có)
                },
                type: 'primary',
              },
              {
                label: 'Decline',
                onClick: () => {
                  console.log('Decline subscription for user:', parsedData.userID);
                  // Gọi API để từ chối yêu cầu (nếu có)
                },
                type: 'secondary',
              },
            ],
          },
          ...prev,
        ]);
      } else if (parsedData.details) {
        // Thông báo cảnh báo (có details)
        const newNotifications = parsedData.details.map((detail, index) => ({
          id: `${parsedData.id || Date.now()}-${index}`,
          sensorId: parsedData.sensorId || 'unknown',
          type: detail.mode?.toLowerCase() || 'info',
          message: `${detail.type} ${detail.mode || ''}`.trim(),
          time: parsedData.timestamp ? formatTimestamp(parsedData.timestamp) : new Date().toLocaleString('en-GB'),
        }));

        setNotifications((prev) => [...newNotifications, ...prev]);
      } else {
        console.warn('Unknown WebSocket message format:', parsedData);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket đã đóng kết nối');
      setTimeout(() => {
        console.log('Reconnecting WebSocket...');
        const newSocket = new WebSocket(`wss://smarthomeserver-1wdh.onrender.com/ws/notification?token=${accessToken}`);
        newSocket.onopen = socket.onopen;
        newSocket.onmessage = socket.onmessage;
        newSocket.onerror = socket.onerror;
        newSocket.onclose = socket.onclose;
      }, 5000);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [accessToken]);

  return (
    <div className="flex flex-col font-poppins space-y-4 p-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        notifications.map((notice) => (
          <Notice
            key={notice.id}
            type={notice.type}
            message={notice.message}
            time={notice.time}
            actions={notice.actions}
          />
        ))
      )}
    </div>
  );
};

export default Notification;