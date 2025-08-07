import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * GPT API를 사용하여 간호기록 분류 및 구조화
 * @param {string} text - STT로 변환된 텍스트
 * @param {Object} patientInfo - 환자 정보
 * @returns {Promise<Object>} 분류된 간호기록 데이터
 */
export const classifyNursingRecord = async (text, patientInfo = {}) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  const prompt = `
당신은 전문 간호사입니다. 다음 음성 기록을 분석하여 간호기록 형식으로 구조화해주세요.

환자 정보:
- 이름: ${patientInfo.name || ''}
- 진단: ${patientInfo.diagnosis || ''}
- 나이: ${patientInfo.age || ''}

음성 기록: "${text}"

다음 JSON 형식으로 응답해주세요:
{
  "category": "분류 (V/S, I/O, 투약, 관찰, 처치, 교육, 기타 중 하나)",
  "structured_content": "구조화된 간호기록 내용",
  "key_findings": ["주요 발견사항1", "주요 발견사항2"],
  "action_taken": "수행한 간호행위 (있는 경우)",
  "patient_response": "환자 반응 (있는 경우)",
  "priority": "우선순위 (높음/보통/낮음)",
  "follow_up_needed": "추가 관찰 필요사항 (있는 경우)"
}

간호기록 작성 원칙:
1. 객관적이고 정확한 표현 사용
2. 의료진이 이해하기 쉬운 전문 용어 사용
3. 시간, 수치, 증상을 명확히 기록
4. 환자의 주관적 호소와 객관적 관찰 구분
5. SOAP 형식 고려하여 체계적으로 정리
`;

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 20년 경력의 전문 간호사입니다. 음성으로 입력된 간호 기록을 정확하고 체계적으로 분류하고 구조화하는 것이 전문 분야입니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT API 응답이 없습니다.');
    }

    // JSON 응답 파싱
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없습니다.');
      }
    } catch (parseError) {
      console.warn('JSON 파싱 실패, 기본 구조로 반환:', parseError);
      return {
        category: '기타',
        structured_content: text,
        key_findings: [text.substring(0, 100) + '...'],
        action_taken: null,
        patient_response: null,
        priority: '보통',
        follow_up_needed: null
      };
    }

  } catch (error) {
    console.error('GPT API 오류:', error);
    throw new Error(`간호기록 분류 실패: ${error.message}`);
  }
};

/**
 * 인계장 자동 생성
 * @param {Array} records - 간호기록 배열
 * @param {Object} patientInfo - 환자 정보
 * @param {string} shift - 근무조 (day/evening/night)
 * @returns {Promise<string>} 생성된 인계장 내용
 */
export const generateHandover = async (records, patientInfo, shift = 'day') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  const recordsText = records.map(record => 
    `[${record.timestamp}] ${record.category}: ${record.content || record.structured_content}`
  ).join('\n');

  const prompt = `
다음 간호기록들을 바탕으로 ${shift === 'day' ? '주간' : shift === 'evening' ? '오후' : '야간'}근무 인계장을 작성해주세요.

환자 정보:
- 이름: ${patientInfo.name || ''}
- 진단: ${patientInfo.diagnosis || ''}
- 병실: ${patientInfo.room || ''}
- 나이: ${patientInfo.age || ''}

간호기록:
${recordsText}

다음 형식으로 인계장을 작성해주세요:

## 환자 개요
- **이름**: ${patientInfo.name} (${patientInfo.age}세)
- **진단**: ${patientInfo.diagnosis}
- **병실**: ${patientInfo.room}

## 오늘의 주요 사항
### V/S 및 상태 변화
[활력징후 및 전반적 상태 요약]

### 투약 및 처치
[투여한 약물 및 수행한 처치 요약]

### 관찰 사항
[특이 관찰사항 및 증상 변화]

## 특이사항
[주의깊게 관찰해야 할 사항들]

## 다음 근무자 인계사항
[다음 근무자가 특별히 주의해야 할 점들]

작성 원칙:
1. 간결하고 명확하게 작성
2. 의학적으로 정확한 표현 사용
3. 우선순위가 높은 사항부터 기술
4. 객관적 사실과 주관적 관찰 구분
5. 연속성 있는 간호를 위한 구체적 지침 제공
`;

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 경험 많은 수간호사로서, 간호기록을 바탕으로 정확하고 체계적인 인계장을 작성하는 전문가입니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT API 응답이 없습니다.');
    }

    return content;

  } catch (error) {
    console.error('GPT API 오류:', error);
    throw new Error(`인계장 생성 실패: ${error.message}`);
  }
};

/**
 * AI 챗봇 질의응답
 * @param {string} question - 사용자 질문
 * @param {Array} records - 관련 간호기록들
 * @param {Object} patientInfo - 환자 정보
 * @returns {Promise<string>} AI 응답
 */
export const askChatbot = async (question, records, patientInfo) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  const recordsContext = records.map(record => 
    `[${record.timestamp}] ${record.category}: ${record.content || record.structured_content}`
  ).join('\n');

  const prompt = `
환자 정보:
- 이름: ${patientInfo.name}
- 진단: ${patientInfo.diagnosis}
- 병실: ${patientInfo.room}

간호기록:
${recordsContext}

질문: ${question}

위의 간호기록을 바탕으로 질문에 정확하고 도움이 되는 답변을 해주세요.
답변할 수 없는 정보는 솔직히 "기록에 없습니다"라고 말씀해 주세요.
`;

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 간호기록을 바탕으로 정확한 정보를 제공하는 간호 AI 어시스턴트입니다. 기록에 없는 정보는 추측하지 말고, 있는 정보만 정확히 답변하세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT API 응답이 없습니다.');
    }

    return content;

  } catch (error) {
    console.error('GPT API 오류:', error);
    throw new Error(`챗봇 응답 실패: ${error.message}`);
  }
};