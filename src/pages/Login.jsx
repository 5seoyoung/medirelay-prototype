import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 데모용 간호사 계정들
  const demoAccounts = [
    {
      employeeId: 'N001',
      password: '1234',
      name: '김간호사',
      department: '내과 병동',
      position: '간호사'
    },
    {
      employeeId: 'N002', 
      password: '1234',
      name: '이간호사',
      department: '외과 병동',
      position: '수간호사'
    },
    {
      employeeId: 'N003',
      password: '1234', 
      name: '박간호사',
      department: '중환자실',
      position: '간호사'
    },
    {
      employeeId: 'demo',
      password: 'demo',
      name: '데모간호사',
      department: '데모 병동',
      position: '간호사'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 오류 메시지 제거
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 유효성 검사
    if (!formData.employeeId.trim() || !formData.password.trim()) {
      setError('사번과 비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 데모 계정 확인
      const user = demoAccounts.find(account => 
        account.employeeId === formData.employeeId && 
        account.password === formData.password
      );

      if (user) {
        // 로그인 성공 - 사용자 정보 저장
        localStorage.setItem('currentUser', JSON.stringify({
          employeeId: user.employeeId,
          name: user.name,
          department: user.department,
          position: user.position,
          loginTime: new Date().toISOString()
        }));

        // 환자 목록 페이지로 이동
        navigate('/patients');
      } else {
        setError('사번 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account) => {
    setFormData({
      employeeId: account.employeeId,
      password: account.password
    });
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="app">
      <div className="page fade-in" style={{ 
        background: 'white',
        color: '#333',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 24px'
      }}>
        {/* Back Button */}
        <button
          onClick={handleBackToLanding}
          style={{
            position: 'absolute',
            top: '60px',
            left: '24px',
            background: 'white',
            border: '2px solid #4A90E2',
            color: '#4A90E2',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← 홈으로
        </button>

        {/* Logo Section */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '48px'
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
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(74, 144, 226, 0.1)'
          }}>
            <img 
              src="/medirelay-logo.svg" 
              alt="MediRelay Logo"
              style={{
                width: '60px',
                height: '60px'
              }}
            />
          </div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px',
            color: '#333'
          }}>
            <span style={{ color: '#000' }}>Medi</span><span style={{ color: '#4A90E2' }}>Relay</span>
          </h1>
          
          <p style={{
            fontSize: '16px',
            margin: 0,
            color: '#666'
          }}>
            간호사 로그인
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          background: 'white',
          border: '2px solid #4A90E2',
          borderRadius: '24px',
          padding: '32px 24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.1)'
        }}>
          <form onSubmit={handleLogin}>
            {/* Employee ID Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#333'
              }}>
                사번
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="N001"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'white',
                  color: '#333',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#333'
              }}>
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'white',
                  color: '#333',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#ffebee',
                border: '2px solid #ffcdd2',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center',
                color: '#c62828'
              }}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? '#e8e8e8' : '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '18px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" style={{ 
                    width: '20px', 
                    height: '20px',
                    borderColor: 'white transparent white transparent'
                  }}></div>
                  로그인 중...
                </>
              ) : (
                <>
                  🔑 로그인
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div style={{
          background: 'white',
          border: '2px solid #4A90E2',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(74, 144, 226, 0.1)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textAlign: 'center',
            color: '#333'
          }}>
            📱 데모 계정 (빠른 로그인)
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            {demoAccounts.slice(0, 4).map((account, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(account)}
                style={{
                  background: 'white',
                  border: '2px solid #4A90E2',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  color: '#333',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.borderColor = '#357ABD';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#4A90E2';
                }}
              >
                <div style={{ fontWeight: '600', color: '#333' }}>{account.name}</div>
                <div style={{ color: '#666', fontSize: '10px' }}>
                  {account.employeeId}
                </div>
              </button>
            ))}
          </div>
          
          <div style={{
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '12px',
            color: '#666'
          }}>
            모든 계정 비밀번호: 1234 (demo 계정은 demo/demo)
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          fontSize: '12px',
          color: '#999'
        }}>
          보안을 위해 공용 기기에서는 로그아웃해주세요
        </div>
      </div>
    </div>
  );
};

export default Login;