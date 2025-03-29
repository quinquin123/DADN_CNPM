// src/components/asisstant.jsx
import React, { useState } from 'react';

const Asisstant = ({ onLogout, userName = 'Mike' }) => {
  // State để lưu thông báo hiện tại
  const [message, setMessage] = useState(
    `Hi ${userName}, temperature is high so you wanna turn on the air condition?`
  );
  // State để kiểm tra đã đưa ra quyết định hay chưa
  const [decisionMade, setDecisionMade] = useState(false);

  // Hàm gọi API khi bấm Yes
  const handleYesClick = async () => {
    try {
      const response = await fetch('/api/v1/some-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'yes' }),
      });
      
      // Nếu cần xử lý dữ liệu trả về
      const data = await response.json();
      console.log('Yes response:', data);
      // Sau khi xử lý, cập nhật nội dung thông báo
      setMessage(`Hi ${userName}, Have a nice day!`);
      setDecisionMade(true);
    } catch (error) {
      console.error('Error sending Yes:', error);
    }
  };

  // Hàm gọi API khi bấm No
  const handleNoClick = async () => {
    try {
      const response = await fetch('/api/v1/some-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'no' }),
      });
      // Nếu cần xử lý dữ liệu trả về
      const data = await response.json();
      console.log('No response:', data);
      // Sau khi xử lý, cập nhật nội dung thông báo
      setMessage(`Hi ${userName}, Have a nice day!`);
      setDecisionMade(true);
    } catch (error) {
      console.error('Error sending No:', error);
    }
  };

  return (
    <div className="flex items-center p-4 bg-white text-black text-base">
      <div className="flex items-center">
        <span className="text-gray-800 font-medium text-xl">
          {message}
        </span>
      </div>
      {/* Chỉ hiển thị 2 nút nếu chưa đưa ra quyết định */}
      {!decisionMade && (
        <div className="flex ml-5 space-x-2">
          <button
            className="bg-blue-400 text-white font-medium py-1 px-6 rounded-full"
            onClick={handleYesClick}
          >
            Yes
          </button>
          <button
            className="bg-blue-400 text-white font-medium py-1 px-6 rounded-full"
            onClick={handleNoClick}
          >
            No
          </button>
        </div>
      )}
      <button
        className="ml-auto mr-4 border-2 border-black rounded-full px-4 py-1 font-medium text-black"
        onClick={onLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default Asisstant;