/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  MapPin, 
  Globe, 
  Briefcase, 
  FileCheck, 
  Plus, 
  UserCheck, 
  AlertCircle, 
  Award, 
  FileText, 
  ArrowRight, 
  CheckCircle,
  XCircle,
  User,
  ExternalLink,
  ShieldAlert,
  Send,
  Sparkles
} from 'lucide-react';
import { Company, Job, JobApplication, Student, Recommendation } from '../types';

interface CompanyDashboardProps {
  company: Company;
  allJobs: Job[];
  allApplications: JobApplication[];
  allStudents: Student[];
  onAddJob: (title: string, description: string, requirements: string[], preferences: string[], location: string, salary: string) => void;
  onUpdateApplicationStatus: (appId: string, status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED', feedback?: string) => void;
  onBypassCompanyVerify: () => void;
}

export default function CompanyDashboard({
  company,
  allJobs,
  allApplications,
  allStudents,
  onAddJob,
  onUpdateApplicationStatus,
  onBypassCompanyVerify
}: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  
  // Job Post states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newReq, setNewReq] = useState('');
  const [newPref, setNewPref] = useState('');
  const [newLocation, setNewLocation] = useState('서울특별시 강남구 테헤란로');
  const [newSalary, setNewSalary] = useState('월 250만 원 (조정 가능)');

  // Selected applicant details review state
  const [reviewingApplication, setReviewingApplication] = useState<JobApplication | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const companyJobs = allJobs.filter(j => j.companyId === company.id);
  const companyApplications = allApplications.filter(app => app.companyId === company.id);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    onAddJob(
      newTitle,
      newDesc,
      newReq.split('\n').map(r => r.trim()).filter(r => r.length > 0),
      newPref.split('\n').map(p => p.trim()).filter(p => p.length > 0),
      newLocation,
      newSalary
    );

    setNewTitle('');
    setNewDesc('');
    setNewReq('');
    setNewPref('');
    setShowAddForm(false);
  };

