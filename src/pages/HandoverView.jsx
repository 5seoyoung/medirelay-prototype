import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateHandover } from '../services/openaiService';

const HandoverView = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');
  
  const [records, setRecords] = useState([]);
  const [handover, setHandover] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedShift, setSelectedShift] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // 기록 불러오기
  useEffect(() => {
    const allRecords = JSON.parse(localStorage.getItem('nursingRecords') || '[]');
    const patientRecords = allRecords.filter(record => {
      const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
      return record.patientId === parseInt(patientId) && recordDate === selectedDate;
    });
    
    // 시간순 정렬
    const sortedRecords = patientRecords.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    setRecords(sortedRecords);
  }, [patientId, selectedDate]);

  // 기존 인계장 불러오기
  useEffect(() => {
    const savedHandovers = JSON.parse(localStorage.getItem('handovers') || '[]');
    const existingHandover = savedHandovers.find(h => 
      h.patientId === parseInt(patientId) && 
      h.date === selectedDate && 
      h.shift === selectedShift
    );
    
    if (existingHandover) {
      setHandover(existingHandover.content);
    } else {
      setHandover('');
    }
  }, [patientId, selectedDate, selectedShift]);

  // 인계장 자동 생성
  const handleGenerateHandover = async () => {
    if (records.length === 0) {
      setError('선택한 날짜에 간호기록이 없습니다.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const generatedHandover = await generateHandover(records, selectedPatient, selectedShift);
      setHandover(generatedHandover);
      
      // 로컬 스토리지에 저장
      const savedHandovers = JSON.parse(localStorage.getItem('handovers') || '[]');
      const newHandover = {
        id: Date.now(),
        patientId: parseInt(patientId),
        date: selectedDate,
        shift: selectedShift,
        content: generatedHandover,
        createdAt: new Date().toISOString(),
        recordCount: records.length
      };
      
      // 기존 인계장 제거 후 새로 추가
      const filteredHandovers = savedHandovers.filter(h => 
        !(h.patientId === parseInt(patientId) && h.date === selectedDate && h.shift === selectedShift)
      );
      
      const updatedHandovers = [...filteredHandovers, newHandover];
      localStorage.setItem('handovers', JSON.stringify(updatedHandovers));
      
    } catch (err) {
      console.error('인계장 생성 오류:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // 인계장 저장
  const handleSaveHandover = () => {
    const savedHandovers = JSON.parse(localStorage.getItem('handovers') || '[]');
    const newHandover = {
      id: Date.now(),
      patientId: parseInt(patientId),
      date: selectedDate,
      shift: selectedShift,
      content: handover,
      createdAt: new Date().toISOString(),
      recordCount: records.length
    };
    
    // 기존 인계장 제거 후 새로 추가
    const filteredHandovers = savedHandovers.filter(h => 
      !(h.patientId === parseInt(patientId) && h.date === selectedDate && h.shift === selectedShift)
    );
    
    const updatedHandovers = [...filteredHandovers, newHandover];
    localStorage.setItem('handovers', JSON.stringify(updatedHandovers));
    
    alert('인계장이 저장되었습니다!');
  };

  // 인계장 다운로드 (텍스트 파일)
  const handleDownload = () => {
    const fileName = `인계장_${selectedPatient.name}_${selectedDate}_${selectedShift}.txt`;
    const content = `
MediRelay 인계장
================

환자명: ${selectedPatient.name}
병실: ${selectedPatient.room}
날짜: ${selectedDate}
근무조: ${selectedShift === 'day' ? '주간' : selectedShift === 'evening' ? '오후' : '야간'}
생성일시: ${new Date().toLocaleString('ko-KR')}

${handover}

================
총 ${records.length}개 기록 기반으로 생성됨
MediRelay AI 간호기록 시스템
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 근무조 이름
  const getShiftName = (shift) => {
    const names = {
      'day': '주간 (08:00-16:00)',
      'evening': '오후 (16:00-24:00)',
      'night': '야간 (24:00-08:00)'
    };
    return names[shift] || shift;
  };

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">인계장</div>
        <button 
          className="header-action" 
          onClick={() => navigate(`/chart/${patientId}`)}
        >
          📋 기록지
        </button>
      </div>
      
      {/* Patient Info */}
      {selectedPatient.name && (
        <div className="patient-card" style={{ marginBottom: '16px' }}>
          <div className="patient-header">
            <div className="patient-name">{selectedPatient.name}</div>
            <div className="patient-date">{selectedPatient.room}</div>
          </div>
          <div className="patient-info-row">
            <span className="patient-info-label">진단명</span>
            <span className="patient-info-value">{selectedPatient.diagnosis}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: '16px' }}>
        {/* Date & Shift Selection */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '4px',
              color: '#333'
            }}>
              날짜
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '4px',
              color: '#333'
            }}>
              근무조
            </label>
            <select 
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="day">주간</option>
              <option value="evening">오후</option>
              <option value="night">야간</option>
            </select>
          </div>
        </div>

        {/* Records Info */}
        <div style={{
          background: '#f8f9fa',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          {selectedDate} / {getShiftName(selectedShift)} / 기록 {records.length}개
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          background: '#ffebee', 
          border: '1px solid #ffcdd2', 
          borderRadius: '8px', 
          padding: '12px', 
          margin: '16px 0',
          color: '#c62828',
          fontSize: '14px'
        }}>
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* Generate Button */}
      {records.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleGenerateHandover}
            disabled={isGenerating}
            style={{ width: '100%' }}
          >
            {isGenerating ? (
              <>
                <span className="loading-spinner" style={{ 
                  width: '16px', 
                  height: '16px', 
                  marginRight: '8px' 
                }}></span>
                AI 인계장 생성 중...
              </>
            ) : (
              '🤖 AI 인계장 자동 생성'
            )}
          </button>
        </div>
      )}

      {/* Handover Content */}
      {handover ? (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#333',
              margin: 0
            }}>
              📝 인계장 내용
            </h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={handleDownload}
                style={{
                  background: 'none',
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#666'
                }}
                title="텍스트 파일로 다운로드"
              >
                💾
              </button>
            </div>
          </div>
          
          <div style={{
            background: 'white',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '200px',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
          }}>
            {handover}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            marginTop: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <button 
              className="btn btn-secondary"
              onClick={handleSaveHandover}
              style={{ flex: 1 }}
            >
              💾 저장
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleDownload}
              style={{ flex: 1 }}
            >
              📁 다운로드
            </button>
          </div>
        </div>
      ) : (
        // No Handover State
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '12px', color: '#333' }}>인계장을 생성해보세요</h3>
          <p style={{ marginBottom: '32px', lineHeight: '1.5' }}>
            선택한 날짜의 간호기록을 바탕으로<br />
            AI가 자동으로 인계장을 작성해드립니다.
          </p>
          {records.length === 0 ? (
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/record/${patientId}`)}
            >
              🎙️ 먼저 간호기록 작성하기
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleGenerateHandover}
              disabled={isGenerating}
            >
              🤖 AI 인계장 생성하기
            </button>
          )}
        </div>
      )}

      {/* Bottom spacing */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
};

export default HandoverView;