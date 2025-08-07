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
    <div className="page fade-in" style={{ 
      background: 'white',
      color: '#333',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px',
      position: 'relative'
    }}>
      {/* 로그인된 사용자 정보 */}
      {currentUser && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '24px',
          background: 'white',
          border: '2px solid #4A90E2',
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: '600', color: '#333' }}>{currentUser.name}</div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#4A90E2',
              fontSize: '10px',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            로그아웃
          </button>
        </div>
      )}

      {/* Logo */}
      <div style={{ 
        marginBottom: '40px',
        animation: 'fadeIn 1s ease-in-out'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: 'white',
          border: '3px solid #4A90E2',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.1)'
        }}>
          <img 
            src="/medirelay-logo.svg" 
            alt="MediRelay Logo"
            style={{
              width: '80px',
              height: '80px'
            }}
          />
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 12px',
          color: '#333'
        }}>
          <span style={{ color: '#000' }}>Medi</span><span style={{ color: '#4A90E2' }}>Relay</span>
        </h1>
        
        <p style={{
          fontSize: '18px',
          margin: 0,
          fontWeight: '300',
          color: '#666'
        }}>
          AI 기반 차세대 간호기록 시스템
        </p>
      </div>

      {/* Welcome Message */}
      {currentUser && (
        <div style={{
          background: 'white',
          border: '2px solid #4A90E2',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          maxWidth: '320px',
          boxShadow: '0 4px 16px rgba(74, 144, 226, 0.1)'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>👋</div>
          <div style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>
            안녕하세요, {currentUser.name}님!
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {currentUser.department} • {currentUser.position}
          </div>
        </div>
      )}

      {/* Features */}
      <div style={{ 
        marginBottom: '48px',
        maxWidth: '320px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            background: 'white',
            border: '2px solid #4A90E2',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(74, 144, 226, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎙️</div>
            <div style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>음성 차팅</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              말로 기록하면 AI가 자동으로 간호기록 작성
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '2px solid #4A90E2',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(74, 144, 226, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
            <div style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>AI 분류 & 요약</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              V/S, I/O, 투약 등 자동 분류 및 인계장 생성
            </div>
          </div>

          <div style={{
            background: 'white',
            border: '2px solid #4A90E2',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(74, 144, 226, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>스마트 질의응답</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              "오늘 체온이 어떻게 됐나요?" 자연어 질문 가능
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleStartClick}
        style={{
          background: '#4A90E2',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)',
          transition: 'all 0.3s ease',
          marginBottom: '32px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 12px 40px rgba(74, 144, 226, 0.4)';
          e.target.style.background = '#357ABD';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 32px rgba(74, 144, 226, 0.3)';
          e.target.style.background = '#4A90E2';
        }}
      >
        {currentUser ? '🏥 업무 시작하기' : '🚀 로그인하기'}
      </button>

      {/* Demo Notice */}
      <div style={{
        background: 'white',
        border: '1px solid #4A90E2',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '14px',
        color: '#666'
      }}>
        📱 데모 버전 • OpenAI API 시뮬레이션 모드
      </div>

      {/* Version Info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '12px',
        color: '#999'
      }}>
        MediRelay v1.0 • Made with ❤️ for Healthcare
      </div>
    </div>
  );
};

export default Landing;