  const handleStatusChange = (status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED') => {
    if (!reviewingApplication) return;
    onUpdateApplicationStatus(reviewingApplication.id, status, feedbackText.trim() || undefined);
    
    // update current inspecting application state locally
    setReviewingApplication({
      ...reviewingApplication,
      status,
      feedback: feedbackText.trim() || undefined
    });
    setFeedbackText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Company Profile sidebar column */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold select-none">
              {company.logoUrl || '🏢'}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{company.name}</h2>
            <p className="text-xs text-slate-500 mt-1">{company.industry}</p>
            
            <div className="flex justify-center mt-3">
              {company.verificationStatus === 'VERIFIED' ? (
                <span className="inline-flex items-center text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 승인된 인증 파트너사
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full gap-1 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" /> 기관 승인 심사대기
                </span>
              )}
            </div>

            <div className="w-full border-t border-slate-100 my-5"></div>

            <div className="w-full space-y-3 text-xs text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span>사업자등록번호</span>
                <span className="font-mono text-slate-800 font-semibold">{company.businessId}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>웹사이트</span>
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-medium text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  바로가기 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>등록된 공고</span>
                <span className="text-slate-800 font-bold">{companyJobs.length}건</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>접수된 추천인재</span>
                <span className="text-slate-800 font-bold">{companyApplications.length}명</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <button
              onClick={() => {
                setReviewingApplication(null);
                setActiveTab('jobs');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'jobs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" /> 내 인턴 채용공고 관리
            </button>

            <button
              onClick={() => {
                setReviewingApplication(null);
                setActiveTab('applicants');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between gap-1 ${
                activeTab === 'applicants' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> 지원한 추천 학생 심사
              </span>
              {companyApplications.filter(app => app.status === 'PENDING').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-[9px] text-white font-bold flex items-center justify-center">
                  {companyApplications.filter(app => app.status === 'PENDING').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Company main workspace view */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {/* CRITICAL SECURITY & COMPLIANCE GUARD : IF PENDING STATE */}
          {company.verificationStatus === 'PENDING' ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-rose-100 rounded-2xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6"
            >
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                ⚠️
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">기관 신원 및 기업 승인 대기 단계</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
                  학술 인턴 매칭 서비스는 정부 및 학교 연계 인증된 정식 기관만 가입 및 활동이 보증되는 환경입니다. 귀사가 제출한 사업자등록번호(<strong className="font-mono text-slate-800">{company.businessId}</strong>) 및 제출 서류를 관리자가 정밀 대조 검토하고 있습니다.
                </p>
              </div>

              {/* Status breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-w-md mx-auto text-xs text-left text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> 기본 기업 정보 등록 (완료)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> 사업자등록증.pdf 증빙서류 업로드 (완료)
                </div>
                <div className="flex items-center gap-2 text-amber-600 font-semibold">
                  <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[10px] text-amber-800 font-bold">●</span>
                  정부 국세청 가동 사업자 상태 및 가명 대조 심사 중
                </div>
              </div>

              {/* Demonstration Fast pass helper */}
              <div className="border-t border-slate-100 pt-6 max-w-md mx-auto space-y-3">
                <p className="text-[11px] text-slate-400">
                  데모 버전을 테스트 중이시라면 상단 파란색 바에서 <strong>"💻 플랫폼 총괄 관리자 데모"</strong> 역할로 전환하여 이 기업을 즉시 최종 승인해 주시거나, 아래 간편 우회 버튼으로 승인 처리를 하실 수 있습니다.
                </p>
                <button
                  onClick={onBypassCompanyVerify}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  파트너 기업 가입 즉시 승인처리 (데모 프리패스)
                </button>
              </div>
            </motion.div>
          ) : reviewsTab()}
        </AnimatePresence>
      </div>
    </div>
  );

  function reviewsTab() {
    return (
      <div className="space-y-6">
        {/* TAB 1: MY COMPANY JOBS AND NEW POST CREATION FORM */}
        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">내 인턴십 채용 공고 관리</h3>
                <p className="text-xs text-slate-500 mt-1">
                  학교 측 검증과 인정을 획득한 학생 인턴 후보자들에게 상시 노출 중인 당사의 공식 채용 매핑 정보입니다.
                </p>
              </div>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> 신규 공고 기안하기
                </button>
              )}
            </div>

            {/* Posting Form container */}
            {showAddForm && (
              <motion.form
                onSubmit={handlePostJob}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-md text-slate-800">신규모집 인턴 공고 작성</h4>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-650"
                  >
                    게시 취소
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">채용공고 직무 타이틀</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 클라우드 연동 풀스택 주니어 인턴 구직"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">근무지 및 근무형태</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 서울특별시 강남구 역삼역 인근 (하이브리드 병행)"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">직무 내용 및 주요 미션 상세</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="인턴이 투입되어 수행할 프로덕트 고도화 과제와 연구 개발 부조 내용을 상세히 기여하세요."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">필수 자격 역량 요건 (엔터로 줄 구분)</label>
                    <textarea
                      rows={3}
                      placeholder="- React 및 상태관리 숙련자&#10;- Git / Github 실무 워크플로우 경험"
                      value={newReq}
                      onChange={(e) => setNewReq(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">우대 및 교수추천 자격 요건 (엔터로 줄 구분)</label>
                    <textarea
                      rows={3}
                      placeholder="- 지도교수가 성실성 및 팀워크를 추천서로 보장한 학생&#10;- 협업 인성 최적 장학생 우대"
                      value={newPref}
                      onChange={(e) => setNewPref(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="w-1/2 pr-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">보상 및 급여</label>
                    <input
                      type="text"
                      required
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl self-end mt-4 shadow-2xs"
                  >
                    공고 최종 기안 및 학생에게 즉시 유포
                  </button>
                </div>
              </motion.form>
            )}

            {/* List of active jobs posted by company */}
            <div className="space-y-4">
              {companyJobs.length === 0 ? (
                <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">등록된 인턴십 공고가 존재하지 않습니다.</p>
                </div>
              ) : (
                companyJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border">
                          모집중
                        </span>
                        <span className="text-xs text-slate-405 font-mono">기안 ID: {job.id}</span>
                      </div>
                      <h4 className="text-md font-bold text-slate-800">{job.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">급여: {job.salary} • 권역: {job.location}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center bg-slate-50 px-4 py-2.5 border border-slate-100 rounded-xl">
                        <span className="text-[11px] text-slate-400 block font-medium">누적 제출 지원서</span>
                        <span className="text-lg font-bold text-indigo-600">
                          {allApplications.filter(app => app.jobId === job.id).length}명
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('applicants');
                        }}
                        className="border border-slate-200 hover:border-slate-300 text-slate-600 text-xs px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1"
                      >
                        지원 제자 심사하기 <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: REVIEWING SPECIAL APPLICANTS WITH SEALED RECOMMENDATION STAMP! */}
        {activeTab === 'applicants' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {reviewingApplication ? (
              /* APPLICANT DETAIL BOARD PANEL WITH THE PROFESSOR RECOMMENDATION DETAILS */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <button 
                      onClick={() => setReviewingApplication(null)}
                      className="text-xs text-slate-400 hover:text-indigo-600 font-semibold mb-2 block"
                    >
                      ← 지원 리스트로 컴백
                    </button>
                    <h3 className="text-lg font-bold text-slate-900">{reviewingApplication.studentName} 학생 지원 검수</h3>
                    <p className="text-xs text-slate-500 mt-1">공고: {reviewingApplication.jobTitle}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">ID: {reviewingApplication.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Student Resume details */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">포트폴리오 자율 이력서</h4>
                      <h3 className="text-sm font-semibold text-slate-800">{reviewingApplication.studentUniversity} {reviewingApplication.studentMajor}</h3>
                      <p className="text-xs bg-slate-50 p-4 border rounded-xl leading-relaxed font-serif italic text-slate-700">
                        "{reviewingApplication.resume.bio}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">보유 자격과 실무 기량</span>
                      <div className="flex flex-wrap gap-1">
                        {reviewingApplication.resume.skills.map((skill, idx) => (
                          <span key={idx} className="bg-indigo-50 border border-slate-200 text-indigo-700 px-2.5 py-0.5 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {reviewingApplication.resume.projects && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">주요 학술 산출물</span>
                        <div className="bg-slate-50 p-4 border rounded-xl text-xs text-slate-700 whitespace-pre-line font-mono leading-relaxed">
                          {reviewingApplication.resume.projects}
                        </div>
                      </div>
                    )}

                    {reviewingApplication.resume.experience && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">교내외 활동</span>
                        <div className="bg-slate-50 p-4 border rounded-xl text-xs text-slate-700 whitespace-pre-line font-mono leading-relaxed">
                          {reviewingApplication.resume.experience}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: PROFESSOR'S DIRECT SEALED RECOMMENDATION CARD */}
                  <div className="md:col-span-1 space-y-4">
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-2xs">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-xs font-bold text-emerald-900 uppercase">인증 승인처 교수 소견서</h4>
                      </div>

                      {reviewingApplication.recommendation ? (
                        <div className="space-y-3">
                          <div className="text-xs">
                            <span className="text-slate-400 block font-semibold">검증 서약교수</span>
                            <strong className="text-slate-800 text-sm block mt-0.5">
                              {reviewingApplication.recommendation.professorName}
                            </strong>
                            <span className="text-[10px] text-slate-500 font-mono italic block">
                              ({reviewingApplication.recommendation.professorEmail})
                            </span>
                            <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                              {reviewingApplication.recommendation.relationship}
                            </span>
                          </div>

                          <div className="border-t border-emerald-100 my-2"></div>

                          <span className="text-slate-400 text-[10.5px] block font-semibold mb-1">동봉 추천 서약 본문</span>
                          <p className="text-[11.5px] text-slate-700 leading-relaxed font-serif italic bg-white p-3.5 border border-emerald-100 rounded-xl shadow-3xs">
                            "{reviewingApplication.recommendation.content}"
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {reviewingApplication.recommendation.tags.map((tag, i) => (
                              <span key={i} className="text-[9px] font-semibold bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          교수 추천 정보가 소실되었습니다.
                        </div>
                      )}
                    </div>

                    {/* Change Application Status control board */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700">전형 상태 결정</h4>
                      
                      <div className="text-xs font-semibold">
                        현재 상태: {' '}
                        {reviewingApplication.status === 'PENDING' && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">서면 대기</span>}
                        {reviewingApplication.status === 'REVIEWING' && <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">상세 심사 중</span>}
                        {reviewingApplication.status === 'ACCEPTED' && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">최종인턴 선발완료</span>}
                        {reviewingApplication.status === 'REJECTED' && <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">제외 보류</span>}
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="학생에게 전달할 검수 코멘트나 면접 일정 등을 작성하세요."
                          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => handleStatusChange('REVIEWING')}
                          className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 py-2 rounded-xl font-bold transition-all cursor-pointer"
                        >
                          상세리뷰 개시
                        </button>
                        <button
                          onClick={() => handleStatusChange('ACCEPTED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-bold transition-all cursor-pointer"
                        >
                          오퍼 선발 승인
                        </button>
                        <button
                          onClick={() => handleStatusChange('REJECTED')}
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 py-2 rounded-xl font-bold col-span-2 transition-all cursor-pointer"
                        >
                          아쉽지만 다음 전형으로 보류 처리
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* LIST OF SUBMITTED STUDENTS APPLICATIONS TO THIS COMPANY */
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">제자 지원서 및 심사 목록</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    교수의 신원 서명으로 검증 장벽을 완수통과한 매직 인턴십 학생들의 이력입니다.
                  </p>
                </div>

                {companyApplications.length === 0 ? (
                  <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600">아직 당사 공고에 접수된 입사 지원서가 존재하지 않습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyApplications.map((app) => (
                      <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-300 transition-all">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">{app.jobTitle}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {app.id}</span>
                            
                            {/* RECOMMENDATION EMBLEM BADGE */}
                            {app.recommendation && (
                              <span className="inline-flex items-center text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full gap-0.5">
                                <Award className="w-3 h-3 text-emerald-600" /> 교수추천 봉인 필인
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <h4 className="text-md font-bold text-slate-800">{app.studentName}</h4>
                            <span className="text-xs text-slate-500">[{app.studentUniversity} • {app.studentMajor}]</span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1 italic max-w-xl">
                            자기소개: "{app.resume.bio}"
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {app.resume.skills.map((s, idx) => (
                              <span key={idx} className="bg-slate-100 text-[10.5px] text-slate-500 px-2 py-0.5 rounded font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                          <div className="text-right">
                            {app.status === 'PENDING' && (
                              <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full font-bold">
                                서면 심사 대기
                              </span>
                            )}
                            {app.status === 'REVIEWING' && (
                              <span className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-2.5 py-1 rounded-full font-bold animate-pulse">
                                상세 이력 검토 중
                              </span>
                            )}
                            {app.status === 'ACCEPTED' && (
                              <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                                채용 도장 완료
                              </span>
                            )}
                            {app.status === 'REJECTED' && (
                              <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-12.5 py-1 rounded-full font-bold">
                                오퍼 대기제외
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setReviewingApplication(app);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 transition-colors"
                          >
                            추천서 열람 및 심사 <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }
}
