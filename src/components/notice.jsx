import PropTypes from 'prop-types';

const Notice = ({ type, message, time, actions }) => {
  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'force':
      case 'warn':
      case 'warning':
        return {
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-800',
          icon: '⚠️',
        };
      case 'error':
        return {
          bgColor: 'bg-red-100',
          borderColor: 'border-red-500',
          textColor: 'text-red-800',
          icon: '❌',
        };
      case 'system':
        return {
          bgColor: 'bg-green-100',
          borderColor: 'border-green-500',
          textColor: 'text-green-800',
          icon: '📢',
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-800',
          icon: 'ℹ️',
        };
    }
  };

  const { bgColor, borderColor, textColor, icon } = getTypeStyles(type);

  return (
    <div
      className={`flex items-start p-4 rounded-lg border-l-4 ${bgColor} ${borderColor} ${textColor} shadow-sm font-poppins`}
    >
      <span className="text-lg mr-3">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs mt-1 opacity-80">{time}</p>
        {actions && (
          <div className="mt-2 flex space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`text-xs px-3 py-1 rounded ${
                  action.type === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                } hover:opacity-90`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Notice.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  time: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      type: PropTypes.oneOf(['primary', 'secondary']),
    })
  ),
};

Notice.defaultProps = {
  type: 'info',
  message: '',
  time: '',
  actions: null,
};

export default Notice;