import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 이미 로그인된 사용자인지 확인
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleStartClick = () => {
    if (currentUser) {
      // 이미 로그인된 경우 바로 환자 목록으로
      navigate('/patients');
    } else {
      // 로그인 페이지로
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <div className="app">
      {/* Header - 환자 목록과 동일한 구조 */}
      <div className="header">
        <div className="header-title">
          <span style={{ color: '#000' }}>Medi</span>
          <span className="brand-highlight">Relay</span>
        </div>
        {currentUser ? (
          <button className="header-action" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <button className="header-action" onClick={() => navigate('/login')}>
            로그인
          </button>
        )}
      </div>

      {/* Page Content - 환자 목록과 동일한 구조 */}
      <div className="page fade-in">
        {/* 사용자 환영 메시지 (로그인 시에만) */}
        {currentUser && (
          <div className="patient-card" style={{ 
            textAlign: 'center',
            marginBottom: '16px',
            cursor: 'default'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👋</div>
            <div className="patient-name" style={{ marginBottom: '8px' }}>
              안녕하세요, {currentUser.name}님!
            </div>
            <div className="patient-date">
              {currentUser.department} • {currentUser.position}
            </div>
          </div>
        )}

        {/* 메인 로고 카드 */}
        <div className="patient-card" style={{ 
          textAlign: 'center',
          marginBottom: '16px',
          cursor: 'default'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'white',
            border: '3px solid #4A90E2',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(74, 144, 226, 0.1)'
          }}>
            <img 
              src={`${import.meta.env.BASE_URL}medirelay-logo.svg`} 
              alt="MediRelay Logo"
              style={{
                width: '60px',
                height: '60px'
              }}
            />
          </div>
          
          <div className="patient-name" style={{ marginBottom: '8px' }}>
            <span style={{ color: '#000' }}>Medi</span>
            <span style={{ color: '#4A90E2' }}>Relay</span>
          </div>
          
          <div className="patient-date">
            AI 기반 차세대 간호기록 시스템
          </div>
        </div>

        {/* 주요 기능 카드들 */}
        <div className="patient-list">
          <div className="patient-card" style={{ cursor: 'default' }}>
            <div className="patient-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🎙️</span>
                <div className="patient-name" style={{ fontSize: '18px' }}>음성 차팅</div>
              </div>
            </div>
            <div className="patient-info">
              <div className="patient-info-row">
                <span className="patient-info-label">기능</span>
                <span className="patient-info-value">말하면 기록 끝!</span>
              </div>
            </div>
            <div className="patient-recent">
              말로 기록하면 AI가 자동으로 간호기록을 작성해드립니다.
            </div>
          </div>

          <div className="patient-card" style={{ cursor: 'default' }}>
            <div className="patient-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🤖</span>
                <div className="patient-name" style={{ fontSize: '18px' }}>AI 분류 & 요약</div>
              </div>
            </div>
            <div className="patient-info">
              <div className="patient-info-row">
                <span className="patient-info-label">자동화</span>
                <span className="patient-info-value">V/S, I/O 분류</span>
              </div>
            </div>
            <div className="patient-recent">
              활력징후, 투입/배출량 등을 자동 분류하고 인계장을 생성합니다.
            </div>
          </div>

          <div className="patient-card" style={{ cursor: 'default' }}>
            <div className="patient-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>💬</span>
                <div className="patient-name" style={{ fontSize: '18px' }}>스마트 질의응답</div>
              </div>
            </div>
            <div className="patient-info">
              <div className="patient-info-row">
                <span className="patient-info-label">질문</span>
                <span className="patient-info-value">자연어 처리</span>
              </div>
            </div>
            <div className="patient-recent">
              "오늘 체온이 어떻게 됐나요?" 같은 자연어 질문이 가능합니다.
            </div>
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <button
            onClick={handleStartClick}
            className="btn btn-primary"
            style={{
              fontSize: '18px',
              padding: '18px 40px',
              borderRadius: '50px',
              boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)'
            }}
          >
            {currentUser ? '🏥 업무 시작하기' : '🚀 로그인하기'}
          </button>
        </div>

        {/* 데모 안내 */}
        <div className="patient-card" style={{
          textAlign: 'center',
          background: '#f8f9ff',
          border: '2px solid #4A90E2',
          cursor: 'default'
        }}>
          <div className="patient-name" style={{ fontSize: '16px', marginBottom: '8px' }}>
            📱 데모 버전
          </div>
          <div className="patient-recent">
            OpenAI API 시뮬레이션 모드로 동작합니다
          </div>
        </div>

        {/* 버전 정보 */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#999',
          marginTop: '24px'
        }}>
          MediRelay v1.0 • Made with MediX for Healthcare
        </div>
      </div>
    </div>
  );
};

export default Landing;