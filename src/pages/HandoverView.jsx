// HandoverView.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const HandoverView = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');

  return (
    <div className="page fade-in">
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">인계장</div>
        <div></div>
      </div>
      
      {selectedPatient.name && (
        <div className="patient-card" style={{ marginBottom: '24px' }}>
          <div className="patient-name">{selectedPatient.name}</div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            {selectedPatient.room} | 노티 내용
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
        <h2 style={{ marginBottom: '16px' }}>노티 내용</h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          간호기록들이 AI에 의해 자동으로<br />
          인계장 형식으로 요약됩니다.
        </p>
        <div style={{ marginTop: '40px' }}>
          <button 
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={() => navigate(`/record/${patientId}`)}
          >
            음성 차팅하기
          </button>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            차팅 보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandoverView;