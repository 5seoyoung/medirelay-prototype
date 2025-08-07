import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPatients } from '../services/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [patients] = useState(mockPatients);

  const handlePatientSelect = (patient) => {
    // 환자 정보를 localStorage에 저장
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
    // 음성 차팅 페이지로 이동
    navigate(`/record/${patient.id}`);
  };

  const handleQRScan = () => {
    navigate('/qr-scan');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="header">
        <button className="header-action" onClick={handleBackToLanding}>
          🏠 홈
        </button>
        <div className="header-title">
          환자 목록
        </div>
        <button className="header-action" onClick={handleQRScan}>
          📷 QR
        </button>
      </div>

      {/* Patients Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #4A90E2, #667eea)',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        margin: '0 0 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>👩‍⚕️</div>
        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
          담당 환자 {patients.length}명
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          오늘도 안전한 간호를 위해 화이팅! 🌟
        </div>
      </div>

      {/* Patient List */}
      <div className="patient-list">
        {patients.map((patient, index) => (
          <div
            key={patient.id}
            className="patient-card slide-up"
            onClick={() => handlePatientSelect(patient)}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Patient Header */}
            <div className="patient-header">
              <div className="patient-name">{patient.name}</div>
              <div className="patient-date">{patient.birthDate}</div>
            </div>

            {/* Patient Info */}
            <div className="patient-info">
              <div className="patient-info-row">
                <span className="patient-info-label">현재 정보</span>
                <span className="patient-info-value">
                  {patient.department}, {patient.room}
                </span>
              </div>
              
              <div className="patient-info-row">
                <span className="patient-info-label">진단명</span>
                <span className="patient-info-value">{patient.diagnosis}</span>
              </div>
              
              <div className="patient-info-row">
                <span className="patient-info-label">입원일</span>
                <span className="patient-info-value">{patient.admissionDate}</span>
              </div>

              <div className="patient-info-row">
                <span className="patient-info-label">담당의</span>
                <span className="patient-info-value">{patient.doctor}</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="patient-recent">
              최신 기록: {patient.recentActivity}
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.setItem('selectedPatient', JSON.stringify(patient));
                  navigate(`/record/${patient.id}`);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#4A90E2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                🎙️ 차팅
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.setItem('selectedPatient', JSON.stringify(patient));
                  navigate(`/chart/${patient.id}`);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#50C878',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                📋 기록지
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.setItem('selectedPatient', JSON.stringify(patient));
                  navigate(`/chat/${patient.id}`);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#FF6B6B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                💬 질문
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom spacing for better UX */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
};

export default Home;