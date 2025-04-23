// src/components/ConfirmForm.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
const ConfirmForm = ({ onConfirm, onCancel, message = "Bạn có chắc chắn muốn xoá mode này?" }) => {
  return (
    <div className="w-4/5 font-poppins flex flex-col gap-4 text-black m-auto justify-between">
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-xl font-medium">{message}</p>
      </div>
      <div className="flex m-auto space-x-16">
        <button onClick={onConfirm} className="bg-blue-400 text-white font-medium py-2 px-6 rounded-full">
          Confirm
        </button>
        <button onClick={onCancel} className="bg-blue-400 text-white font-medium py-2 px-6 rounded-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmForm;