import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
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
        <StatusBar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qr-scan" element={<QRScan />} />
            <Route path="/record/:patientId" element={<Record />} />
            <Route path="/chart/:patientId" element={<ChartView />} />
            <Route path="/handover/:patientId" element={<HandoverView />} />
            <Route path="/chat/:patientId" element={<Chatbot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;