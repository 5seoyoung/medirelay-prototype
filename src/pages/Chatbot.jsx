// Chatbot.jsx  
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');

  return (
    <div className="page fade-in">
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">AI 질의응답</div>
        <div></div>
      </div>
      
      {selectedPatient.name && (
        <div className="patient-card" style={{ marginBottom: '24px' }}>
          <div className="patient-name">{selectedPatient.name}</div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            환자 기록 기반 질의응답이 가능합니다
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
        <h2 style={{ marginBottom: '16px' }}>AI 질의응답</h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          "오늘 체온이 어떻게 됐나요?"<br />
          "어제 투약 내역을 알려주세요"<br />
          등의 질문을 할 수 있습니다.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/record/${patientId}`)}
        >
          먼저 음성 차팅하기
        </button>
      </div>
    </div>
  );
};

export default Chatbot;