import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecording } from '../hooks/useRecording';
import { transcribeAudio, validateAudioFile, mockTranscription } from '../services/whisperService';
import { classifyNursingRecord } from '../services/openaiService';

const Record = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient') || '{}');
  
  const {
    isRecording,
    recordingTime,
    audioBlob,
    isProcessing,
    setIsProcessing,
    startRecording,
    stopRecording,
    resetRecording,
    formatTime
  } = useRecording();

  const [transcribedText, setTranscribedText] = useState('');
  const [classifiedRecord, setClassifiedRecord] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('ready'); // ready, recording, processing, transcribed, classified

  // 더미 모드 확인
  const isDummyMode = import.meta.env.VITE_DUMMY_MODE === 'true';

  // 음성 처리 함수
  const handleAudioProcessing = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setError('');
    setStep('processing');

    try {
      // 1. 오디오 파일 검증
      const validation = validateAudioFile(audioBlob);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 2. STT 처리
      let transcription;
      if (isDummyMode) {
        transcription = await mockTranscription(audioBlob);
      } else {
        transcription = await transcribeAudio(audioBlob);
      }
      
      setTranscribedText(transcription);
      setStep('transcribed');

      // 3. GPT 분류 처리
      const classified = await classifyNursingRecord(transcription, selectedPatient);
      setClassifiedRecord(classified);
      setStep('classified');

      // 4. 로컬 스토리지에 저장
      const newRecord = {
        id: Date.now(),
        patientId: parseInt(patientId),
        timestamp: new Date().toISOString(),
        originalText: transcription,
        ...classified,
        audioBlob: audioBlob // 실제 앱에서는 서버에 업로드
      };

      // 기존 기록들 가져오기
      const existingRecords = JSON.parse(localStorage.getItem('nursingRecords') || '[]');
      const updatedRecords = [...existingRecords, newRecord];
      localStorage.setItem('nursingRecords', JSON.stringify(updatedRecords));

    } catch (err) {
      console.error('음성 처리 오류:', err);
      setError(err.message);
      setStep('transcribed'); // 에러 발생 시 이전 단계로
    } finally {
      setIsProcessing(false);
    }
  };

  // 녹음 완료 시 자동 처리
  useEffect(() => {
    if (audioBlob && step === 'recording') {
      handleAudioProcessing();
    }
  }, [audioBlob, step]);

  // 녹음 시작
  const handleStartRecording = async () => {
    setError('');
    setTranscribedText('');
    setClassifiedRecord(null);
    setStep('recording');
    await startRecording();
  };

  // 녹음 중지
  const handleStopRecording = () => {
    stopRecording();
  };

  // 새로 시작하기
  const handleReset = () => {
    resetRecording();
    setTranscribedText('');
    setClassifiedRecord('');
    setError('');
    setStep('ready');
  };

  // 기록 저장하기
  const handleSaveRecord = () => {
    // 이미 로컬 스토리지에 저장됨
    alert('간호기록이 저장되었습니다!');
    handleReset();
  };

  return (
    <div className="page fade-in">
      {/* Header */}
      <div className="header">
        <button className="header-action" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="header-title">음성 차팅</div>
        <div></div>
      </div>
      
      {/* Patient Info Header */}
      {selectedPatient.name && (
        <div className="patient-card" style={{ marginBottom: '24px' }}>
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

      {/* Recording Status */}
      <div className="record-status">
        {step === 'ready' && (
          <>
            <div className="record-status-text">음성 노트 준비</div>
            <div className="record-status-subtext">버튼을 눌러 음성 기록을 시작하세요</div>
          </>
        )}
        
        {step === 'recording' && (
          <>
            <div className="record-status-text">🎙️ 녹음 중...</div>
            <div className="record-status-subtext">
              {formatTime(recordingTime)} | 말씀해 주세요
            </div>
          </>
        )}
        
        {step === 'processing' && (
          <>
            <div className="record-status-text">🤖 처리 중...</div>
            <div className="record-status-subtext">음성을 분석하고 있습니다</div>
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          </>
        )}
        
        {step === 'transcribed' && (
          <>
            <div className="record-status-text">📝 음성 변환 완료</div>
            <div className="record-status-subtext">텍스트를 확인하고 수정하세요</div>
          </>
        )}
        
        {step === 'classified' && (
          <>
            <div className="record-status-text">✅ 간호기록 완료</div>
            <div className="record-status-subtext">분류 및 구조화가 완료되었습니다</div>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          background: '#ffebee', 
          border: '1px solid #ffcdd2', 
          borderRadius: '8px', 
          padding: '12px', 
          margin: '16px 0',
          color: '#c62828' 
        }}>
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* Recording Button */}
      {(step === 'ready' || step === 'classified') && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <button 
            className={`btn-record ${isRecording ? 'recording' : ''}`}
            onClick={handleStartRecording}
            disabled={isProcessing}
          >
            🎙️
          </button>
        </div>
      )}

      {/* Stop Recording Button */}
      {step === 'recording' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <button 
            className="btn-record recording"
            onClick={handleStopRecording}
          >
            ⏹️
          </button>
          <div style={{ marginTop: '16px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                stopRecording();
                handleReset();
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Transcribed Text Display & Edit */}
      {transcribedText && (step === 'transcribed' || step === 'classified') && (
        <div style={{ margin: '20px 0' }}>
          <div className="form-group">
            <label className="form-label">변환된 텍스트:</label>
            <textarea
              className="form-textarea"
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder="음성으로 변환된 텍스트가 여기에 표시됩니다..."
              style={{ minHeight: '120px' }}
            />
          </div>
          
          {step === 'transcribed' && !isProcessing && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => classifyNursingRecord(transcribedText, selectedPatient)
                  .then(result => {
                    setClassifiedRecord(result);
                    setStep('classified');
                  })
                  .catch(err => setError(err.message))
                }
                style={{ width: '100%', marginBottom: '8px' }}
              >
                🤖 AI 분류 및 구조화
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={handleReset}
                style={{ width: '100%' }}
              >
                다시 녹음하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* Classified Record Display */}
      {classifiedRecord && step === 'classified' && (
        <div style={{ margin: '20px 0' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#333'
          }}>
            📋 간호기록 분류 결과
          </h3>
          
          <div className="patient-card">
            {/* 카테고리 */}
            <div className="patient-info-row" style={{ marginBottom: '12px' }}>
              <span className="patient-info-label">분류</span>
              <span 
                className="patient-info-value"
                style={{ 
                  background: '#4A90E2', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '16px', 
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {classifiedRecord.category}
              </span>
            </div>
            
            {/* 우선순위 */}
            {classifiedRecord.priority && (
              <div className="patient-info-row" style={{ marginBottom: '12px' }}>
                <span className="patient-info-label">우선순위</span>
                <span 
                  className="patient-info-value"
                  style={{ 
                    color: classifiedRecord.priority === '높음' ? '#f44336' : 
                           classifiedRecord.priority === '보통' ? '#ff9800' : '#4caf50'
                  }}
                >
                  {classifiedRecord.priority}
                </span>
              </div>
            )}
            
            {/* 구조화된 내용 */}
            <div style={{ marginBottom: '16px' }}>
              <div className="patient-info-label" style={{ marginBottom: '8px' }}>
                구조화된 기록:
              </div>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {classifiedRecord.structured_content}
              </div>
            </div>
            
            {/* 주요 발견사항 */}
            {classifiedRecord.key_findings && classifiedRecord.key_findings.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div className="patient-info-label" style={{ marginBottom: '8px' }}>
                  주요 발견사항:
                </div>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  fontSize: '14px'
                }}>
                  {classifiedRecord.key_findings.map((finding, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 수행한 간호행위 */}
            {classifiedRecord.action_taken && (
              <div style={{ marginBottom: '16px' }}>
                <div className="patient-info-label" style={{ marginBottom: '8px' }}>
                  수행한 간호행위:
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {classifiedRecord.action_taken}
                </div>
              </div>
            )}
            
            {/* 환자 반응 */}
            {classifiedRecord.patient_response && (
              <div style={{ marginBottom: '16px' }}>
                <div className="patient-info-label" style={{ marginBottom: '8px' }}>
                  환자 반응:
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {classifiedRecord.patient_response}
                </div>
              </div>
            )}
            
            {/* 추가 관찰 필요사항 */}
            {classifiedRecord.follow_up_needed && (
              <div>
                <div className="patient-info-label" style={{ marginBottom: '8px' }}>
                  추가 관찰 필요:
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#f44336',
                  fontWeight: '500'
                }}>
                  {classifiedRecord.follow_up_needed}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div style={{ marginTop: '24px' }}>
            <button 
              className="btn btn-primary"
              onClick={handleSaveRecord}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              📋 간호기록 저장하기
            </button>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/chart/${patientId}`)}
                style={{ flex: 1 }}
              >
                📋 기록지 보기
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/handover/${patientId}`)}
                style={{ flex: 1 }}
              >
                📝 인계장 보기
              </button>
            </div>
            
            <button 
              className="btn btn-secondary"
              onClick={handleReset}
              style={{ width: '100%', marginTop: '8px' }}
            >
              🎙️ 새로 녹음하기
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons (when ready) */}
      {step === 'ready' && (
        <div style={{ marginTop: '40px' }}>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={() => navigate(`/chart/${patientId}`)}
          >
            📋 간호기록지 보기
          </button>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '12px' }}
            onClick={() => navigate(`/handover/${patientId}`)}
          >
            📝 인계장 보기
          </button>
          <button 
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={() => navigate(`/chat/${patientId}`)}
          >
            💬 AI 질의응답
          </button>
        </div>
      )}

      {/* Dummy Mode Indicator */}
      {isDummyMode && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff9800',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          zIndex: 1000
        }}>
          데모 모드 (OpenAI API 미연결)
        </div>
      )}

      {/* Bottom spacing */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
};

export default Record;