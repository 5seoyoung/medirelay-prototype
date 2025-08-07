import React from 'react';

const StatusBar = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ko-KR', { 
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
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #4A90E2, #667eea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        MediRelay
      </div>
    </div>
  );
};

export default StatusBar;