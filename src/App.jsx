import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import QRScan from './pages/QRScan';
import Record from './pages/Record';
import ChartView from './pages/ChartView';
import HandoverView from './pages/HandoverView';
import Chatbot from './pages/Chatbot';

// Components
import StatusBar from './components/StatusBar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // GitHub Pages용 basename 설정
  const basename = process.env.NODE_ENV === 'production' ? '/medirelay-prototype' : '';

  return (
    <Router basename={basename}>
      <div className="app">
        <Routes>
          {/* 공개 페이지들 (StatusBar 없음) */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* 보호된 페이지들 (로그인 필요, StatusBar 포함) */}
          <Route path="/patients" element={
            <ProtectedRoute>
              <StatusBar />
              <div className="app-content">
                <Home />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/qr-scan" element={
            <ProtectedRoute>
              <StatusBar />
              <div className="app-content">
                <QRScan />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/record/:patientId" element={
            <ProtectedRoute>
              <StatusBar />
              <div className="app-content">
                <Record />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/chart/:patientId" element={
            <ProtectedRoute>
              <StatusBar />
              <div className="app-content">
                <ChartView />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/handover/:patientId" element={
            <ProtectedRoute>
              <StatusBar />
              <div className="app-content">
                <HandoverView />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/chat/:patientId" element={
            <ProtectedRoute>
              <StatusBar />
              <div className="app-content">
                <Chatbot />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;