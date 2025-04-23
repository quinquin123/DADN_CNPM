import React from 'react';
import PropTypes from 'prop-types';

const Mode = ({ mode, label, isActive, isLoading, onClick }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-md font-poppins text-gray-100 cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={onClick}
    >
      <span className="text-lg font-medium">{label}</span>
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <span className={`text-sm ${isActive ? 'text-gray-100' : 'text-gray-400'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )}
    </div>
  );
};

Mode.propTypes = {
  mode: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

Mode.defaultProps = {
  isActive: false,
  isLoading: false,
};

export default Mode;