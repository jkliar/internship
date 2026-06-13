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
import AuthenticationPage from './components/AuthenticationPage';
import GuidePage from './components/GuidePage';
import { 
  isSupabaseConfigured, 
  loadAllFromSupabase, 
  mapStudentToDB,
  mapProfessorToDB,
  mapCompanyToDB,
  mapRecommendationToDB,
  mapRecommendationCodeToDB,
  mapJobToDB,
  mapJobApplicationToDB,
  getSupabase,
  SUPABASE_SQL_DDL_SCRIPT
} from './lib/supabase';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Users2,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  FileCheck,
  Building2,
  Fingerprint,
  RotateCcw
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
  
  // Real-world state parameters
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'HOME' | 'JOBS' | 'SCHOLARS' | 'GUIDE' | 'LOGIN' | 'DASHBOARD'>('HOME');

  // SignUp dialog trigger
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showDemoTips, setShowDemoTips] = useState(true);

  const [sbSyncError, setSbSyncError] = useState<boolean>(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [showSqlDialog, setShowSqlDialog] = useState<boolean>(false);

  // Load database from localStorage or seed with real-time Supabase syncing
  useEffect(() => {
    async function loadInitialData() {
      let defaultStudents = INITIAL_STUDENTS;
      let defaultProfessors = INITIAL_PROFESSORS;
      let defaultCompanies = INITIAL_COMPANIES;
      let defaultRecommendations = INITIAL_RECOMMENDATIONS;
      let defaultRecommendationCodes = INITIAL_RECOMMENDATION_CODES;
      let defaultJobs = INITIAL_JOBS;
      let defaultApplications = INITIAL_APPLICATIONS;

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          defaultStudents = parsed.students || INITIAL_STUDENTS;
          defaultProfessors = parsed.professors || INITIAL_PROFESSORS;
          defaultCompanies = parsed.companies || INITIAL_COMPANIES;
          defaultRecommendations = parsed.recommendations || INITIAL_RECOMMENDATIONS;
          defaultRecommendationCodes = parsed.recommendationCodes || INITIAL_RECOMMENDATION_CODES;
          defaultJobs = parsed.jobs || INITIAL_JOBS;
          defaultApplications = parsed.applications || INITIAL_APPLICATIONS;
        } catch (err) {
          console.error('Error parsing localStorage', err);
        }
      }

      // Initialize with local values
      setStudents(defaultStudents);
      setProfessors(defaultProfessors);
      setCompanies(defaultCompanies);
      setRecommendations(defaultRecommendations);
      setRecommendationCodes(defaultRecommendationCodes);
      setJobs(defaultJobs);
      setApplications(defaultApplications);

      // Now query Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const res = await loadAllFromSupabase({
            students: defaultStudents,
            professors: defaultProfessors,
            companies: defaultCompanies,
            recommendations: defaultRecommendations,
            recommendationCodes: defaultRecommendationCodes,
            jobs: defaultJobs,
            applications: defaultApplications,
          });

          // Update active states with cloud values
          setStudents(res.students);
          setProfessors(res.professors);
          setCompanies(res.companies);
          setRecommendations(res.recommendations);
          setRecommendationCodes(res.recommendationCodes);
          setJobs(res.jobs);
          setApplications(res.applications);

          if (res.isTableMissing) {
            setSbSyncError(true);
            setMissingTables(res.missingTablesList);
          } else {
            setSbSyncError(false);
            setMissingTables([]);
          }
        } catch (dbErr) {
          console.error('Supabase load error:', dbErr);
          setSbSyncError(true);
        }
      }
    }

    loadInitialData();
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

    // Multi-row upsert to live Supabase DB
    const supabase = getSupabase();
    if (supabase) {
      (async () => {
        try {
          await supabase.from('students').upsert(currentStudents.map(mapStudentToDB));
          await supabase.from('professors').upsert(currentProfessors.map(mapProfessorToDB));
          await supabase.from('companies').upsert(currentCompanies.map(mapCompanyToDB));
          await supabase.from('recommendations').upsert(currentRecommendations.map(mapRecommendationToDB));
          await supabase.from('recommendation_codes').upsert(currentCodes.map(mapRecommendationCodeToDB));
          await supabase.from('jobs').upsert(currentJobs.map(mapJobToDB));
          await supabase.from('applications').upsert(currentApps.map(mapJobApplicationToDB));
        } catch (e) {
          console.error('Supabase synchronized background write failed:', e);
        }
      })();
    }
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
    setIsLoggedIn(false);
    setCurrentTab('HOME');

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
    setIsLoggedIn(true);
    setCurrentTab('DASHBOARD');
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

  const [isDevSwapperOpen, setIsDevSwapperOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans relative">
      
      {/* 📍 REAL WORLD PRODUCTION NAV BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Platform Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('HOME')}>
              <div className="bg-slate-900 text-white p-2 sm:p-2.5 rounded-xl font-black tracking-tight text-xs sm:text-sm select-none shadow-md shadow-slate-900/10 flex items-center gap-1.5 border border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Mongdang Matcher Hub</span>
              </div>
              <div className="hidden md:block flex-col align-left text-left">
                <span className="text-[10px] font-extrabold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider block">Mongdang Academic Matcher</span>
                <span className="text-[9px] text-slate-404 block -mt-0.5">교수 학술 추천 및 공식 매칭 플랫폼</span>
              </div>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('HOME')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'HOME'
                    ? 'bg-slate-100 text-slate-900 border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                🏠 매칭스퀘어 홈
              </button>
              
              {/* STUDENT or UNLOGGED Dynamic View */}
              {(!isLoggedIn || currentRole === 'STUDENT') && (
                <button
                  onClick={() => setCurrentTab('JOBS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'JOBS'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  💼 인턴 채용공고
                </button>
              )}

              {/* COMPANY / ADMIN / PROFESSOR / UNLOGGED Scholars View */}
              {(!isLoggedIn || currentRole === 'COMPANY' || currentRole === 'ADMIN' || currentRole === 'PROFESSOR') && (
                <button
                  onClick={() => setCurrentTab('SCHOLARS')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'SCHOLARS'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  🎓 학술 추천 우수인재
                </button>
              )}

              <button
                onClick={() => setCurrentTab('GUIDE')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'GUIDE'
                    ? 'bg-slate-100 text-slate-900 border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                💡 시뮬레이션 가이드
              </button>
            </div>

            {/* Right Session actions */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  
                  {/* Dashboard shortcut tab */}
                  <button
                    onClick={() => setCurrentTab('DASHBOARD')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                      currentTab === 'DASHBOARD'
                        ? 'bg-slate-900 text-white border-slate-905 shadow-sm'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'
                    }`}
                  >
                    <span>⚙️ {currentRole === 'STUDENT' ? '학생' : currentRole === 'PROFESSOR' ? '교수' : currentRole === 'COMPANY' ? '기업' : '관리자'} 대시보드</span>
                  </button>

                  {/* Profile Indicator */}
                  <div className="hidden sm:flex flex-col items-end text-right mr-1">
                    <span className="text-[9px] text-slate-400 font-bold leading-none mb-0.5">인증세션</span>
                    <span className="text-xs font-extrabold text-slate-700">
                      {currentRole === 'STUDENT' && (students.find(s => s.id === currentActorId)?.name || '학생 학학우')}
                      {currentRole === 'PROFESSOR' && (professors.find(p => p.id === currentActorId)?.name || '교수')}
                      {currentRole === 'COMPANY' && (companies.find(c => c.id === currentActorId)?.name || '회사인사팀')}
                      {currentRole === 'ADMIN' && '아카이브 관리자'}
                    </span>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setCurrentTab('HOME');
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="로그아웃"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentTab('LOGIN')}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => setShowSignUpDialog(true)}
                    className="px-3.5 py-2 text-xs font-bold bg-indigo-650 text-white hover:bg-indigo-600 rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation tab bar for small viewports */}
        <div className="md:hidden flex border-t border-slate-205 justify-around py-2 bg-slate-50 text-[10.5px] font-bold text-slate-500">
          <button onClick={() => setCurrentTab('HOME')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'HOME' ? 'text-indigo-600' : ''}`}>
            <span>🏠 홈</span>
          </button>
          <button onClick={() => setCurrentTab('JOBS')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'JOBS' ? 'text-indigo-600' : ''}`}>
            <span>💼 채용공고</span>
          </button>
          <button onClick={() => setCurrentTab('SCHOLARS')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'SCHOLARS' ? 'text-indigo-600' : ''}`}>
            <span>🎓 우수인재</span>
          </button>
          <button onClick={() => setCurrentTab('GUIDE')} className={`flex flex-col items-center gap-0.5 ${currentTab === 'GUIDE' ? 'text-indigo-600' : ''}`}>
            <span>💡 가이드</span>
          </button>
        </div>
      </nav>

      {/* Main Content Stage container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Live Supabase Synchronization Alert Bar */}
        {isSupabaseConfigured() && (
          <div className={`p-4 rounded-3xl border transition-all text-left ${
            sbSyncError || missingTables.length > 0
              ? 'bg-amber-50/70 border-amber-200 text-amber-900 shadow-xs'
              : 'bg-emerald-50/60 border-emerald-100 text-emerald-950 shadow-2xs'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  sbSyncError || missingTables.length > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    {sbSyncError || missingTables.length > 0 ? (
                      <>
                        <span className="inline-flex w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>[Mongdang] Supabase 테이블 생성 및 동기화 대기 중</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>[Mongdang] Supabase 실시간 클라우드 DB 연동 완료</span>
                      </>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {sbSyncError || missingTables.length > 0 ? (
                      `연결은 성공했으나 ${missingTables.length > 0 ? `[${missingTables.join(', ')}]` : '일부'} 테이블이 Supabase에 생성되지 않았습니다. 동기화를 위해 SQL 설치 코드를 실행해주세요.`
                    ) : (
                      '모든 회원 가입, 인턴 공고 승인, 추천서 서명, 채용 지원서 전송이 실제 Supabase 원장에 영구 보관되며 전 직원/학생 대시보드가 완벽하게 동기화됩니다.'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sbSyncError || missingTables.length > 0 ? (
                  <button
                    onClick={() => setShowSqlDialog(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>📜 SQL 설치 코드 복사</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl shrink-0">
                    Live ON (동기화 작동중)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SQL Installation Dialog Modal */}
        {showSqlDialog && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-scale-up">
              <button 
                onClick={() => setShowSqlDialog(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-sm cursor-pointer"
              >
                닫기 ✕
              </button>
              
              <div className="space-y-2 text-left mb-4">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-mono">가이드 &amp; 데이터베이스 초기화</span>
                <h3 className="text-lg font-black text-slate-900">Supabase SQL Editor 설치 가이드</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Supabase 대시보드의 <strong>SQL Editor</strong>에서 아래 쿼리를 입력하고 <strong>Run</strong> 버튼을 클릭하십시오. 원격 테이블 구조가 즉시 생성되며, 본 매칭 플랫폼과 연동되어 안전하게 데이터를 보존합니다.
                </p>
              </div>

              <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 overflow-y-auto flex-1 font-mono text-xs text-left relative max-h-[40vh] border border-slate-800 select-all">
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_DDL_SCRIPT);
                      alert('Supabase SQL 설치 스크립트가 클립보드에 복사되었습니다!');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    복사하기
                  </button>
                </div>
                <pre className="pr-16 text-slate-350">{SUPABASE_SQL_DDL_SCRIPT}</pre>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-150 flex items-center justify-between text-xs">
                <span className="text-slate-450 font-semibold text-slate-500">Mongdang 매칭 서비스 전용 통합 스키마</span>
                <button
                  onClick={() => setShowSqlDialog(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  준비 완료 (닫기)
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* -------------------- ROUTED PAGES CORE -------------------- */}

        {/* 1. INITIAL / LANDING PAGE */}
        {currentTab === 'HOME' && (
          <AcademicHome
            jobs={jobs}
            students={students}
            recommendations={recommendations}
            companies={companies}
            onSwitchToRole={(role, actorId) => {
              setCurrentRole(role);
              setCurrentActorId(actorId);
              setIsLoggedIn(true);
              setCurrentTab('DASHBOARD');
            }}
            onApplyQuick={(jobId) => {
              if (!isLoggedIn || currentRole !== 'STUDENT') {
                alert('공고 지원서 제출을 진행하시려면 학생 계정으로 로그인해 주십시오. 1초 간편 로그인 포탈로 안내합니다.');
                setCurrentTab('LOGIN');
                return;
              }
              handleApplyForJob(jobId);
              setCurrentTab('DASHBOARD');
            }}
            currentRole={isLoggedIn ? currentRole : 'STUDENT'}
            currentActorId={isLoggedIn ? currentActorId : ''}
          />
        )}

        {/* 2. DEDICATED LOGIN PAGE (With distinct student, company, admin targets) */}
        {currentTab === 'LOGIN' && (
          <AuthenticationPage
            students={students}
            professors={professors}
            companies={companies}
            onLoginSuccess={(role, actorId) => {
              setCurrentRole(role);
              setCurrentActorId(actorId);
              setIsLoggedIn(true);
              setCurrentTab('DASHBOARD');
            }}
            onOpenSignUp={() => setShowSignUpDialog(true)}
          />
        )}

        {/* 3. ISOLATED JOBS DIRECTORY TAB */}
        {currentTab === 'JOBS' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto py-4 space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">💼 대학 검증형 우수 인턴십 선발 공고</h1>
              <p className="text-xs text-slate-500 font-medium">검증 마크가 부착된 각 학술적 신뢰 기업군이 개진한 정규 인턴십 대장 리스트입니다.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Job List Panel (7/12) */}
              <div className="lg:col-span-7 space-y-4">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-xs transition duration-200 text-left space-y-3.5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-indigo-650">{job.companyName}</span>
                          <span className="inline-flex bg-indigo-50 text-indigo-700 text-[9.5px] font-black px-1.5 py-0.2 rounded-sm uppercase">정규인증</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1">{job.title}</h4>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full block text-right shrink-0">
                        {job.location}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 3).map((r, idx) => (
                        <span key={idx} className="bg-slate-105 text-slate-600 text-[9.5px] px-2 py-0.5 rounded-md font-semibold font-mono">
                          {r}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">인턴보상 {job.salary}</span>
                      <button
                        onClick={() => {
                          if (!isLoggedIn || currentRole !== 'STUDENT') {
                            alert('공고에 이력서를 직접 전송하려면 학생 계정으로 로그인이 필요합니다. 전산 인증 로그인 창으로 안내합니다.');
                            setCurrentTab('LOGIN');
                            return;
                          }
                          handleApplyForJob(job.id);
                          setCurrentTab('DASHBOARD');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1 uppercase cursor-pointer"
                      >
                        지원서 서명제출 <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure Info Widget Side Card (5/12) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-indigo-950 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-5 text-left">
                <div className="bg-indigo-500/20 w-fit p-2 rounded-xl text-indigo-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-indigo-400">학업 증명 보증 수칙</h4>
                  <h2 className="text-md sm:text-lg font-black tracking-tight leading-tight">추천서 인증 우회 및 무결성 구조</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    본 플랫폼에서는 학생의 지도교수가 서명한 <strong>학계 검증 추천서</strong> 또는 소속 학술기관의 <strong>교수 승인 토큰</strong>이 등재되어 <strong>'인증완료'</strong> 상태로 입증된 우수인재에 한하여 기업 공고 직접 지원서 전송이 작동합니다. 추천이 대기 중인 학생의 서류는 무단 유출되지 않게 원천 차단됩니다.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                  <span className="font-bold text-indigo-305 block">💡 성과 보증 전산화 흐름도</span>
                  <p className="text-[10.5px] text-slate-400 leading-normal">
                    1. <strong>가입/로그인</strong> 완료 후 마이 대시보드에서 담당 지도교수 추천을 요청하거나 오프라인 수령한 <strong>난수 토큰</strong>을 즉시 활성화하십시오.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ISOLATED SCHOLARS DIRECTORY TAB */}
        {currentTab === 'SCHOLARS' && (
          isLoggedIn && currentRole === 'STUDENT' ? (
            <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl text-center max-w-xl mx-auto space-y-4 my-12 shadow-3xs">
              <div className="w-16 h-16 bg-rose-50 text-rose-605 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 text-rose-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">🔒 학외 성과우수 위조열람 제한</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Mongdang 보안 수칙 및 개인정보보호법에 의거하여, 학생/인턴 회원은 타 아카데미 학우들의 학과 성과 보증 추천서 및 상세 이력 정보를 조회할 권한이 엄격히 통제(Read-Restricted)되어 있습니다.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('DASHBOARD')}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-sm transition duration-150 inline-flex items-center gap-2"
                >
                  나의 학생 전용 페이지로 이동 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto py-4 space-y-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">🎓 대학 추천 대표인재 (Scholars Registry)</h1>
                <p className="text-xs text-slate-500 font-medium">부정 지원을 근절하기 위해 소속 대학교수진의 실명 보증 디지털 날인이 완결 등재된 우수 학생 명단입니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map(s => {
                  const verifiedReco = recommendations.find(r => r.studentEmail === s.email && r.status === 'APPROVED');
                  return (
                    <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition relative flex flex-col justify-between space-y-4 text-left">
                      <div>
                        {/* ID Indicator */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-mono text-indigo-650 font-bold bg-indigo-50/40 px-2 py-0.5 rounded">ID: {s.id.toUpperCase()}</span>
                          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full ${
                            s.recommendationStatus === 'VERIFIED' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/60' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100/60'
                          }`}>
                            {s.recommendationStatus === 'VERIFIED' ? '● 성과보증완료' : '● 소견대기'}
                          </span>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>{s.name.substring(0,1)}*{(s.name.length > 2) ? s.name.substring(2) : '원'} 학우</span>
                            <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.2 rounded-md">({s.major})</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-bold">{s.university}</p>
                        </div>

                        {/* BIO snippet */}
                        <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 block max-h-24 overflow-y-auto leading-relaxed">
                          {s.resume.bio || "미구현 이력 사항"}
                        </p>

                        {/* Verified Instructor review */}
                        {verifiedReco ? (
                          <div className="mt-4 border-l-2 border-indigo-600 pl-2 text-[11px] text-slate-500 space-y-0.5">
                            <span className="font-extrabold text-slate-700 block">👨‍🏫 추천인 {verifiedReco.professorName} 소견:</span>
                            <p className="italic leading-normal text-slate-600 font-serif">"{verifiedReco.content}"</p>
                          </div>
                        ) : (
                          <div className="mt-4 text-[10.5px] text-slate-400/90 flex items-center gap-1 font-medium bg-amber-50/30 p-2 rounded-lg border border-amber-500/10">
                            <span>⚠️ 학술 검증 진행 (스승의 추천 소견 서명 기립 대기 중)</span>
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-100">
                          {s.resume.skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="text-[8.5px] font-extrabold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-mono">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Application trigger helper */}
                        <div className="pt-3 flex justify-between items-center text-[10px] text-slate-400 font-medium pb-1">
                          <span>등재일 {s.createdAt.substring(0, 10)}</span>
                          {s.recommendationStatus === 'VERIFIED' ? (
                            <span className="text-emerald-700 font-extrabold">인턴십 배치 대상 활성</span>
                          ) : (
                            <span className="text-amber-600 font-extrabold">검증 심사 중</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* 5. SCENARIO GUIDE WALKTHROUGH */}
        {currentTab === 'GUIDE' && (
          <GuidePage />
        )}

        {/* 6. LOGGED-IN DYNAMIC ROLE-BASED DASHBOARDS */}
        {currentTab === 'DASHBOARD' && isLoggedIn && (
          <div className="space-y-6 animate-fade-in" id="dashboard-routed-view">
            
            {/* Context Session Header details block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 border text-indigo-600 font-bold select-none text-md">
                  {currentRole === 'STUDENT' && '🎓'}
                  {currentRole === 'PROFESSOR' && '👨‍🏫'}
                  {currentRole === 'COMPANY' && '🏢'}
                  {currentRole === 'ADMIN' && '💻'}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">현재 가용 보안 인증 채널</span>
                  <h2 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
                    {currentRole === 'STUDENT' && `학생 마이페이지: ${activeStudent?.name || '로딩 중...'} [소속: ${activeStudent?.university}]`}
                    {currentRole === 'PROFESSOR' && `교수 업무실: ${activeProfessor?.name || '로딩 중...'} [학과: ${activeProfessor?.department}]`}
                    {currentRole === 'COMPANY' && `협력사 전용 페이지: ${activeCompany?.name || '로딩 중...'} [업종: ${activeCompany?.industry}]`}
                    {currentRole === 'ADMIN' && '아카이브 총괄 행정 관리소 (sysadmin)'}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">실시간 전산 상태 : </span>
                <span className="inline-flex items-center text-[10px] sm:text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-ping"></span> 세션 유지 중
                </span>
              </div>
            </div>

            {/* Core views switcher */}
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

      {/* 🔓 COLLAPSIBLE DEVELOPER QUICK-SWITCH PANEL (Located beautifully at the bottom, perfectly accessible) */}
      <div className="fixed bottom-4 right-4 z-40" id="dev-swapper-drawer">
        {isDevSwapperOpen ? (
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-xl border border-slate-700 w-[320px] sm:w-[480px] max-w-[calc(100vw-32px)] space-y-3 animate-fade-in relative text-left">
            <button 
              onClick={() => setIsDevSwapperOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white font-extrabold text-xs cursor-pointer"
            >
              닫기 ✕
            </button>
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 font-mono">체계 모의 주입기</span>
              <h4 className="text-xs font-bold text-slate-200">개발자 실시간 모의 등급 스위치</h4>
              <p className="text-[10px] text-slate-400 leading-normal font-sans">로그인 양식을 거치지 않고 완결 흐름(추천 서명 &rarr; 선발 승인 &rarr; 결제 원장 확인)을 빠른 속도로 검증하기 위해 세션을 강제 할당합니다.</p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <RoleSwitcher
                currentRole={currentRole}
                currentActorId={currentActorId}
                students={students}
                professors={professors}
                companies={companies}
                onActorChange={handleActorChange}
                onResetData={resetToDefaults}
                onOpenSignUpTrigger={() => { setShowSignUpDialog(true); setIsDevSwapperOpen(false); }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsDevSwapperOpen(true)}
            className="bg-indigo-650 hover:bg-indigo-600 font-extrabold text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 select-none transition-all cursor-pointer hover:scale-105 border border-indigo-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>🔑 모의 스위칭 바</span>
          </button>
        )}
      </div>

      {/* Footer credit section conforming to humble literals */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5 font-medium">
          {currentTab === 'HOME' ? (
            <>
              <p className="font-extrabold text-slate-800">Mongdang Platform</p>
              <p className="text-[10.5px] text-indigo-600 font-semibold font-mono">Developed & Operated by TEEDLAB | All Rights Reserved</p>
              <p className="text-[10px] text-slate-405">지도교수 추천 인재 매칭 및 보안 기업 심사 검증 관리 시스템 © 2026 TEEDLAB</p>
            </>
          ) : (
            <>
              <p className="font-extrabold text-slate-800">Mongdang Platform</p>
              <p className="text-[10px] text-slate-405">지도교수 추천 인재 매칭 및 보안 기업 심사 검증 관리 시스템 © 2026 Mongdang</p>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
