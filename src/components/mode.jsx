import React from 'react';

const Mode = ({ mode, label, isActive, onClick }) => {
  const activeClass = isActive ? 'bg-green-300' : 'bg-white';
  return (
    <div
      className={`${activeClass} rounded-lg shadow-md p-4 text-center font-medium text-lg cursor-pointer transition-colors duration-200`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Mode;