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

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          Medi<span className="brand-highlight">Relay</span>
        </div>
        <button className="header-action" onClick={handleQRScan}>
          📷 QR
        </button>
      </div>

      {/* Patient List */}
      <div className="patient-list">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="patient-card slide-up"
            onClick={() => handlePatientSelect(patient)}
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
                  {patient.department}, {patient.diagnosis}
                </span>
              </div>
              
              <div className="patient-info-row">
                <span className="patient-info-label">진단명</span>
                <span className="patient-info-value">{patient.diagnosis}</span>
              </div>
              
              <div className="patient-info-row">
                <span className="patient-info-label">병실</span>
                <span className="patient-info-value">{patient.room}</span>
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
          </div>
        ))}
      </div>

      {/* Bottom spacing for better UX */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
};

export default Home;