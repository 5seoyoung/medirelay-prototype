# MediRelay 풀스택 아키텍처 설계

##  **전체 시스템 구조**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
│  React + Vite + TypeScript + Tailwind CSS              │
│  📱 Progressive Web App (PWA)                           │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────┴───────────────────────────────────────┐
│                    BACKEND                              │
│  🚀 FastAPI + Python 3.11+                             │
│  🔐 JWT Authentication + Role-based Access             │
│  📡 WebSocket (실시간 기능)                              │
└─────────────────┬───────────────────────────────────────┘
                  │ SQL/ORM
┌─────────────────┴───────────────────────────────────────┐
│                   DATABASE                              │
│  🗄️ PostgreSQL (운영) / SQLite (개발)                   │
│  📊 Alembic 마이그레이션                                │
└─────────────────┬───────────────────────────────────────┘
                  │ 
┌─────────────────┴───────────────────────────────────────┐
│                EXTERNAL APIs                           │
│  🎙️ OpenAI Whisper (STT)                               │
│  🤖 OpenAI GPT-4 (NLP, 요약, 분류)                     │
│  📱 Twilio/Firebase (알림)                              │
└─────────────────────────────────────────────────────────┘
```

## 📁 **프로젝트 구조 (풀스택)**

```
medirelay-fullstack/
├── 📁 frontend/                 # React 프론트엔드
│   ├── 📁 src/
│   │   ├── 📁 components/       # 공통 컴포넌트
│   │   ├── 📁 pages/           # 페이지 컴포넌트
│   │   ├── 📁 services/        # API 통신
│   │   ├── 📁 hooks/           # 커스텀 훅
│   │   ├── 📁 store/           # 상태관리 (Zustand)
│   │   └── 📁 utils/           # 유틸리티
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 backend/                  # FastAPI 백엔드
│   ├── 📁 app/
│   │   ├── 📁 api/             # API 라우터
│   │   │   ├── auth.py         # 인증 관련
│   │   │   ├── patients.py     # 환자 관리
│   │   │   ├── records.py      # 간호기록
│   │   │   ├── handovers.py    # 인계장
│   │   │   └── ai.py           # AI 기능
│   │   ├── 📁 core/            # 핵심 설정
│   │   │   ├── config.py       # 환경설정
│   │   │   ├── database.py     # DB 연결
│   │   │   └── security.py     # 인증 로직
│   │   ├── 📁 models/          # DB 모델
│   │   │   ├── user.py         # 사용자 모델
│   │   │   ├── patient.py      # 환자 모델
│   │   │   ├── record.py       # 기록 모델
│   │   │   └── handover.py     # 인계 모델
│   │   ├── 📁 schemas/         # Pydantic 스키마
│   │   ├── 📁 services/        # 비즈니스 로직
│   │   │   ├── whisper.py      # STT 서비스
│   │   │   ├── openai_gpt.py   # GPT 서비스
│   │   │   └── nlp.py          # NLP 처리
│   │   └── main.py             # FastAPI 앱
│   ├── 📁 alembic/             # DB 마이그레이션
│   ├── requirements.txt        # Python 의존성
│   └── .env.example            # 환경변수 템플릿
│
├── 📁 database/                # DB 관련
│   ├── init.sql               # 초기 데이터
│   └── docker-compose.yml     # PostgreSQL 컨테이너
│
├── 📁 docs/                   # 문서
│   ├── API.md                 # API 문서
│   ├── DEPLOYMENT.md          # 배포 가이드
│   └── ARCHITECTURE.md        # 아키텍처 설명
│
└── README.md                  # 프로젝트 개요
```

## 🛠️ **기술 스택 상세**

### **Frontend (React)**
- ⚛️ **React 18** + **TypeScript**
- 🎨 **Tailwind CSS** (깔끔한 디자인)
- 🔄 **React Query** (서버 상태 관리)
- 🗂️ **Zustand** (클라이언트 상태 관리)
- 📱 **PWA** (모바일 앱처럼 사용)
- 📷 **react-qr-reader** (QR 스캔)
- 🎙️ **react-media-recorder** (음성 녹음)

### **Backend (FastAPI)**
- 🚀 **FastAPI** (고성능 API)
- 🔐 **JWT** + **bcrypt** (인증/보안)
- 🗄️ **SQLAlchemy** (ORM)
- 📊 **Alembic** (DB 마이그레이션)
- ✅ **Pydantic** (데이터 검증)
- 📡 **WebSocket** (실시간 기능)
- 🧪 **Pytest** (테스트)

### **Database**
- 🐘 **PostgreSQL** (운영 환경)
- 🗃️ **SQLite** (개발 환경)
- 🐳 **Docker** (DB 컨테이너)

### **AI & External APIs**
- 🎙️ **OpenAI Whisper** (음성→텍스트)
- 🤖 **OpenAI GPT-4** (분류, 요약, 챗봇)
- 📱 **Twilio** (SMS 알림) - 선택사항

## 🎯 **핵심 기능 구현**

### **1. 사용자 인증 시스템**
```python
# 간호사 로그인/로그아웃
# 역할 기반 접근 제어 (간호사, 수간호사, 의사)
# JWT 토큰 관리
```

### **2. 환자 관리**
```python
# 환자 등록/조회/수정
# QR 코드 생성 (침상별)
# 입원정보, 진료과, 담당의 관리
```

### **3. 음성 차팅 시스템**
```python
# 실시간 음성 녹음
# Whisper API 연동 (STT)
# GPT 기반 자동 분류 (V/S, I/O, 투약, 관찰 등)
# 기록 저장 및 조회
```

### **4. 인계장 자동 생성**
```python
# 시간대별 환자 기록 수집
# GPT 기반 요약 생성
# 인계장 템플릿 자동 완성
# PDF/Excel 내보내기
```

### **5. AI 챗봇**
```python
# 환자 기록 기반 질의응답
# "오늘 체온이 어떻게 됐나요?"
# "어제 투약 내역을 알려주세요"
```

## 🚀 **배포 전략**

### **개발 환경**
- Frontend: `localhost:3000` (Vite)
- Backend: `localhost:8000` (uvicorn)
- Database: SQLite 또는 Docker PostgreSQL
