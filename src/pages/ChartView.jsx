import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ChartView = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');
  
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');

  // 기록 불러오기
  useEffect(() => {
    const allRecords = JSON.parse(localStorage.getItem('nursingRecords') || '[]');
    const patientRecords = allRecords.filter(record => 
      record.patientId === parseInt(patientId)
    );
    
    // 시간순 정렬 (최신순)
    const sortedRecords = patientRecords.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    setRecords(sortedRecords);
    setFilteredRecords(sortedRecords);
  }, [patientId]);

  // 필터링
  useEffect(() => {
    let filtered = records;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(record => record.category === selectedCategory);
    }

    // 날짜 필터
    const today = new Date().toDateString();
    if (selectedDate === 'today') {
      filtered = filtered.filter(record => 
        new Date(record.timestamp).toDateString() === today
      );
    }

    setFilteredRecords(filtered);
  }, [records, selectedCategory, selectedDate]);

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 카테고리 색상
  const getCategoryColor = (category) => {
    const colors = {
      'V/S': '#4A90E2',
      'I/O': '#50C878',
      '투약': '#FF6B6B',
      '관찰': '#FFB347',
      '처치': '#9B59B6',
      '교육': '#1ABC9C',
      '기타': '#95A5A6'
    };
    return colors[category] || '#95A5A6';
  };

  // 우선순위 아이콘
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case '높음': return '🔴';
      case '보통': return '🟡';
      case '낮음': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">간호기록지</div>
        <button className="header-action" onClick={() => navigate(`/record/${patientId}`)}>
          + 기록
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

      {/* Filter Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '16px',
        overflowX: 'auto',
        padding: '0 4px'
      }}>
        {/* 날짜 필터 */}
        <select 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '100px'
          }}
        >
          <option value="today">오늘</option>
          <option value="all">전체</option>
        </select>

        {/* 카테고리 필터 */}
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '100px'
          }}
        >
          <option value="all">전체</option>
          <option value="V/S">V/S</option>
          <option value="I/O">I/O</option>
          <option value="투약">투약</option>
          <option value="관찰">관찰</option>
          <option value="처치">처치</option>
          <option value="교육">교육</option>
          <option value="기타">기타</option>
        </select>
      </div>

      {/* Records Summary */}
      <div style={{
        background: '#f8f9fa',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666'
      }}>
        총 {filteredRecords.length}개 기록 
        {selectedDate === 'today' && ' (오늘)'}
        {selectedCategory !== 'all' && ` | ${selectedCategory} 분류`}
      </div>

      {/* Records List */}
      {filteredRecords.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredRecords.map((record) => (
            <div key={record.id} className="patient-card slide-up">
              {/* Record Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{
                      background: getCategoryColor(record.category),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {record.category}
                  </span>
                  {record.priority && (
                    <span style={{ fontSize: '16px' }}>
                      {getPriorityIcon(record.priority)}
                    </span>
                  )}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {formatTime(record.timestamp)}
                </div>
              </div>

              {/* Record Content */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.5',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {record.structured_content || record.originalText}
                </div>
                
                {/* Original Voice Text */}
                {record.originalText && record.structured_content && 
                 record.originalText !== record.structured_content && (
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    fontStyle: 'italic',
                    background: '#f8f9fa',
                    padding: '8px',
                    borderRadius: '6px',
                    borderLeft: '3px solid #e8e8e8'
                  }}>
                    원본: "{record.originalText}"
                  </div>
                )}
              </div>

              {/* Key Findings */}
              {record.key_findings && record.key_findings.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '6px'
                  }}>
                    주요 발견사항:
                  </div>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '16px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {record.key_findings.map((finding, index) => (
                      <li key={index} style={{ marginBottom: '2px' }}>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action & Response */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {record.action_taken && (
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: '600', color: '#4A90E2' }}>수행:</span> {record.action_taken}
                  </div>
                )}
                {record.patient_response && (
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: '600', color: '#50C878' }}>반응:</span> {record.patient_response}
                  </div>
                )}
                {record.follow_up_needed && (
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: '600', color: '#FF6B6B' }}>추가관찰:</span> {record.follow_up_needed}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // No Records State
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ marginBottom: '12px', color: '#333' }}>기록이 없습니다</h3>
          <p style={{ marginBottom: '32px', lineHeight: '1.5' }}>
            {selectedDate === 'today' ? '오늘 ' : ''}
            {selectedCategory !== 'all' ? `${selectedCategory} ` : ''}
            간호기록이 없습니다.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/record/${patientId}`)}
          >
            🎙️ 음성 차팅 시작하기
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {filteredRecords.length > 0 && (
        <div style={{ 
          marginTop: '24px',
          display: 'flex',
          gap: '8px'
        }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/record/${patientId}`)}
            style={{ flex: 1 }}
          >
            🎙️ 새 기록 추가
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/handover/${patientId}`)}
            style={{ flex: 1 }}
          >
            📝 인계장 생성
          </button>
        </div>
      )}

      {/* Bottom spacing */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
};

export default ChartView;