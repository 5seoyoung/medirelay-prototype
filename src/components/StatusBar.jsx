import React from 'react';

const StatusBar = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="status-bar">
      <div className="status-time">
        {getCurrentTime()}
      </div>
      <div className="status-indicators">
        <span>●●●</span>
        <span>📶</span>
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );
};

export default StatusBar;