import { Student, Professor, Company, Recommendation, Job, JobApplication, RecommendationCode } from '../types';

export const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 'prof-kim',
    name: '김태진 교수',
    email: 'tjkim@university.edu',
    university: '한국대학교',
    department: '컴퓨터공학과',
    createdAt: '2026-03-10T10:00:00Z'
  },
  {
    id: 'prof-park',
    name: '박서현 교수',
    email: 'shpark@university.edu',
    university: '글로벌대학교',
    department: '인공지능학과',
    createdAt: '2026-04-15T14:30:00Z'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-naver',
    name: '(주)네오소프트',
    email: 'talent@neosoft.com',
    businessId: '120-81-45678',
    website: 'https://neosoft.co.kr',
    description: '인공지능 기반 지능형 기업 솔루션 및 차세대 웹 기술을 개발하는 기술 중심 혁신 벤처기업입니다.',
    industry: 'SW 개발 및 솔루션',
    address: '서울특별시 강남구 테헤란로 425',
    verificationStatus: 'VERIFIED',
    logoUrl: '🏢',
    verifiedAt: '2026-06-01T09:00:00Z',
    createdAt: '2026-05-10T12:00:00Z'
  },
  {
    id: 'comp-meta',
    name: '메타버스 테크',
    email: 'join@metatech.io',
    businessId: '220-44-99881',
    website: 'https://metatech.io',
    description: '3D 메타버스 가상 공간 시뮬레이션 및 XR 교육 솔루션을 구축하는 전문 개발사입니다.',
    industry: 'VR/AR 및 메타버스',
    address: '경기도 성남시 분당구 판교역로 152',
    verificationStatus: 'PENDING',
    logoUrl: '🌐',
    documentFileName: '사업자등록증_메타버스테크.pdf',
    createdAt: '2026-06-10T15:45:00Z'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-minsoo',
    name: '강민수',
    email: 'minsoo@gmail.com',
    university: '한국대학교',
    major: '컴퓨터공학과',
    resume: {
      bio: '풀스택 웹 프레임워크와 클라우드 서비스에 지대한 관심이 있으며, 프론트엔드 성능 최적화를 깊고 치열하게 고민하는 3학년 재학생 강민수입니다.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Git'],
      education: '한국대학교 컴퓨터공학과 3학년 (학점 4.1 / 4.5)',
      experience: '교내 웹 개발 동아리 회장 (2025.03 ~ 현재)\n학부 멘토링 프로그램 웹 프론트엔드 멘토 수행',
      projects: '1. 교내 수강신청 가이드 웹앱 프로젝트 - React 기반 수강 정원 시각화\n2. AI 요약 뉴스레터 플랫폼 - 개인 관심사 맞춤형 AI 크롤러 플랫폼',
      fileName: '강민수_이력서_풀스택.pdf',
      fileSize: '412 KB'
    },
    recommendationStatus: 'VERIFIED',
    recommendationId: 'reco-1',
    verifiedAt: '2026-06-05T11:20:00Z',
    createdAt: '2026-05-20T10:30:00Z'
  },
  {
    id: 'stud-jiwon',
    name: '한지원',
    email: 'jiwon@gmail.com',
    university: '한국대학교',
    major: '컴퓨터공학과',
    resume: {
      bio: '데이터 분산 처리 인프라와 머신러닝 데이터 파이프라인에 깊고 넓은 매력을 느끼는 예비 개발자입니다.',
      skills: ['Python', 'SQL', 'PyTorch', 'Data Analysis'],
      education: '한국대학교 컴퓨터공학과 4학년 (학점 3.9 / 4.5)',
      experience: '교내 알고리즘 소모임 정회원 (2025 ~ 현재)'
    },
    recommendationStatus: 'PENDING', // 가입 중 추천 대기 상태
    requestedProfessorName: '김태진 교수',
    requestedProfessorEmail: 'tjkim@university.edu',
    createdAt: '2026-06-12T14:10:00Z'
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'reco-1',
    studentId: 'stud-minsoo',
    studentEmail: 'minsoo@gmail.com',
    studentName: '강민수',
    professorId: 'prof-kim',
    professorName: '김태진 교수',
    professorEmail: 'tjkim@university.edu',
    relationship: '지도교수',
    content: '강민수 학생은 학과 전공 성적이 우수할 뿐 아니라, 학업 외적인 웹 알고리즘 프로젝트 설계 능력이 탁월한 인재입니다. 교내 학술대회에서 데이터 처리 동시성 제어 프로젝트로 입상한 경험이 있으며, 주도적이고 협동 정신이 뛰어납니다. 적극 추천합니다.',
    tags: ['성실성 우수', '코딩 역량 탁월', '문제 해결 주도성', '협업 인성 우수'],
    status: 'APPROVED',
    createdAt: '2026-06-05T11:20:00Z'
  }
];

