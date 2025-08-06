
// QRScan.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QRScan = () => {
  const navigate = useNavigate();

  return (
    <div className="page fade-in">
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">QR 스캔</div>
        <div></div>
      </div>
      
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📷</div>
        <h2 style={{ marginBottom: '16px' }}>QR 코드 스캔</h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          환자 침상의 QR 코드를 스캔하여<br />
          빠르게 환자를 선택할 수 있습니다.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          수동으로 환자 선택하기
        </button>
      </div>
    </div>
  );
};

export default QRScan;