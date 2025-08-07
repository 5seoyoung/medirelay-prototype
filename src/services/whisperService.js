import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * Whisper API를 사용하여 음성을 텍스트로 변환
 * @param {Blob} audioBlob - 오디오 파일 Blob
 * @param {string} language - 언어 코드 (기본: 'ko' 한국어)
 * @returns {Promise<string>} 변환된 텍스트
 */
export const transcribeAudio = async (audioBlob, language = 'ko') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }

  if (!audioBlob) {
    throw new Error('오디오 데이터가 없습니다.');
  }

  try {
    // FormData 생성
    const formData = new FormData();
    
    // 오디오 파일을 FormData에 추가
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'json');
    formData.append('temperature', '0');
    
    // API 호출
    const response = await axios.post(OPENAI_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30초 타임아웃
    });

    if (response.data && response.data.text) {
      return response.data.text.trim();
    } else {
      throw new Error('Whisper API 응답에 텍스트가 없습니다.');
    }
    
  } catch (error) {
    console.error('Whisper API 오류:', error);
    
    if (error.response) {
      // API 응답 오류
      const status = error.response.status;
      const message = error.response.data?.error?.message || '알 수 없는 오류';
      
      if (status === 401) {
        throw new Error('OpenAI API 키가 올바르지 않습니다.');
      } else if (status === 429) {
        throw new Error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (status === 413) {
        throw new Error('오디오 파일이 너무 큽니다. (최대 25MB)');
      } else {
        throw new Error(`API 오류 (${status}): ${message}`);
      }
    } else if (error.request) {
      // 네트워크 오류
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      // 기타 오류
      throw new Error(`음성 변환 실패: ${error.message}`);
    }
  }
};

/**
 * 음성 파일 유효성 검사
 * @param {Blob} audioBlob - 오디오 파일 Blob
 * @returns {boolean} 유효성 여부
 */
export const validateAudioFile = (audioBlob) => {
  if (!audioBlob) {
    return { valid: false, error: '오디오 데이터가 없습니다.' };
  }

  // 파일 크기 확인 (25MB 제한)
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (audioBlob.size > maxSize) {
    return { 
      valid: false, 
      error: `파일이 너무 큽니다. (${Math.round(audioBlob.size / 1024 / 1024)}MB > 25MB)` 
    };
  }

  // 최소 크기 확인 (1KB)
  if (audioBlob.size < 1024) {
    return { 
      valid: false, 
      error: '녹음 시간이 너무 짧습니다.' 
    };
  }

  return { valid: true };
};

/**
 * 더미 모드용 STT (개발/테스트용)
 */
export const mockTranscription = async (audioBlob) => {
  // 개발용 더미 응답
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
  
  const mockResponses = [
    "환자 혈압이 130에 85이고 체온은 37도 2입니다. 통증 점수는 6점 정도로 호소하고 있어서 진통제 투여했습니다.",
    "헤모백 드레인에서 50시시 정도 배액이 나왔고 색깔은 연분홍색입니다. 상처 부위는 깨끗하고 건조합니다.",
    "환자가 식사를 절반 정도 드셨고 오심은 없다고 합니다. 수분 섭취는 충분히 하고 계십니다.",
    "활력징후 안정적이고 산소포화도 98퍼센트입니다. 호흡곤란이나 흉통 호소 없으시고 안정적입니다."
  ];
  
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};