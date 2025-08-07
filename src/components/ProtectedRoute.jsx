import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          // 로그인한지 24시간이 지났는지 확인
          const loginTime = new Date(user.loginTime);
          const now = new Date();
          const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursSinceLogin < 24) {
            setIsAuthenticated(true);
          } else {
            // 24시간 지났으면 자동 로그아웃
            localStorage.removeItem('currentUser');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // 로딩 화면
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'white',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)'
        }}>
          <div className="loading-spinner" style={{
            width: '32px',
            height: '32px',
            borderColor: '#4A90E2 transparent #4A90E2 transparent'
          }}></div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>
          인증 확인 중...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 사용자만 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;