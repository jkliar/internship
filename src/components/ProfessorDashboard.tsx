/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  School, 
  Award, 
  FileText, 
  Check, 
  Plus, 
  Send, 
  Clock, 
  Trash2, 
  PlusCircle, 
  Copy, 
  ChevronRight, 
  MessageSquareCode,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { Professor, Student, Recommendation, RecommendationCode } from '../types';

interface ProfessorDashboardProps {
  professor: Professor;
  allStudents: Student[];
  allRecommendations: Recommendation[];
  recommendationCodes: RecommendationCode[];
  onApproveRecommendation: (studentId: string, content: string, tags: string[], relationship: string, courseName?: string) => void;
  onGenerateCode: (issuedForEmail?: string, relationship?: string) => void;
  onDeleteCode: (code: string) => void;
}

export default function ProfessorDashboard({
  professor,
  allStudents,
  allRecommendations,
  recommendationCodes,
  onApproveRecommendation,
  onGenerateCode,
  onDeleteCode
}: ProfessorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'codes' | 'history'>('requests');
  
  // Custom suggestion list for tags
  const TAG_PRESETS = [
    '성실성 우수', 
    '코딩 역량 탁월', 
    '학업 태도 모범', 
    '문제 해결 자율성', 
    '수학적 논리', 
    '열성 가득함', 
    '팀 협업 인성', 
    '프로덕트 감각'
  ];

  // Recommendations Builder states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [recoContent, setRecoContent] = useState('');
  const [recoRelationship, setRecoRelationship] = useState('지도교수');
  const [recoCourseName, setRecoCourseName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['성실성 우수', '코딩 역량 탁월']);

  // Recommendation code creation state
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [targetStudentEmail, setTargetStudentEmail] = useState('');
  const [codeRelationship, setCodeRelationship] = useState('지도교수');
  
  // Pending students requesting this professor
  const requestedStudents = allStudents.filter(
    s => s.recommendationStatus === 'PENDING' && 
    (s.requestedProfessorEmail?.toLowerCase() === professor.email.toLowerCase() || 
     s.requestedProfessorName === professor.name)
  );

  // Professor's history of submitted recommendations
  const submittedRecommendations = allRecommendations.filter(
    r => r.professorId === professor.id && r.status === 'APPROVED'
  );

  // Professor's issued codes
  const issuedCodes = recommendationCodes.filter(
    c => c.professorId === professor.id
  );

  const handleOpenWriteReco = (student: Student) => {
    setSelectedStudent(student);
    setRecoContent(
      `위 ${student.name} 학생은 전공 과목 수강 태도가 우수하며 학회/프로젝트 설계 경험이 준수하여, 본 매칭 기구에 성실한 실습을 이행할 추천 대상자로 깊은 보증을 보냅니다.`
    );
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePublishRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    onApproveRecommendation(
      selectedStudent.id,
      recoContent,
      selectedTags,
      recoRelationship,
      recoRelationship === '교과목 수업 교수' ? recoCourseName : undefined
    );

    setSelectedStudent(null);
    setSelectedTags(['성실성 우수', '코딩 역량 탁월']);
    setRecoCourseName('');
    setActiveTab('history');
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateCode(
      targetStudentEmail.trim() || undefined,
      codeRelationship
    );
    setTargetStudentEmail('');
    setShowCodeGenerator(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`인증번호 [ ${code} ] 가 클립보드에 복사되었습니다! 학생전용 코드 가입 창에 전달할 수 있습니다.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Professor Left Deck Info */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mx-auto select-none font-bold text-3xl">
              👨‍🏫
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-4">{professor.name}</h2>
            <p className="text-xs text-indigo-600 font-semibold mt-1">{professor.university}</p>
            <p className="text-xs text-slate-500 mt-0.5">{professor.department}</p>
            
            <div className="w-full border-t border-slate-100 my-5"></div>

            <div className="w-full space-y-3 text-xs text-left">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">대기 요청</span>
                <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  {requestedStudents.length}건
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">발급 완료 추천서</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  {submittedRecommendations.length}건
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">유효 바인딩 코드</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                  {issuedCodes.filter(c => !c.isUsed).length}개
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <button
              onClick={() => {
                setSelectedStudent(null);
                setActiveTab('requests');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                activeTab === 'requests' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> 추천서 실시간 요청서
              </span>
              {requestedStudents.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setActiveTab('codes');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'codes' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageSquareCode className="w-4 h-4" /> 오프라인 코드 관리
            </button>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setActiveTab('history');
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4" /> 서한 발송 완료 이력
            </button>
          </div>
        </div>
      </div>

      {/* Professor Right Workspace */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {selectedStudent ? (
            /* WRITING RECOMMENDATION FORM PANEL */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">학술 검증 승인서 서한 작성</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    학생의 신분과 신뢰성을 최종 보장하여 사이트 제약 해제를 위임합니다.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  요청 목록으로 돌아가기
                </button>
              </div>

              {/* Student Overview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] bg-slate-200 font-bold text-slate-700 px-2 py-0.5 rounded-md">피추천 대상자</span>
                  <h4 className="text-md font-bold text-slate-800 mt-1">{selectedStudent.name}</h4>
                  <div className="text-xs text-slate-500 space-x-2 mt-0.5">
                    <span>전공: {selectedStudent.major}</span>
                    <span>•</span>
                    <span>학력: {selectedStudent.resume.education}</span>
                  </div>
                </div>
                <div className="text-xs font-mono bg-white p-3 border border-slate-200 rounded-lg max-w-sm text-slate-600 leading-relaxed italic">
                  "{selectedStudent.resume.bio}"
                </div>
              </div>

              <form onSubmit={handlePublishRecommendation} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">추천인 관계 여부</label>
                    <select
                      value={recoRelationship}
                      onChange={(e) => setRecoRelationship(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    >
                      <option value="지도교수">지도교수 (Advisor)</option>
                      <option value="교과목 수업 교수">교과목 전공 수업 교수 (Course Teacher)</option>
                    </select>
                  </div>

                  {recoRelationship === '교과목 수업 교수' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">교과목 강의 명칭</label>
                      <input
                        type="text"
                        required
                        placeholder="예: 자료구조및알고리즘, 웹 프레임워크 설계"
                        value={recoCourseName}
                        onChange={(e) => setRecoCourseName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                      />
                    </motion.div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-600">추천 소견 서한 (최대 1000자)</label>
                    <span className="text-[10px] text-slate-400">학회 및 성향 포함 보장 항목</span>
                  </div>
                  <textarea
                    rows={6}
                    value={recoContent}
                    onChange={(e) => setRecoContent(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-xs leading-relaxed font-serif text-slate-800"
                    placeholder="해당 학생의 지식과 협력 의도, 성격적 모범성을 상세 기술해 주세요."
                    required
                  />
                </div>

                {/* Recommendations Preset Badges Grid */}
                <div>
                  <span className="block text-xs font-bold text-slate-600 mb-2">학생 핵심 역량 특성화 기재 (종합 평가)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_PRESETS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`text-xs px-3 py-1 rounded-full border transition-all ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs px-4.5 py-2.5 rounded-xl font-bold"
                  >
                    작성 취소
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> 추천서 승인 및 발행
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* STANDARD MAIN TABS LIST PANEL */
            <div className="space-y-6">
              {/* TAB 1: PENDING STUDENTS REQUESTS list */}
              {activeTab === 'requests' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">추천 대기 학생 목록</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        회원가입 중 교수님을 지도인으로 지정하고 추천을 기다리는 제자들 목록입니다.
                      </p>
                    </div>
                  </div>

                  {requestedStudents.length === 0 ? (
                    <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
                      <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-600">추천서 발행을 요청한 신규 학생이 없습니다.</p>
                      <p className="text-xs text-slate-400 mt-1">학생이 가입할 때 이메일({professor.email})을 지정하면 이곳에 표시됩니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requestedStudents.map((stud) => (
                        <div key={stud.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                              가입 보류 상태
                            </span>
                            <div className="flex items-center gap-2">
                              <h4 className="text-md font-bold text-slate-800">{stud.name}</h4>
                              <span className="text-xs text-slate-400">({stud.email})</span>
                            </div>
                            <div className="text-xs text-slate-500 space-x-1.5 flex flex-wrap items-center">
                              <span>학력: <strong>{stud.resume.education}</strong></span>
                              <span>•</span>
                              <span>기량: <strong>{stud.resume.skills.slice(0,4).join(', ')}</strong></span>
                            </div>
                            <p className="text-xs text-slate-600 leading-normal line-clamp-1 italic max-w-xl">
                              자기소개: "{stud.resume.bio}"
                            </p>
                          </div>

                          <button
                            onClick={() => handleOpenWriteReco(stud)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                          >
                            학술 추천서 심사/작성 <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: EXTEMPORANEOUS VERIFICATION CODES (OFFLINE CODES) */}
              {activeTab === 'codes' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">오프라인 추천 인증 번호 발급</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        학생의 대면 요청을 받았을 때, 특정 이메일 전용 영수코드를 사전 발급하여 메신저 전송용으로 활용할 수 있습니다.
                      </p>
                    </div>
                    {!showCodeGenerator && (
                      <button
                        onClick={() => setShowCodeGenerator(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> 코드 새로 발행하기
                      </button>
                    )}
                  </div>

                  {/* Code Generator overlay container */}
                  {showCodeGenerator && (
                    <motion.form 
                      onSubmit={handleCreateCode}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                          <Code2 className="w-4 h-4" /> 사전 검증코드 발행 매크로
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => setShowCodeGenerator(false)} 
                          className="text-xs text-indigo-900/55 hover:text-indigo-900"
                        >
                          뒤로
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-indigo-950 font-bold mb-1">지정 수신 대상 학생 이메일</label>
                          <input
                            type="email"
                            required
                            placeholder="예: jypark@naver.com"
                            value={targetStudentEmail}
                            onChange={(e) => setTargetStudentEmail(e.target.value)}
                            className="bg-white border border-indigo-200 text-xs rounded-xl px-3 py-2.5 w-full font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-indigo-950 font-bold mb-1">인증 관계</label>
                          <select
                            value={codeRelationship}
                            onChange={(e) => setCodeRelationship(e.target.value)}
                            className="bg-white border border-indigo-200 text-xs rounded-xl px-3 py-2.5 w-full font-medium"
                          >
                            <option value="지도교수">지도교수 학술보장</option>
                            <option value="교과목 수업 교수">수강 전공 수업 이수</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl block ml-auto shadow-2xs"
                      >
                        암호키 및 서약코드 생성 발행
                      </button>
                    </motion.form>
                  )}

                  {/* Code items table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <h4 className="text-xs font-bold text-slate-700 tracking-wider">발생 기록이 인증된 시리얼 대장</h4>
                    </div>

                    {issuedCodes.length === 0 ? (
                      <div className="p-12 text-center text-xs text-slate-400 font-medium">
                        발행한 일회용 추천 확인 번호가 아직 없습니다.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 text-xs">
                        {issuedCodes.map((codeObj) => (
                          <div key={codeObj.code} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-sm tracking-wider">
                                  {codeObj.code}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(codeObj.code)}
                                  className="text-slate-400 hover:text-indigo-600 p-1"
                                  title="코드 복사"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                배정 메일: <strong className="text-slate-700">{codeObj.issuedForEmail || '일반 공개 배포형'}</strong> ({codeObj.relationship})
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {codeObj.isUsed ? (
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                  사용 완료 ({codeObj.usedByEmail})
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-pulse">
                                  미사용 (사용 대입 가능)
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm('해당 발급 코드를 완벽 폐기하시겠습니까?')) {
                                    onDeleteCode(codeObj.code);
                                  }
                                }}
                                className="text-slate-350 hover:text-rose-600 p-1 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: SUBMITTED RECOMMENDATIONS HISTORIC GRAPH */}
              {activeTab === 'history' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">추천서 발송 이력</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        교수님 성함으로 정식 전인적 매칭 보장을 부여한 성과 이력서 아카이브입니다.
                      </p>
                    </div>
                  </div>

                  {submittedRecommendations.length === 0 ? (
                    <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-600">완료 승인한 추천 이력이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submittedRecommendations.map((reco) => (
                        <div key={reco.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded border border-slate-200 mr-2">
                                {reco.relationship}
                              </span>
                              {reco.courseName && (
                                <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded italic">
                                  수업: {reco.courseName}
                                </span>
                              )}
                              <h4 className="text-sm font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                                {reco.studentName} 학생 대상 추천서 발송 완료
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">배정 이메일: {reco.studentEmail} | 추천서 등록일자: {new Date(reco.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">reco-id: {reco.id}</span>
                          </div>

                          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-xs text-slate-700 leading-relaxed font-serif italic mb-3">
                            "{reco.content}"
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {reco.tags.map((tag, i) => (
                              <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
