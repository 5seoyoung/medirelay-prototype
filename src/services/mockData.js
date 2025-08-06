// 환자 Mock 데이터
export const mockPatients = [
  {
    id: 1,
    name: "최지욱",
    birthDate: "1998.11.26",
    room: "301A",
    age: 25,
    diagnosis: "수술 후 환자, Hemovac 유치술",
    department: "정형외과",
    admissionDate: "2025-06-09",
    doctor: "이성민 교수",
    recentActivity: "18:20 주치의 회진, 상태 양호, 진통제 처방"
  },
  {
    id: 2,
    name: "김영희",
    birthDate: "1985.03.15",
    room: "302B",
    age: 39,
    diagnosis: "급성 충수염 수술 후",
    department: "외과",
    admissionDate: "2025-06-08",
    doctor: "박건우 교수",
    recentActivity: "16:30 수술 후 회복 중, 통증 감소, 식사 시작"
  },
  {
    id: 3,
    name: "이철수",
    birthDate: "1962.07.22",
    room: "303A",
    age: 62,
    diagnosis: "심근경색증, 스텐트 시술 후",
    department: "순환기내과",
    admissionDate: "2025-06-06",
    doctor: "정미영 교수",
    recentActivity: "14:00 심전도 검사 완료, 혈압 안정적"
  },
  {
    id: 4,
    name: "박선영",
    birthDate: "1990.12.03",
    room: "304A",
    age: 34,
    diagnosis: "자연분만 후 회복",
    department: "산부인과",
    admissionDate: "2025-06-09",
    doctor: "김소희 교수",
    recentActivity: "12:00 모유수유 교육, 산모 상태 양호"
  },
  {
    id: 5,
    name: "정민호",
    birthDate: "1978.09.11",
    room: "305B",
    age: 46,
    diagnosis: "폐렴, 산소치료 중",
    department: "호흡기내과",
    admissionDate: "2025-06-07",
    doctor: "윤대희 교수",
    recentActivity: "10:30 산소포화도 개선, 항생제 투여 중"
  }
];

// 간호기록 Mock 데이터
export const mockRecords = [
  {
    id: 1,
    patientId: 1,
    timestamp: "2025-08-07 14:30:00",
    type: "vital_signs",
    category: "V/S",
    content: "혈압 120/80mmHg, 체온 36.8°C, 맥박 78회/분, 호흡 18회/분",
    rawText: "혈압이 120에 80이고요, 체온은 36도 8입니다. 맥박은 78회고 호흡은 18회입니다.",
    nurse: "김간호사"
  },
  {
    id: 2,
    patientId: 1,
    timestamp: "2025-08-07 15:00:00",
    type: "medication",
    category: "투약",
    content: "Pethidine 25mg IV 투여 완료, 통증 점수 8→5로 감소",
    rawText: "페치딘 25밀리 정맥 투여했고요, 통증이 8에서 5로 줄었습니다.",
    nurse: "김간호사"
  },
  {
    id: 3,
    patientId: 1,
    timestamp: "2025-08-07 16:30:00",
    type: "observation",
    category: "관찰",
    content: "Hemovac 배액량 50cc, 색상 연분홍색, 상처 부위 건조 양호",
    rawText: "헤모박 드레인에서 50시시 정도 나왔고 색깔은 연분홍색이에요. 상처는 마르고 깨끗합니다.",
    nurse: "김간호사"
  }
];

// 인계장 Mock 데이터
export const mockHandovers = [
  {
    id: 1,
    patientId: 1,
    date: "2025-08-07",
    shift: "day",
    summary: `
## 환자 개요
- **이름**: 최지욱 (25세, 남)
- **진단**: 수술 후 환자, Hemovac 유치술
- **입원일**: 2025-06-09

## 오늘의 주요 사항
### V/S 및 통증 관리
- 14:30 V/S: BP 120/80, BT 36.8°C, P 78, R 18 - 안정적
- 15:00 Pethidine 25mg IV 투여로 통증 8→5로 완화
- 통증 관리 효과적, 환자 만족도 높음

### 수술 부위 및 배액관 관리  
- Hemovac 배액량: 50cc (연분홍색)
- 수술 부위 건조하고 감염 징후 없음
- 배액관 고정 상태 양호

## 특이사항
- 18:20 주치의 회진 완료, 전반적 상태 양호
- 환자 협조적이며 일상생활 서서히 회복 중

## 다음 근무자 인계사항
- 통증 점수 지속 모니터링 필요
- Hemovac 배액량 및 색상 변화 관찰
- 수술 부위 발적, 부종 여부 확인
    `
  }
];

// 채팅 Mock 데이터
export const mockChatHistory = [
  {
    id: 1,
    patientId: 1,
    timestamp: "2025-08-07 16:45:00",
    question: "오늘 체온이 어떻게 됐나요?",
    answer: "최지욱 환자의 오늘 14:30 체온은 36.8°C로 정상 범위입니다."
  },
  {
    id: 2,
    patientId: 1,
    timestamp: "2025-08-07 16:46:00",
    question: "통증제는 언제 투여했나요?",
    answer: "15:00에 Pethidine 25mg을 정맥으로 투여했습니다. 투여 후 통증 점수가 8에서 5로 감소했습니다."
  }
];

// 상수 정의
export const RECORD_CATEGORIES = {
  VITAL_SIGNS: 'V/S',
  INPUT_OUTPUT: 'I/O', 
  MEDICATION: '투약',
  OBSERVATION: '관찰',
  PROCEDURE: '처치',
  EDUCATION: '교육',
  OTHER: '기타'
};

export const SHIFTS = {
  DAY: 'day',
  EVENING: 'evening', 
  NIGHT: 'night'
};

export const DEPARTMENTS = [
  '내과',
  '외과', 
  '정형외과',
  '신경외과',
  '산부인과',
  '소아과',
  '응급의학과',
  '순환기내과',
  '호흡기내과',
  '소화기내과',
  '신경내과',
  '정신건강의학과',
  '재활의학과',
  '영상의학과',
  '병리과',
  '마취통증의학과'
];