export const INITIAL_RECOMMENDATION_CODES: RecommendationCode[] = [
  {
    code: 'PROF-KIM-7789',
    professorId: 'prof-kim',
    professorName: '김태진 교수',
    professorEmail: 'tjkim@university.edu',
    issuedForEmail: 'jiwon@gmail.com',
    createdAt: '2026-06-11T16:00:00Z',
    isUsed: false,
    relationship: '지도교수'
  },
  {
    code: 'PROF-PARK-0012',
    professorId: 'prof-park',
    professorName: '박서현 교수',
    professorEmail: 'shpark@university.edu',
    createdAt: '2026-06-12T10:00:00Z',
    isUsed: false,
    relationship: '교과목 수업 교수'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    companyId: 'comp-naver',
    companyName: '(주)네오소프트',
    companyLogo: '🏢',
    title: '웹 프론트엔드 React 인턴십 채용',
    description: '자사 스마트 엔터프라이즈 업무 시스템 고도화 및 반응형 프론트엔드 개발 프로젝트를 보조하고, 컴포넌트 단위 테스트 주도 개발을 경험할 성실한 학부 연계 인턴을 모집합니다.',
    requirements: [
      'React 및 TypeScript 구현 환경에 대한 명확한 이해',
      'HTML/CSS와 Tailwind CSS 등 다이나믹 스타일링 도구 숙련도',
      '협업 도구(Git/GitHub)의 실무 활용 및 충돌 해결 역량'
    ],
    preferences: [
      '지도 교수 또는 담당 전공 교수의 강력한 추천 및 검증을 획득한 학생',
      '상태 관리 도구(Redux, Zustand, Recoil 등) 활용 유경험자',
      '웹 접근성에 기초한 시맨틱 마크업 설계 능력'
    ],
    location: '서울특별시 강남구 (하이브리드 재택근무 병행)',
    salary: '월 270만 원 (4대보험 가입 및 식비 전액 제공)',
    status: 'ACTIVE',
    createdAt: '2026-06-03T10:00:00Z',
    applicantsCount: 1
  },
  {
    id: 'job-2',
    companyId: 'comp-naver',
    companyName: '(주)네오소프트',
    companyLogo: '🏢',
    title: '데이터 과학 및 파이프라인 개발 인턴십',
    description: '수집되는 비정형 원시 데이터를 정제하여 목적에 특화된 DB로 파이프라인을 연계하고, 기초 머신러닝 학습 피쳐 세트를 가공하는 업무를 담당합니다.',
    requirements: [
      'Python 기반 데이터 연산 라이브러리(Pandas, NumPy) 숙련자',
      '기초적인 RDBMS 및 NoSQL SQL 쿼리 설계 역량',
      '통계학적 기본 개념 및 가설 설정/검정 개념 보유자'
    ],
    preferences: [
      '전공 수업에서 프로젝트 형태로 머신러닝 데이터 분석 프로젝트 진행 경험',
      '클라우드 기반 데이터베이스 연결 능력을 갖춘 우수 추천 보유 학생'
    ],
    location: '서울특별시 강남구 (대면 출근)',
    salary: '월 280만 원 (석식 및 간식 무제한 서포트)',
    status: 'ACTIVE',
    createdAt: '2026-06-05T09:30:00Z',
    applicantsCount: 0
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: '웹 프론트엔드 React 인턴십 채용',
    companyId: 'comp-naver',
    companyName: '(주)네오소프트',
    studentId: 'stud-minsoo',
    studentName: '강민수',
    studentEmail: 'minsoo@gmail.com',
    studentMajor: '컴퓨터공학과',
    studentUniversity: '한국대학교',
    resume: {
      bio: '풀스택 웹 프레임워크와 클라우드 서비스에 지대한 관심이 있으며, 프론트엔드 성능 최적화를 깊고 치열하게 고민하는 3학년 재학생 강민수입니다.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Git'],
      education: '한국대학교 컴퓨터공학과 3학년 (학점 4.1 / 4.5)',
      experience: '교내 웹 개발 동아리 회장 (2025.03 ~ 현재)\n학부 멘토링 프로그램 웹 프론트엔드 멘토 수행',
      projects: '1. 교내 수강신청 가이드 웹앱 프로젝트 - React 기반 수강 정원 시각화\n2. AI 요약 뉴스레터 플랫폼 - 개인 관심사 맞춤형 AI 크롤러 플랫폼',
      fileName: '강민수_이력서_풀스택.pdf',
      fileSize: '412 KB'
    },
    recommendation: INITIAL_RECOMMENDATIONS[0],
    status: 'PENDING',
    appliedAt: '2026-06-06T14:00:00Z'
  }
];
