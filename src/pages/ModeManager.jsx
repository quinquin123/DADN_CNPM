// src/pages/ModeManager.jsx
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import SettingForm from '../components/SettingForm';
import ConfirmForm from '../components/ConfirmForm';

const ModeManager = () => {
  const [modes, setModes] = useState([
    'Default Setting (Require)',
    'A Mode',
    'A Mode',
    'A Mode',
    'A Mode'
  ]);

  // State để hiển thị ẩn/hiện SettingForm (modal)
  const [showSettingForm, setShowSettingForm] = useState(false);

  // State để hiển thị ẩn/hiện ConfirmForm (modal) khi xoá mode
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  // Lưu lại index của mode cần xoá
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleCreateNewMode = () => {
    // Mở SettingForm để tạo mode mới
    setShowSettingForm(true);
  };

  const handleEditMode = (index) => {
    // Mở SettingForm để chỉnh sửa mode (logic load dữ liệu mode có thể bổ sung sau)
    setShowSettingForm(true);
  };

  // Khi bấm nút Trash, mở modal ConfirmForm
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowConfirmForm(true);
  };

  // Hàm xử lý Confirm xoá mode (gọi API và cập nhật state)
  const confirmDelete = async () => {
    try {
      const response = await fetch('/api/v1/mode/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Gửi thông tin mode cần xoá (ở đây gửi tên mode, có thể thay đổi nếu dùng id)
        body: JSON.stringify({ mode: modes[deleteIndex] }),
      });
      const data = await response.json();
      console.log('Delete API response:', data);
    } catch (error) {
      console.error('Error deleting mode:', error);
    } finally {
      if (deleteIndex !== null) {
        setModes(modes.filter((_, i) => i !== deleteIndex));
      }
      setShowConfirmForm(false);
      setDeleteIndex(null);
    }
  };

  // Đóng modal ConfirmForm khi nhấn Cancel
  const handleCancelDelete = () => {
    setShowConfirmForm(false);
    setDeleteIndex(null);
  };

  return (
    <div className="flex p-4 space-x-4 items-start">
      {/* Mode Manager */}
      <div className="w-1/2 border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Mode Manager</h2>
          <button 
            onClick={handleCreateNewMode}
            className="bg-blue-500 text-white px-3 py-2 rounded-full flex items-center"
          >
            <span className="mr-2">+</span>
            Create new mode
          </button>
        </div>
        <div className="text-black space-y-2">
          {modes.map((mode, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
            >
              <span>{mode}</span>
              <div className="flex items-center space-x-2">
                <button
                  className="text-gray-600 hover:text-blue-500"
                  onClick={() => handleEditMode(index)}
                >
                  <Edit size={20} />
                </button>
                {mode !== 'Default Setting (Require)' && (
                  <button 
                    onClick={() => handleDeleteClick(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety System */}
      <div className="w-1/2 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Safety System</h2>
        <div className="space-y-2 text-black">
          {[
            'Auto Control (Require)',
            'Warning (Require)'
          ].map((setting, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
            >
              <span>{setting}</span>
              <button className="text-gray-600 hover:text-blue-500">
                <Edit size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal hiển thị SettingForm */}
      {showSettingForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-gray-200 py-8 rounded-xl shadow-md w-1/3">
            <SettingForm 
              onConfirm={() => setShowSettingForm(false)} 
              onCancel={() => setShowSettingForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Modal hiển thị ConfirmForm */}
      {showConfirmForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white py-8 rounded-xl  w-1/3">
            <ConfirmForm 
              message="Delete this mode?" 
              onConfirm={confirmDelete}
              onCancel={handleCancelDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeManager;