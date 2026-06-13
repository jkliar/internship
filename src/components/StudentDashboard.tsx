/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  School, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Briefcase, 
  Building, 
  Plus, 
  Search, 
  Send, 
  Key, 
  Sparkles, 
  Check, 
  Download, 
  ArrowUpRight,
  ShieldCheck,
  FileCheck,
  Award
} from 'lucide-react';
import { Student, Job, JobApplication, Recommendation, RecommendationCode, Resume } from '../types';

interface StudentDashboardProps {
  student: Student;
  allJobs: Job[];
  allApplications: JobApplication[];
  recommendationCodes: RecommendationCode[];
  allRecommendations: Recommendation[];
  onApplyForJob: (jobId: string) => void;
  onUpdateResume: (updatedResume: Resume) => void;
  onVerifyWithCode: (code: string) => boolean;
  onUploadMockRecommendation: (profName: string, profEmail: string, fileContent: string, tags: string[], relationship: string) => void;
  onRequestRecommendation: (profName: string, profEmail: string) => void;
}

export default function StudentDashboard({
  student,
  allJobs,
  allApplications,
  recommendationCodes,
  allRecommendations,
  onApplyForJob,
  onUpdateResume,
  onVerifyWithCode,
  onUploadMockRecommendation,
  onRequestRecommendation
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'jobs' | 'resume' | 'applications'>('status');
  
  // Resume Edit states
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [bio, setBio] = useState(student.resume.bio);
  const [skills, setSkills] = useState(student.resume.skills.join(', '));
  const [education, setEducation] = useState(student.resume.education);
  const [experience, setExperience] = useState(student.resume.experience || '');
  const [projects, setProjects] = useState(student.resume.projects || '');

  // Recommendation inputs
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);

  // Manual request inputs
  const [profName, setProfName] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  // Mock Recommendation Upload / AI Verify states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const appliedJobsIds = new Set(allApplications.filter(app => app.studentId === student.id).map(app => app.jobId));
  const studentApplications = allApplications.filter(app => app.studentId === student.id);
  const matchedRecommendation = allRecommendations.find(r => r.studentEmail === student.email && r.status === 'APPROVED');

  const handleSaveResume = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateResume({
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      education,
      experience: experience || undefined,
      projects: projects || undefined,
      fileName: student.resume.fileName,
      fileSize: student.resume.fileSize
    });
    setIsEditingResume(false);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setCodeSuccess(false);
    
    if (!verificationCode.trim()) {
      setCodeError('인증 코드를 입력해주세요.');
      return;
    }

    const success = onVerifyWithCode(verificationCode.trim());
    if (success) {
      setCodeSuccess(true);
      setVerificationCode('');
      setTimeout(() => {
        setActiveTab('jobs');
      }, 1500);
    } else {
      setCodeError('유효하지 않거나 이미 사용된 인증 코드입니다. (예: PROF-KIM-7789)');
    }
  };

  const handleManualRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profEmail) return;
    onRequestRecommendation(profName, profEmail);
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setProfName('');
      setProfEmail('');
    }, 3000);
  };

  const handleAiScanSimulate = () => {
    setIsScanning(true);
    setScanStep(1); // Reading layout
    
    setTimeout(() => {
      setScanStep(2); // Extracting signatures & seal
    }, 1500);

    setTimeout(() => {
      setScanStep(3); // Analyzing with Gemini
    }, 3000);

    setTimeout(() => {
      // Create a simulated approved recommendation
      onUploadMockRecommendation(
        '이성재 교수',
        'sjlee@university.edu',
        '위 학생 성실성과 창창한 연구 보조 능력을 보증하며, 학업 태도가 수작인 바 적극적으로 본 기업 인턴쉽 대상자로 천거하는 서한입니다.',
        ['수학적 논리', '성실한 수강태도', '협동성 우수', 'SW 학술역량'],
        '교과목 수업 교수'
      );
      setIsScanning(false);
      setScanStep(0);
      setActiveTab('jobs');
    }, 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Student Profile Overview Card */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4 select-none text-3xl font-bold">
              {student.name[0]}
            </div>
            <h2 id="student-name-header" className="text-xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{student.university}</p>
            <p className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full mt-2 font-medium">
              {student.major}
            </p>

            <div className="w-full border-t border-slate-100 my-5"></div>

            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">가입상태</span>
                {student.recommendationStatus === 'VERIFIED' ? (
                  <span className="flex items-center text-emerald-600 font-semibold gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> 인증 가입완료
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600 font-semibold gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 animate-pulse">
                    <Clock className="w-3.5 h-3.5" /> 추천 검증 대기
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">포트폴리오 이력서</span>
                <span className="text-slate-700 font-medium">{student.resume.skills.length}개 기술 등록</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">지원 내역</span>
                <span className="text-slate-700 font-bold">{studentApplications.length}건</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <button
              onClick={() => setActiveTab('status')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'status'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-4 h-4" /> 가입 & 추천 검증
            </button>
            
            <button
              onClick={() => {
                if (student.recommendationStatus !== 'VERIFIED') {
                  alert('교수 추천서 서한 승인이 완료되어야 기업 공고를 열람하고 매칭에 참여하실 수 있습니다.');
                  return;
                }
                setActiveTab('jobs');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between gap-1 ${
                student.recommendationStatus !== 'VERIFIED' ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'jobs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> 추천 기업 공고 목록
              </span>
              {student.recommendationStatus !== 'VERIFIED' && <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'resume'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" /> 내 이력서 수정
            </button>

            <button
              onClick={() => {
                if (student.recommendationStatus !== 'VERIFIED') {
                  alert('교수 추천서 서한 승인이 완료된 후 이용 가능합니다.');
                  return;
                }
                setActiveTab('applications');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                student.recommendationStatus !== 'VERIFIED' ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'applications'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" /> 입사 지원 현황
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {/* TAB 1: Core Approval and Verification Requirement Status */}
          {activeTab === 'status' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${student.recommendationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {student.recommendationStatus === 'VERIFIED' ? (
                      <ShieldCheck className="w-8 h-8" />
                    ) : (
                      <Clock className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {student.recommendationStatus === 'VERIFIED' 
                        ? '가입 학술 검증 승인 완료' 
                        : '지도/수업 교수 추천장 제출 검증 단계'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      학생 신뢰성과 전문성 보증을 위해 지도 교수 또는 전공 수강 교수의 승인된 매칭 추천서가 필요합니다. 추천 정보가 접수되면 제한이 즉시 해제됩니다.
                    </p>
                  </div>
                </div>

                {/* Flow Visual Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">기본 이력서 작성</h4>
                      <p className="text-[10px] text-slate-500">완료됨•스킬 설정</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                  </div>

                  <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                    student.recommendationStatus === 'VERIFIED' 
                      ? 'bg-slate-50 border-slate-100' 
                      : 'bg-amber-50/50 border-amber-200'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                      student.recommendationStatus === 'VERIFIED' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-amber-600 text-white'
                    }`}>
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">교수 추천 및 서약</h4>
                      <p className="text-[10px] text-slate-500">
                        {student.recommendationStatus === 'VERIFIED' 
                          ? '추천서 등록 완료' 
                          : student.requestedProfessorName ? '교수 응답 대기 중' : '미접수'}
                      </p>
                    </div>
                    {student.recommendationStatus === 'VERIFIED' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 ml-auto animate-pulse" />
                    )}
                  </div>

                  <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                    student.recommendationStatus === 'VERIFIED'
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50 border-slate-100 opacity-60'
                  }`}>
                    <div className="w-7 h-7 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 font-semibold text-slate-800">전매칭 개방</h4>
                      <p className="text-[10px] text-slate-500">기업 공고 상시 지원</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified State - show the actual recommendation details */}
              {student.recommendationStatus === 'VERIFIED' && matchedRecommendation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center text-xs text-emerald-800 font-semibold bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full gap-1">
                      <Award className="w-3.5 h-3.5" /> 검증된 교수 추천서 봉인됨
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {matchedRecommendation.id}</span>
                  </div>
                  <h4 className="text-md font-bold text-slate-800">
                    {matchedRecommendation.professorName} ({matchedRecommendation.professorEmail})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    관계: {matchedRecommendation.relationship} {matchedRecommendation.courseName ? `[${matchedRecommendation.courseName}]` : ''}
                  </p>

                  <div className="bg-white border border-slate-100 p-4 rounded-xl mt-3 font-serif text-sm text-slate-700 leading-relaxed shadow-xs italic">
                    "{matchedRecommendation.content}"
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {matchedRecommendation.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-medium bg-emerald-100/70 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 text-center">
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl font-semibold shadow-xs hover:shadow-sm"
                    >
                      승인된 인턴십 공고 구경하기 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Pending States - provide options to clear the recommendation limit */}
              {student.recommendationStatus !== 'VERIFIED' && (
                <div className="space-y-6">
                  {/* Status Indicator Bar */}
                  {student.requestedProfessorName && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-900 leading-relaxed">
                        <span className="font-semibold text-amber-950">{student.requestedProfessorName} 교수</span>({student.requestedProfessorEmail})님에게 추천서 요청을 전송하였습니다. <br />
                        교수님이 직접 매칭 시스템 대표 웹사이트에 접속하여 학술 추천서를 작성하시고 승인하면 가입 승인이 자동으로 완결되며 기업 인턴 공고에 이력서가 실시간 노출됩니다.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Method 1: Pre-issue Verification Code */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <Key className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-md text-slate-800">교수 추천 코드 입력</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          지도 교수님이 오프라인 또는 직접 발급해 주신 12자리의 알파벳 추천 확인 번호를 입력하면 실시간으로 학생 검증 통과 및 매칭 자격이 취득됩니다.
                        </p>
                      </div>

                      <form onSubmit={handleVerifyCodeSubmit} className="space-y-3">
                        <div>
                          <input
                            type="text"
                            placeholder="예: PROF-KIM-7789"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono tracking-wider text-center"
                          />
                        </div>
                        {codeError && (
                          <p className="text-[11px] text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {codeError}
                          </p>
                        )}
                        {codeSuccess && (
                          <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                            <Check className="w-3 h-3" /> 추천 인증이 승인되었습니다! 공고 탭으로 이동합니다.
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs py-2.5 rounded-xl font-semibold transition-colors"
                        >
                          코드 인증하기
                        </button>
                      </form>
                    </div>

                    {/* Method 2: Request Recommendation to professor */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <Send className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-md text-slate-800">교수님께 추천 신규 요청</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          소속 교수님의 성함과 이메일 주소를 기입하면, 교수님께 추천서 등록 초청과 학생 프로필 요약 이력을 발송하여 원클릭 승인 초안을 유도합니다.
                        </p>
                      </div>

                      <form onSubmit={handleManualRequest} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="교수 성함"
                            value={profName}
                            onChange={(e) => setProfName(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                          <input
                            type="email"
                            required
                            placeholder="교수 이메일"
                            value={profEmail}
                            onChange={(e) => setProfEmail(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                        {requestSent && (
                          <p className="text-[11px] text-indigo-600 flex items-center gap-1 font-medium bg-indigo-50 px-2.5 py-1 rounded-lg">
                            <Check className="w-3.5 h-3.5" /> 교수님께 추천 알림 서한을 방송하였습니다.
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 rounded-xl font-semibold transition-colors"
                        >
                          추천 요청하기
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Method 3: Upload signed PDF with AI Document Verification System */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Gemini AI 기술 탑재
                          </div>
                          <h4 className="font-bold text-md text-slate-800">서한 파일 업로드 및 AI 실시간 검증</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          오프라인에서 미리 받은 서명이 가미된 교수 추천서 이미지/PDF 파일을 등록하세요. Gemini 모형이 파일의 직인과 서약 단락을 자율 판독한 뒤, 성명 일치 여부를 대조해 가입을 신속 승인해 드립니다.
                        </p>
                      </div>

                      <div className="self-center">
                        <button
                          disabled={isScanning}
                          onClick={handleAiScanSimulate}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="w-4 h-4" /> AI 추천서 자동 스캔하기
                        </button>
                      </div>
                    </div>

                    {/* Progress Loader for AI scan simulation */}
                    {isScanning && (
                      <div className="mt-5 p-5 bg-white border border-slate-100 rounded-xl space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-indigo-600 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" /> Gemini OCR & 진위분석기 기동 중...
                          </span>
                          <span className="text-slate-400 font-mono">{scanStep * 25 + 25}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full transition-all duration-700" 
                            style={{ width: `${scanStep * 33 + 1}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {scanStep === 1 && '✓ 추천서 원본 문서 전방 레이아웃 자율 검출 중...'}
                          {scanStep === 2 && '✓ 소속 대학 직인 및 추천 서명 검출 완료. 무결성 확인 가능.'}
                          {scanStep === 3 && '✓ 추천 텍스트 정밀 의미 분석 및 요점 태그 추출 단계 (성실성 우수, 수학적 논리)'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: Jobs Listing Area (Only available if verified) */}
          {activeTab === 'jobs' && student.recommendationStatus === 'VERIFIED' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">학부 연계 매칭 추천 채용</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    교수 추천서 검증을 획득한 인턴 대상 한정 전속 공개된 기업들의 스마트 매칭 채용 정보입니다.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center gap-1 text-[11px] text-indigo-800 font-semibold shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> 추천서 검증 우대 기업만 정렬됨
                </div>
              </div>

              {allJobs.length === 0 ? (
                <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">현재 등록된 유효 채용 공고가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {allJobs.map((job) => {
                    const isAlreadyApplied = appliedJobsIds.has(job.id);
                    return (
                      <div 
                        key={job.id} 
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-indigo-400 transition-all grid grid-cols-1 md:grid-cols-4 gap-6"
                      >
                        <div className="md:col-span-3 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl" role="img" aria-label="company logo">
                              {job.companyLogo || '🏢'}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-500">{job.companyName}</h4>
                              <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer flex items-center gap-1">
                                {job.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {job.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                            <div>
                              <span className="text-slate-400 block mb-1 font-semibold">필수 자격 항목</span>
                              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                                {job.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1 font-semibold">추천 및 우대 항목</span>
                              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                                {job.preferences.map((pref, index) => (
                                  <li key={index}>{pref}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                            <span>근무 권역: <strong className="text-slate-800">{job.location}</strong></span>
                            <span>급여 수준: <strong className="text-slate-800">{job.salary}</strong></span>
                            <span>등록일자: <strong className="text-slate-600">{new Date(job.createdAt).toLocaleDateString()}</strong></span>
                          </div>
                        </div>

                        <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center items-center gap-3 text-center">
                          <span className="text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full block">
                            교추 합격보증 대상 공고
                          </span>
                          
                          {isAlreadyApplied ? (
                            <button
                              disabled
                              className="w-full bg-slate-100 text-slate-400 text-xs py-3 rounded-xl font-bold border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-500" /> 지원 완료됨
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`"${job.title}" 인턴십 공고에 학술 추천서를 양도하며 기재된 이력서로 입사 지원을 확정하시겠습니까?`)) {
                                  onApplyForJob(job.id);
                                }
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-3 rounded-xl font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                            >
                              간편 입사지원하기
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Resume Review and Customization */}
          {activeTab === 'resume' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">포트폴리오 학술 이력서 작성</h3>
                  <p className="text-xs text-slate-500 mt-1">기업 인사팀은 추천 교수의 성명 및 봉인된 추천 소견과 함께 이 이력서를 보게 됩니다.</p>
                </div>
                {!isEditingResume && (
                  <button
                    onClick={() => setIsEditingResume(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    이력서 편집하기
                  </button>
                )}
              </div>

              {isEditingResume ? (
                <form onSubmit={handleSaveResume} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">이름</label>
                      <input
                        type="text"
                        disabled
                        value={student.name}
                        className="w-full bg-slate-50 text-slate-400 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">학교 정보 및 소속</label>
                      <input
                        type="text"
                        disabled
                        value={`${student.university} ${student.major}`}
                        className="w-full bg-slate-50 text-slate-400 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">한 줄 소개 및 자기소개 요약</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">핵심 기량 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                      placeholder="예: React, Python, UI Design..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">교육 및 학점 세부 기재</label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">실무 및 교내외 활동 (선택)</label>
                      <textarea
                        rows={4}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                        placeholder="동아리, 학회 활동, 프리랜서 등"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">주요 학술 프로젝트 성과 (선택)</label>
                      <textarea
                        rows={4}
                        value={projects}
                        onChange={(e) => setProjects(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                        placeholder="수행한 개인 웹/AI 개발이나 수상 내역"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingResume(false)}
                      className="border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs px-4.5 py-2 rounded-xl font-semibold"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2 rounded-xl font-semibold"
                    >
                      저장하기
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Bio block */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">자기소개 요약</h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-serif bg-slate-50 p-4 rounded-xl italic">
                      "{student.resume.bio}"
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">보유 기술 스택</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {student.resume.skills.map((skill, i) => (
                        <span key={i} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education details */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">학력 정보</h4>
                    <p className="text-sm text-slate-800 font-semibold">{student.resume.education}</p>
                  </div>

                  {/* Experiences and Projects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">주요 학부 프로젝트</h4>
                      {student.resume.projects ? (
                        <div className="bg-slate-50/50 p-4 rounded-xl text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed">
                          {student.resume.projects}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">등록된 프로젝트가 없습니다.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-semibold text-slate-400">교내 활동 이력</h4>
                      {student.resume.experience ? (
                        <div className="bg-slate-50/50 p-4 rounded-xl text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed">
                          {student.resume.experience}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">등록된 활동 이력이 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Student Applications Tracking */}
          {activeTab === 'applications' && student.recommendationStatus === 'VERIFIED' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">내 인턴십 지원 현황</h3>
                <p className="text-xs text-slate-500 mt-1">기업 인사팀의 검토 진행률을 안전하게 모니터링할 수 있습니다.</p>
              </div>

              {studentApplications.length === 0 ? (
                <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">아직 입사 지원 이력이 존재하지 않습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentApplications.map((app) => (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{app.companyName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {app.id}</span>
                        </div>
                        <h4 className="text-md font-bold text-slate-800">{app.jobTitle}</h4>
                        <p className="text-xs text-slate-400">지원 시간: {new Date(app.appliedAt).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block mb-0.5 font-medium">검토 상태</span>
                          {app.status === 'PENDING' && (
                            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                              인사팀 서면 대기
                            </span>
                          )}
                          {app.status === 'REVIEWING' && (
                            <span className="inline-block text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full animate-pulse">
                              추천장 상세 리뷰 중
                            </span>
                          )}
                          {app.status === 'ACCEPTED' && (
                            <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                              정식 합격 통보 채용 완료
                            </span>
                          )}
                          {app.status === 'REJECTED' && (
                            <span className="inline-block text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                              면접 대기 제외
                            </span>
                          )}
                        </div>

                        {app.feedback && (
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl max-w-xs text-xs text-slate-600">
                            <strong>기업 피드백:</strong> {app.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
