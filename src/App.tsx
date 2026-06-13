/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROFESSORS,
  INITIAL_COMPANIES,
  INITIAL_STUDENTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_RECOMMENDATION_CODES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS
} from './data/mockData';
import { 
  UserRole, 
  Student, 
  Professor, 
  Company, 
  Recommendation, 
  RecommendationCode, 
  Job, 
  JobApplication,
  Resume
} from './types';
import RoleSwitcher from './components/RoleSwitcher';
import StudentDashboard from './components/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard';
import SignUpSimulator from './components/SignUpSimulator';
import AcademicHome from './components/AcademicHome';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Users2 
} from 'lucide-react';

const STORAGE_KEY = 'academic_internship_db_v1';

export default function App() {
  // DB States
  const [students, setStudents] = useState<Student[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationCodes, setRecommendationCodes] = useState<RecommendationCode[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Demo active sessions
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [currentActorId, setCurrentActorId] = useState<string>('stud-jiwon'); // Target pending student initially
  const [currentTab, setCurrentTab] = useState<'HOME' | 'WORKBENCH'>('HOME');

  // SignUp dialog trigger
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showDemoTips, setShowDemoTips] = useState(true);

  // Load database from localStorage or seed
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudents(parsed.students || INITIAL_STUDENTS);
        setProfessors(parsed.professors || INITIAL_PROFESSORS);
        setCompanies(parsed.companies || INITIAL_COMPANIES);
        setRecommendations(parsed.recommendations || INITIAL_RECOMMENDATIONS);
        setRecommendationCodes(parsed.recommendationCodes || INITIAL_RECOMMENDATION_CODES);
        setJobs(parsed.jobs || INITIAL_JOBS);
        setApplications(parsed.applications || INITIAL_APPLICATIONS);
      } catch (err) {
        console.error('Error loading localStorage state, resetting to seeds', err);
        resetToDefaults();
      }
    } else {
      resetToDefaults();
    }
  }, []);

  // Save changes helper
  const syncStorage = (
    currentStudents: Student[],
    currentProfessors: Professor[],
    currentCompanies: Company[],
    currentRecommendations: Recommendation[],
    currentCodes: RecommendationCode[],
    currentJobs: Job[],
    currentApps: JobApplication[]
  ) => {
    const state = {
      students: currentStudents,
      professors: currentProfessors,
      companies: currentCompanies,
      recommendations: currentRecommendations,
      recommendationCodes: currentCodes,
      jobs: currentJobs,
      applications: currentApps
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const resetToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setProfessors(INITIAL_PROFESSORS);
    setCompanies(INITIAL_COMPANIES);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setRecommendationCodes(INITIAL_RECOMMENDATION_CODES);
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    
    // Default actor roles
    setCurrentRole('STUDENT');
    setCurrentActorId('stud-jiwon');

    const state = {
      students: INITIAL_STUDENTS,
      professors: INITIAL_PROFESSORS,
      companies: INITIAL_COMPANIES,
      recommendations: INITIAL_RECOMMENDATIONS,
      recommendationCodes: INITIAL_RECOMMENDATION_CODES,
      jobs: INITIAL_JOBS,
      applications: INITIAL_APPLICATIONS
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // Switch role and automatically set appropriate active actor ID
  const handleActorChange = (role: UserRole, actorId: string) => {
    setCurrentRole(role);
    setCurrentActorId(actorId);
  };

  // 1. STUDENT EVENT ACTION HANDLERS
  const handleApplyForJob = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const targetStudent = students.find(s => s.id === currentActorId);
    if (!targetJob || !targetStudent) return;

    // Fetch this student's approved active recommendation, if any
    const relatedRecommendation = recommendations.find(
      r => r.studentEmail === targetStudent.email && r.status === 'APPROVED'
    );

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      companyId: targetJob.companyId,
      companyName: targetJob.companyName,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      studentEmail: targetStudent.email,
      studentMajor: targetStudent.major,
      studentUniversity: targetStudent.university,
      resume: targetStudent.resume,
      recommendation: relatedRecommendation,
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };

    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);

    // Update job applicant tally
    const updatedJobs = jobs.map(j => {
      if (j.id === jobId) {
        return { ...j, applicantsCount: j.applicantsCount + 1 };
      }
      return j;
    });
    setJobs(updatedJobs);

    syncStorage(students, professors, companies, recommendations, recommendationCodes, updatedJobs, updatedApps);
  };

  const handleUpdateResume = (updatedResume: Resume) => {
    const updatedStudents = students.map(s => {
      if (s.id === currentActorId) {
        return { ...s, resume: updatedResume };
      }
      return s;
    });
    setStudents(updatedStudents);
    syncStorage(updatedStudents, professors, companies, recommendations, recommendationCodes, jobs, applications);
  };

  const handleVerifyWithCode = (code: string): boolean => {
    // Find the code
    const matchedCode = recommendationCodes.find(
      c => c.code === code && !c.isUsed
    );
    if (!matchedCode) return false;

    // Find the student
    const activeStudent = students.find(s => s.id === currentActorId);
    if (!activeStudent) return false;

    // 1. Mark code as used
    const updatedCodes = recommendationCodes.map(c => {
      if (c.code === code) {
        return { ...c, isUsed: true, usedByEmail: activeStudent.email };
      }
      return c;
    });

    // 2. Grant recommendation entity
    const newRecommendation: Recommendation = {
      id: `reco-${Date.now()}`,
      studentId: activeStudent.id,
      studentEmail: activeStudent.email,
      studentName: activeStudent.name,
      professorId: matchedCode.professorId,
      professorName: matchedCode.professorName,
      professorEmail: matchedCode.professorEmail,
      relationship: matchedCode.relationship,
      content: `[추천 암호 ${code} 검증됨] 해당 학생은 평소 학과에서 전공 교과 이수에 높은 열의를 보이며 교수 승인 코드를 직접 제공받은 성과 보증 장학 대상 후보자입니다.`,
      tags: ['성실도 인증', '암호승인 완료', '전공 역량 증명'],
      status: 'APPROVED',
      verifiedCode: code,
      createdAt: new Date().toISOString()
    };
    const updatedRecommendations = [...recommendations, newRecommendation];

    // 3. Set student verified
    const updatedStudents = students.map(s => {
      if (s.id === currentActorId) {
        return {
          ...s,
          recommendationStatus: 'VERIFIED' as const,
          recommendationId: newRecommendation.id,
          verifiedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setRecommendationCodes(updatedCodes);
    setRecommendations(updatedRecommendations);
    setStudents(updatedStudents);

    syncStorage(updatedStudents, professors, companies, updatedRecommendations, updatedCodes, jobs, applications);
    return true;
  };

  const handleRequestRecommendation = (profName: string, profEmail: string) => {
    const updatedStudents = students.map(s => {
      if (s.id === currentActorId) {
        return {
          ...s,
          recommendationStatus: 'PENDING' as const,
          requestedProfessorName: profName,
          requestedProfessorEmail: profEmail
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    syncStorage(updatedStudents, professors, companies, recommendations, recommendationCodes, jobs, applications);
  };

  const handleUploadMockRecommendation = (
    profName: string, 
    profEmail: string, 
    fileContent: string, 
    tags: string[], 
    relationship: string
  ) => {
    const activeStudent = students.find(s => s.id === currentActorId);
    if (!activeStudent) return;

    const newRecommendation: Recommendation = {
      id: `reco-${Date.now()}`,
      studentId: activeStudent.id,
      studentEmail: activeStudent.email,
      studentName: activeStudent.name,
      professorId: `prof-gen-${Date.now()}`,
      professorName: profName,
      professorEmail: profEmail,
      relationship,
      content: fileContent,
      tags,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };

    const updatedRecommendations = [...recommendations, newRecommendation];

    const updatedStudents = students.map(s => {
      if (s.id === currentActorId) {
        return {
          ...s,
          recommendationStatus: 'VERIFIED' as const,
          recommendationId: newRecommendation.id,
          verifiedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setRecommendations(updatedRecommendations);
    setStudents(updatedStudents);
    syncStorage(updatedStudents, professors, companies, updatedRecommendations, recommendationCodes, jobs, applications);
  };


  // 2. PROFESSOR EVENT ACTION HANDLERS
  const handleApproveRecommendation = (
    studentId: string, 
    content: string, 
    tags: string[], 
    relationship: string, 
    courseName?: string
  ) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    const activeProfessor = professors.find(p => p.id === currentActorId);
    if (!activeProfessor) return;

    // Create official Recommendation
    const newRecommendation: Recommendation = {
      id: `reco-${Date.now()}`,
      studentId: targetStudent.id,
      studentEmail: targetStudent.email,
      studentName: targetStudent.name,
      professorId: activeProfessor.id,
      professorName: activeProfessor.name,
      professorEmail: activeProfessor.email,
      relationship,
      courseName,
      content,
      tags,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };

    const updatedRecommendations = [...recommendations, newRecommendation];

    // Update target student credentials to VERIFIED
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          recommendationStatus: 'VERIFIED' as const,
          recommendationId: newRecommendation.id,
          verifiedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setRecommendations(updatedRecommendations);
    setStudents(updatedStudents);
    syncStorage(updatedStudents, professors, companies, updatedRecommendations, recommendationCodes, jobs, applications);
    alert(`제자 ${targetStudent.name} 학생의 매칭 추천 서명이 승인 발송되었습니다!`);
  };

  const handleGenerateCode = (issuedForEmail?: string, relationship?: string) => {
    const activeProf = professors.find(p => p.id === currentActorId);
    if (!activeProf) return;

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const surName = activeProf.name.substring(0, 1) === '김' ? 'KIM' : activeProf.name.substring(0, 1) === '박' ? 'PARK' : 'LEE';
    const finalCode = `PROF-${surName}-${codeNum}`;

    const newCode: RecommendationCode = {
      code: finalCode,
      professorId: activeProf.id,
      professorName: activeProf.name,
      professorEmail: activeProf.email,
      issuedForEmail,
      createdAt: new Date().toISOString(),
      isUsed: false,
      relationship: relationship || '지도교수'
    };

    const updatedCodes = [...recommendationCodes, newCode];
    setRecommendationCodes(updatedCodes);
    syncStorage(students, professors, companies, recommendations, updatedCodes, jobs, applications);
  };

  const handleDeleteCode = (code: string) => {
    const updatedCodes = recommendationCodes.filter(c => c.code !== code);
    setRecommendationCodes(updatedCodes);
    syncStorage(students, professors, companies, recommendations, updatedCodes, jobs, applications);
  };


  // 3. COMPANY EVENT ACTION HANDLERS
  const handleAddJob = (
    title: string, 
    description: string, 
    requirements: string[], 
    preferences: string[], 
    location: string, 
    salary: string
  ) => {
    const activeCompany = companies.find(c => c.id === currentActorId);
    if (!activeCompany) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      companyLogo: activeCompany.logoUrl,
      title,
      description,
      requirements,
      preferences,
      location,
      salary,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      applicantsCount: 0
    };

    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    syncStorage(students, professors, companies, recommendations, recommendationCodes, updatedJobs, applications);
    alert('신규 인턴 채용공고가 정상 기소/유포되었습니다.');
  };

  const handleUpdateApplicationStatus = (
    appId: string, 
    status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED', 
    feedback?: string
  ) => {
    const updatedApps = applications.map(app => {
      if (app.id === appId) {
        return { ...app, status, feedback };
      }
      return app;
    });

    setApplications(updatedApps);
    syncStorage(students, professors, companies, recommendations, recommendationCodes, jobs, updatedApps);
  };

  const handleBypassCompanyVerify = () => {
    const updatedCompanies = companies.map(c => {
      if (c.id === currentActorId) {
        return { ...c, verificationStatus: 'VERIFIED' as const, verifiedAt: new Date().toISOString() };
      }
      return c;
    });
    setCompanies(updatedCompanies);
    syncStorage(students, professors, updatedCompanies, recommendations, recommendationCodes, jobs, applications);
  };


  // 4. ADMIN EVENT ACTION HANDLERS
  const handleVerifyCompany = (companyId: string, status: 'VERIFIED' | 'REJECTED') => {
    const updatedCompanies = companies.map(c => {
      if (c.id === companyId) {
        return { 
          ...c, 
          verificationStatus: status, 
          verifiedAt: status === 'VERIFIED' ? new Date().toISOString() : undefined 
        };
      }
      return c;
    });
    setCompanies(updatedCompanies);
    syncStorage(students, professors, updatedCompanies, recommendations, recommendationCodes, jobs, applications);
    alert(`선택된 사기업 가입 계약서 심사가 [${status === 'VERIFIED' ? '최종 승인' : '반려'}] 조치되었습니다.`);
  };


  // 5. REGISTRATION EXECUTIONS
  const handleRegisterStudent = (
    name: string, 
    email: string, 
    university: string, 
    major: string, 
    bio: string, 
    skills: string[],
    profName: string,
    profEmail: string
  ) => {
    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      name,
      email,
      university,
      major,
      resume: {
        bio,
        skills,
        education: `${university} ${major} 3학년`
      },
      recommendationStatus: 'PENDING', // starts pending recommendation requirement
      requestedProfessorName: profName,
      requestedProfessorEmail: profEmail,
      createdAt: new Date().toISOString()
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    syncStorage(updatedStudents, professors, companies, recommendations, recommendationCodes, jobs, applications);
    
    // Automatically login to newly registered student to let them test recommendation flow
    handleActorChange('STUDENT', newStudent.id);
  };

  const handleRegisterProfessor = (
    name: string, 
    email: string, 
    university: string, 
    department: string
  ) => {
    const newProf: Professor = {
      id: `prof-${Date.now()}`,
      name,
      email,
      university,
      department,
      createdAt: new Date().toISOString()
    };

    const updatedProfs = [...professors, newProf];
    setProfessors(updatedProfs);
    syncStorage(students, updatedProfs, companies, recommendations, recommendationCodes, jobs, applications);
    
    handleActorChange('PROFESSOR', newProf.id);
  };

  const handleRegisterCompany = (
    name: string, 
    email: string, 
    businessId: string, 
    website: string, 
    description: string, 
    industry: string, 
    address: string,
    fileName: string
  ) => {
    const newComp: Company = {
      id: `comp-${Date.now()}`,
      name,
      email,
      businessId,
      website,
      logoUrl: '🏢',
      description,
      industry,
      address,
      verificationStatus: 'PENDING', // starts pending verification process
      documentFileName: fileName,
      createdAt: new Date().toISOString()
    };

    const updatedCompanies = [...companies, newComp];
    setCompanies(updatedCompanies);
    syncStorage(students, professors, updatedCompanies, recommendations, recommendationCodes, jobs, applications);
    
    handleActorChange('COMPANY', newComp.id);
  };

  const activeStudent = students.find(s => s.id === currentActorId);
  const activeProfessor = professors.find(p => p.id === currentActorId);
  const activeCompany = companies.find(c => c.id === currentActorId);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Upper Floating Developer Role Bar */}
      <RoleSwitcher
        currentRole={currentRole}
        currentActorId={currentActorId}
        students={students}
        professors={professors}
        companies={companies}
        onActorChange={handleActorChange}
        onResetData={resetToDefaults}
        onOpenSignUpTrigger={() => setShowSignUpDialog(true)}
      />

      {/* Main Content Stage container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Helper interactive instructions widget card */}
        {showDemoTips && (
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-slate-100 rounded-2xl p-6 shadow-md border border-slate-800 relative">
            <button 
              onClick={() => setShowDemoTips(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs cursor-pointer font-bold"
            >
              숨기기
            </button>
            
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-indigo-400 mt-0.5 shrink-0" />
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200">💡 학술 인턴십 매칭 플랫폼 데모 시나리오 안내 가이드</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    본 서비스는 무분별한 단순 입사 지원을 통제하기 위해 <strong>'교수진의 학술 추천 소견서'</strong> 제출과 <strong>'정부 인증된 공공/민간 기업 신원'</strong>이 가공 대조되어야만 가입과 구인이 원천 작동하게 빌드되었습니다. 아래 제안 흐름을 직접 수행하며 무결성 구조를 검토해 볼 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-[10.5px] leading-relaxed text-slate-300">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <span className="font-bold text-indigo-400 block mb-1">1단계: 학생 가입제한</span>
                    기본 선택된 <strong>한지원 학생(대기)</strong>은 추천서가 부재해 공고 접근이 원천 차단됩니다.
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <span className="font-bold text-indigo-400 block mb-1">2단계: 스승 추천 서명</span>
                    상단에서 <strong>"김태진 교수"</strong>를 선택해 제자 대기란에서 <strong>한지원 님</strong>을 골라 추천서를 작성 및 발송하세요.
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <span className="font-bold text-indigo-400 block mb-1">3단계: 인턴 투입 지원</span>
                    다시 <strong>한지원 학생</strong>으로 전환하면 차단이 풀려 있습니다. <strong>(주)네오소프트</strong> React 공고에 지원서를 작성 기소하세요!
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <span className="font-bold text-indigo-400 block mb-1">4단계: 기업 합격 인허</span>
                    <strong>"네오소프트 인사팀"</strong>으로 스위칭해 지원자 탭에서 <strong>김태진 교수 추천 소견서</strong> 대조 검토 후 <strong>오퍼 선발 승인</strong>을 결제하세요.
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <span className="font-bold text-indigo-400 block mb-1">5단계: 심사 대장 확인</span>
                    <strong>"총괄 관리자(Admin)"</strong> 대장을 열면 완결된 최종 매칭 계약 원장이 세밀하게 등재 완료되어 있습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📍 플랫폼 메인 메뉴 네비게이션 */}
        <div className="flex border-b border-slate-200 gap-2">
          <button 
            id="tab-home"
            onClick={() => setCurrentTab('HOME')}
            className={`py-3 px-5 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'HOME' 
                ? 'border-indigo-650 text-indigo-700 font-black bg-indigo-50/40 rounded-t-xl' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>🏠 대학-기업 매칭 광장 (메인 홈)</span>
          </button>
          
          <button 
            id="tab-workbench"
            onClick={() => setCurrentTab('WORKBENCH')}
            className={`py-3 px-5 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'WORKBENCH' 
                ? 'border-indigo-650 text-indigo-700 font-black bg-indigo-50/40 rounded-t-xl' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>⚙️ 역할별 시뮬레이션 워크벤치</span>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] scale-90 px-2 py-0.5 rounded-full font-bold">
              {currentRole} 시뮬레이터
            </span>
          </button>
        </div>

        {currentTab === 'HOME' ? (
          <AcademicHome
            jobs={jobs}
            students={students}
            recommendations={recommendations}
            companies={companies}
            onSwitchToRole={(role, actorId) => {
              setCurrentRole(role);
              setCurrentActorId(actorId);
              setCurrentTab('WORKBENCH');
            }}
            onApplyQuick={(jobId) => {
              handleApplyForJob(jobId);
              setCurrentTab('WORKBENCH');
            }}
            currentRole={currentRole}
            currentActorId={currentActorId}
          />
        ) : (
          <div className="space-y-6">
            {/* Dynamic active user layout headers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 border text-indigo-600 font-bold select-none text-md">
                  {currentRole === 'STUDENT' && '🎓'}
                  {currentRole === 'PROFESSOR' && '👨‍🏫'}
                  {currentRole === 'COMPANY' && '🏢'}
                  {currentRole === 'ADMIN' && '💻'}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">현재 임대 세션 브릿지</span>
                  <h2 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
                    {currentRole === 'STUDENT' && `학생: ${activeStudent?.name || '로딩 중...'} (소속: ${activeStudent?.university})`}
                    {currentRole === 'PROFESSOR' && `교수진: ${activeProfessor?.name || '로딩 중...'} (${activeProfessor?.department})`}
                    {currentRole === 'COMPANY' && `파트너 기업: ${activeCompany?.name || '로딩 중...'} [업종: ${activeCompany?.industry}]`}
                    {currentRole === 'ADMIN' && '플랫폼 총괄 관리 보안 아카이브 (SYSADMIN)'}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">데모 DB 정합성 상태 : </span>
                <span className="inline-flex items-center text-[10.5px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-100 px-3/5 py-1 rounded-full gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span> 로컬 연동 가열화 가동 중
                </span>
              </div>
            </div>

            {/* Dynamic Screen router core */}
            <div className="min-h-[50vh]">
              {currentRole === 'STUDENT' && activeStudent && (
                <StudentDashboard
                  student={activeStudent}
                  allJobs={jobs}
                  allApplications={applications}
                  recommendationCodes={recommendationCodes}
                  allRecommendations={recommendations}
                  onApplyForJob={handleApplyForJob}
                  onUpdateResume={handleUpdateResume}
                  onVerifyWithCode={handleVerifyWithCode}
                  onUploadMockRecommendation={handleUploadMockRecommendation}
                  onRequestRecommendation={handleRequestRecommendation}
                />
              )}

              {currentRole === 'PROFESSOR' && activeProfessor && (
                <ProfessorDashboard
                  professor={activeProfessor}
                  allStudents={students}
                  allRecommendations={recommendations}
                  recommendationCodes={recommendationCodes}
                  onApproveRecommendation={handleApproveRecommendation}
                  onGenerateCode={handleGenerateCode}
                  onDeleteCode={handleDeleteCode}
                />
              )}

              {currentRole === 'COMPANY' && activeCompany && (
                <CompanyDashboard
                  company={activeCompany}
                  allJobs={jobs}
                  allApplications={applications}
                  allStudents={students}
                  onAddJob={handleAddJob}
                  onUpdateApplicationStatus={handleUpdateApplicationStatus}
                  onBypassCompanyVerify={handleBypassCompanyVerify}
                />
              )}

              {currentRole === 'ADMIN' && (
                <AdminDashboard
                  companies={companies}
                  students={students}
                  professors={professors}
                  recommendations={recommendations}
                  applications={applications}
                  onVerifyCompany={handleVerifyCompany}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* SignUp Wizard dialog overlay */}
      {showSignUpDialog && (
        <SignUpSimulator
          onClose={() => setShowSignUpDialog(false)}
          onRegisterStudent={handleRegisterStudent}
          onRegisterProfessor={handleRegisterProfessor}
          onRegisterCompany={handleRegisterCompany}
          professors={professors}
        />
      )}

      {/* Footer credit section conforming to humble literals */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5 font-medium">
          <p>Academic Internship Matcher Platform</p>
          <p className="text-[10px] text-slate-405">지도교수 추천 봉약 시스템 및 보안 기업 관리 모듈 © 2026</p>
        </div>
      </footer>
    </div>
  );
}
