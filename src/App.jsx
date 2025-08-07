import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import QRScan from './pages/QRScan';
import Record from './pages/Record';
import ChartView from './pages/ChartView';
import HandoverView from './pages/HandoverView';
import Chatbot from './pages/Chatbot';

// Components
import StatusBar from './components/StatusBar';

function App() {
  // GitHub Pages용 basename 설정
  const basename = process.env.NODE_ENV === 'production' ? '/medirelay-prototype' : '';

  return (
    <Router basename={basename}>
      <div className="app">
        <Routes>
          {/* 랜딩 페이지 (StatusBar 없음) */}
          <Route path="/" element={<Landing />} />
          
          {/* 앱 내부 페이지들 (StatusBar 포함) */}
          <Route path="/patients" element={
            <>
              <StatusBar />
              <div className="app-content">
                <Home />
              </div>
            </>
          } />
          
          <Route path="/qr-scan" element={
            <>
              <StatusBar />
              <div className="app-content">
                <QRScan />
              </div>
            </>
          } />
          
          <Route path="/record/:patientId" element={
            <>
              <StatusBar />
              <div className="app-content">
                <Record />
              </div>
            </>
          } />
          
          <Route path="/chart/:patientId" element={
            <>
              <StatusBar />
              <div className="app-content">
                <ChartView />
              </div>
            </>
          } />
          
          <Route path="/handover/:patientId" element={
            <>
              <StatusBar />
              <div className="app-content">
                <HandoverView />
              </div>
            </>
          } />
          
          <Route path="/chat/:patientId" element={
            <>
              <StatusBar />
              <div className="app-content">
                <Chatbot />
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;