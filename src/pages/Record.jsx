// Record.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Record = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');

  return (
    <div className="page fade-in">
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">음성 차팅</div>
        <div></div>
      </div>
      
      {/* Patient Info Header */}
      {selectedPatient.name && (
        <div className="patient-card" style={{ marginBottom: '24px' }}>
          <div className="patient-header">
            <div className="patient-name">{selectedPatient.name}</div>
            <div className="patient-date">{selectedPatient.room}</div>
          </div>
          <div className="patient-info-row">
            <span className="patient-info-label">진단명</span>
            <span className="patient-info-value">{selectedPatient.diagnosis}</span>
          </div>
        </div>
      )}

      {/* Recording Interface */}
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="record-status">
          <div className="record-status-text">음성 노트 준비</div>
          <div className="record-status-subtext">아래 버튼을 눌러 음성 기록을 시작하세요</div>
        </div>

        <button className="btn-record">
          🎙️
        </button>

        <div style={{ marginTop: '40px' }}>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={() => navigate(`/chart/${patientId}`)}
          >
            📋 간호기록지 보기
          </button>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={() => navigate(`/handover/${patientId}`)}
          >
            📝 인계장 보기
          </button>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={() => navigate(`/chat/${patientId}`)}
          >
            💬 AI 질의응답
          </button>
        </div>
      </div>
    </div>
  );
};

export default Record;