/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import SettingForm from '../components/SettingForm';
import ConfirmForm from '../components/ConfirmForm';

const ModeManager = () => {
  const [modes, setModes] = useState([]);
  const [showSettingForm, setShowSettingForm] = useState(false);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [deleteModeId, setDeleteModeId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const DEFAULT_MODE_NAME = 'Default Mode';

  const getAuthToken = () => localStorage.getItem('accessToken') || '';

  const createDefaultMode = async () => {
    try {
      const response = await fetch(`/api/v1/user/me/mode-configs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          name: DEFAULT_MODE_NAME,
          ledMode: 3, // Warm
          brightness: 50,
          fanMode: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating default mode:', error);
      setError('Failed to create default mode.');
    }
  };

  const fetchModes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/user/me/mode-configs`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Kiểm tra xem có Default Mode không
      const hasDefaultMode = data.some((mode) => mode.name === DEFAULT_MODE_NAME);
      if (!hasDefaultMode) {
        await createDefaultMode();
        // Lấy lại danh sách modes sau khi tạo
        const newResponse = await fetch(`/api/v1/user/me/mode-configs`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Accept': '*/*',
          },
        });
        if (!newResponse.ok) {
          throw new Error(`HTTP error! status: ${newResponse.status}`);
        }
        const newData = await newResponse.json();
        setModes(newData);
      } else {
        setModes(data);
      }
    } catch (error) {
      console.error('Error fetching modes:', error);
      setError('Failed to load modes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModes();
  }, []);

  const handleCreateNewMode = () => {
    setEditMode(null);
    setShowSettingForm(true);
  };

  const handleEditMode = (mode) => {
    setEditMode(mode);
    setShowSettingForm(true);
  };

  const handleDeleteClick = (modeId, modeName) => {
    if (modeName === DEFAULT_MODE_NAME) return;
    setDeleteModeId(modeId);
    setShowConfirmForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteModeId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/user/me/mode-configs/${deleteModeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setModes(modes.filter((mode) => mode.id !== deleteModeId));
    } catch (error) {
      console.error('Error deleting mode:', error);
      setError(
        error.message.includes('404')
          ? 'Mode not found.'
          : 'Failed to delete mode. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setShowConfirmForm(false);
      setDeleteModeId(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      const isDefaultMode = editMode?.name === DEFAULT_MODE_NAME;

      if (editMode) {
        if (isDefaultMode) {
          formData = { ...formData, name: DEFAULT_MODE_NAME };
        }

        response = await fetch(`/api/v1/user/me/mode-configs/${editMode.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`/api/v1/user/me/mode-configs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchModes();
      setShowSettingForm(false);
      setEditMode(null);
    } catch (error) {
      console.error('Error saving mode:', error);
      setError(
        error.message.includes('409')
          ? 'Mode with this name already exists.'
          : error.message.includes('400')
          ? 'Invalid input data.'
          : 'Failed to save mode. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderModeItem = (mode) => {
    const isDefault = mode.name === DEFAULT_MODE_NAME;
    return (
      <div
        key={mode.id}
        className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
      >
        <span className={isDefault ? 'font-semibold' : ''}>
          {mode.name}
          {isDefault && ' (Default)'}
        </span>
        <div className="flex items-center space-x-2">
          <button
            className="text-gray-600 hover:text-blue-500"
            onClick={() => handleEditMode(mode)}
            disabled={isLoading}
          >
            <Edit size={20} />
          </button>
          {!isDefault && (
            <button
              onClick={() => handleDeleteClick(mode.id, mode.name)}
              className="text-red-500 hover:text-red-700"
              disabled={isLoading}
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    );
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
            disabled={isLoading}
          >
            <span className="mr-2">+</span>
            Create new mode
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div className="text-black space-y-2">
          {isLoading && modes.length === 0 ? (
            <div className="text-center py-4">Loading modes...</div>
          ) : (
            modes.map(renderModeItem)
          )}
        </div>
      </div>

      {/* Safety System */}
      <div className="w-1/2 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Safety System</h2>
        <div className="space-y-2 text-black">
          {['Auto Control (Required)', 'Warning (Required)'].map(
            (setting, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <span className="font-semibold">{setting}</span>
                <button
                  className="text-gray-600 hover:text-blue-500"
                  disabled={isLoading}
                >
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Setting Form Modal */}
      {showSettingForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 py-8 rounded-xl shadow-md w-1/3">
            <SettingForm
              initialData={
                editMode || {
                  name: '',
                  ledMode: 3, // Default to Warm
                  brightness: 50,
                  fanMode: 1,
                }
              }
              onConfirm={handleFormSubmit}
              onCancel={() => {
                setShowSettingForm(false);
                setEditMode(null);
              }}
              isEditingDefault={editMode?.name === DEFAULT_MODE_NAME}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white py-8 rounded-xl w-1/3">
            <ConfirmForm
              message="Are you sure you want to delete this mode?"
              confirmText="Delete"
              onConfirm={confirmDelete}
              onCancel={() => {
                setShowConfirmForm(false);
                setDeleteModeId(null);
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeManager;