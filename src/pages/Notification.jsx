// src/pages/Notification.jsx
import React from 'react';
import Notice from '../components/notice';

const Notification = () => {
  // Hàm xử lý khi nhấn nút Yes
  const handleAccept = () => {
    console.log("User accepted the new member request");
    // Thực hiện các hành động khác như gọi API, cập nhật state, v.v.
  };

  // Hàm xử lý khi nhấn nút No
  const handleDecline = () => {
    console.log("User declined the new member request");
    // Thực hiện các hành động khác như gọi API, cập nhật state, v.v.
  };

  // Mảng thông báo mô phỏng từ backend
  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Warning: Temperature is high',
      time: '17/02/2025, 22:56',
    },
    {
      id: 2,
      type: 'error',
      message: 'Warning: Temperature is too high (auto control)',
      time: '17/02/2025, 22:56',
    },
    {
      id: 3,
      type: 'success',
      message: 'UserA request to be new member in YoloHome',
      time: '17/02/2025, 22:56',
      actions: (
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="bg-blue-600 text-white font-medium py-1 px-6 rounded-full"
          >
            Yes
          </button>
          <button
            onClick={handleDecline}
            className="bg-blue-600 text-white font-medium py-1 px-6 rounded-full"
          >
            No
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col font-poppins space-y-4 p-4">
      {notifications.map((notice) => (
        <Notice
          key={notice.id}
          type={notice.type}
          message={notice.message}
          time={notice.time}
          actions={notice.actions}
        />
      ))}
    </div>
  );
};

export default Notification;