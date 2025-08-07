import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { askChatbot } from '../services/openaiService';

const Chatbot = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');
  const messagesEndRef = useRef(null);
  
  const [records, setRecords] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 기록 불러오기
  useEffect(() => {
    const allRecords = JSON.parse(localStorage.getItem('nursingRecords') || '[]');
    const patientRecords = allRecords.filter(record => 
      record.patientId === parseInt(patientId)
    );
    setRecords(patientRecords);
  }, [patientId]);

  // 채팅 기록 불러오기
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`chatHistory_${patientId}`) || '[]');
    setMessages(savedMessages);
  }, [patientId]);

  // 메시지 저장
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatHistory_${patientId}`, JSON.stringify(messages));
    }
  }, [messages, patientId]);

  // 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // 사용자 메시지 추가
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // AI 응답 생성
      const aiResponse = await askChatbot(userMessage, records, selectedPatient);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('챗봇 오류:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `죄송합니다. 오류가 발생했습니다: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 채팅 기록 삭제
  const handleClearChat = () => {
    if (window.confirm('채팅 기록을 모두 삭제하시겠습니까?')) {
      setMessages([]);
      localStorage.removeItem(`chatHistory_${patientId}`);
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 빠른 질문 템플릿
  const quickQuestions = [
    "오늘 체온이 어떻게 됐나요?",
    "최근 투약 내역을 알려주세요",
    "어제와 비교해서 상태가 어떤가요?",
    "특별히 주의해야 할 점이 있나요?",
    "통증 점수 변화를 알려주세요",
    "수술 부위 상태는 어떤가요?"
  ];

  return (
    <div className="page fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 88px)',
      padding: 0
    }}>
      {/* Header */}
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">AI 질의응답</div>
        <button className="header-action" onClick={handleClearChat}>
          🗑️
        </button>
      </div>
      
      {/* Patient Info */}
      {selectedPatient.name && (
        <div className="patient-card" style={{ margin: '0 24px 16px' }}>
          <div className="patient-header">
            <div className="patient-name">{selectedPatient.name}</div>
            <div className="patient-date">{records.length}개 기록</div>
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            간호기록을 바탕으로 질문에 답변드립니다
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '0 24px',
        marginBottom: '16px'
      }}>
        {/* No Records Warning */}
        {records.length === 0 && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px',
            margin: '16px 0',
            fontSize: '14px',
            color: '#856404'
          }}>
            <strong>알림:</strong> 아직 간호기록이 없어 정확한 답변이 어려울 수 있습니다.
          </div>
        )}

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ marginBottom: '12px', color: '#333' }}>AI 간호 어시스턴트</h3>
            <p style={{ lineHeight: '1.5', marginBottom: '24px' }}>
              환자의 간호기록을 바탕으로<br />
              궁금한 점을 질문해보세요
            </p>
            
            {/* Quick Questions */}
            {records.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: '#333'
                }}>
                  빠른 질문
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      style={{
                        background: 'white',
                        border: '1px solid #e8e8e8',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: '#4A90E2',
                        cursor: 'pointer',
                        maxWidth: '280px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
                      onMouseOut={(e) => e.target.style.background = 'white'}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: message.type === 'user' 
                  ? '#4A90E2' 
                  : message.isError 
                    ? '#ffebee' 
                    : '#f8f9fa',
                color: message.type === 'user' 
                  ? 'white' 
                  : message.isError 
                    ? '#c62828' 
                    : '#333',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}
            >
              <div>{message.content}</div>
              <div style={{
                fontSize: '12px',
                opacity: 0.7,
                marginTop: '4px',
                textAlign: message.type === 'user' ? 'right' : 'left'
              }}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Message */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              background: '#f8f9fa',
              color: '#333',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="loading-spinner" style={{ 
                  width: '16px', 
                  height: '16px'
                }}></div>
                AI가 답변을 준비하고 있습니다...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #e8e8e8',
        background: 'white'
      }}>
        {/* Quick Questions (when chat started) */}
        {messages.length > 0 && records.length > 0 && (
          <div style={{ 
            marginBottom: '12px',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {quickQuestions.slice(0, 4).map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                style={{
                  background: 'white',
                  border: '1px solid #e8e8e8',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: '#666',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Input Field */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={records.length > 0 
              ? "환자에 대해 궁금한 점을 물어보세요..." 
              : "먼저 간호기록을 작성한 후 질문해주세요"
            }
            disabled={isLoading}
            style={{
              flex: 1,
              minHeight: '44px',
              maxHeight: '100px',
              padding: '12px 16px',
              border: '1px solid #e8e8e8',
              borderRadius: '22px',
              fontSize: '14px',
              resize: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.4'
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              background: (!inputMessage.trim() || isLoading) ? '#e8e8e8' : '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer',
              fontSize: '18px'
            }}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>

        {/* Help Text */}
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Enter로 전송 • Shift+Enter로 줄바꿈
        </div>
      </div>
    </div>
  );
};

export default Chatbot;