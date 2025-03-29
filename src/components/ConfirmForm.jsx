// src/components/ConfirmForm.jsx
import React from 'react';

const ConfirmForm = ({ onConfirm, onCancel, message = "Bạn có chắc chắn muốn xoá mode này?" }) => {
  // Khi nhấn Confirm, gọi API và sau đó đóng form
  const handleConfirm = async () => {
    try {
      const response = await fetch('/api/v1/mode/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Bạn có thể truyền thêm thông tin cần thiết (ví dụ mode id) nếu có
        body: JSON.stringify({ /* modeId: ... */ }),
      });
      const data = await response.json();
      console.log('Delete API response:', data);
    } catch (error) {
      console.error('Error deleting mode:', error);
    } finally {
      if (onConfirm) onConfirm(); // Đóng form sau khi Confirm
    }
  };

  // Khi nhấn Cancel, chỉ đóng form
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="w-4/5 font-poppins flex flex-col gap-4 text-black m-auto justify-between">
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-xl font-medium">{message}</p>
      </div>
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

export default ConfirmForm;