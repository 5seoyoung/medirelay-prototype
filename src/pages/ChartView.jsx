// ChartView.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ChartView = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');

  return (
    <div className="page fade-in">
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">간호기록지</div>
        <div></div>
      </div>
      
      {selectedPatient.name && (
        <div className="patient-card" style={{ marginBottom: '24px' }}>
          <div className="patient-name">{selectedPatient.name}</div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            {selectedPatient.room} | {selectedPatient.diagnosis}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
        <h2 style={{ marginBottom: '16px' }}>간호기록지</h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          음성 차팅으로 작성된 간호기록들이<br />
          여기에 자동으로 정리됩니다.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/record/${patientId}`)}
        >
          음성 차팅 시작하기
        </button>
      </div>
    </div>
  );
};

export default ChartView;
