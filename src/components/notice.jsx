// src/components/Notice.jsx
import React from 'react';

const Notice = ({ message, type = 'info', time, actions }) => {
  let bgColor, textColor;
  switch (type) {
    case 'warning':
      bgColor = 'bg-yellow-200';
      textColor = 'text-yellow-800';
      break;
    case 'error':
      bgColor = 'bg-red-200';
      textColor = 'text-red-800';
      break;
    case 'success':
      bgColor = 'bg-green-200';
      textColor = 'text-green-800';
      break;
    default:
      bgColor = 'bg-blue-200';
      textColor = 'text-blue-800';
  }

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg shadow-md font-poppins flex items-center`}>
      {/* Message hiển thị bên trái */}
      <span>{message}</span>
      
      {actions && (
          <div className="flex ml-20 items-center space-x-3">
            {actions}
          </div>
        )}
      {/* Container chứa actions và time, đẩy sang bên phải */}
      <div className="ml-auto flex items-center space-x-3">
        {time && (
          <div className="text-xs text-gray-600">{time}</div>
        )}
      </div>
    </div>
  );
};

export default Notice;