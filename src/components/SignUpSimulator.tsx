/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  School, 
  Building, 
  Check, 
  X, 
  AlertCircle, 
  FileText, 
  Key, 
  Send, 
  ShieldAlert,
  HelpCircle,
  FileBadge
} from 'lucide-react';
import { Student, Professor, Company, Resume } from '../types';

interface SignUpSimulatorProps {
  onClose: () => void;
  onRegisterStudent: (name: string, email: string, university: string, major: string, bio: string, skills: string[], profName: string, profEmail: string) => void;
  onRegisterProfessor: (name: string, email: string, university: string, department: string) => void;
  onRegisterCompany: (name: string, email: string, businessId: string, website: string, description: string, industry: string, address: string, fileName: string) => void;
  professors: Professor[];
}

export default function SignUpSimulator({
  onClose,
  onRegisterStudent,
  onRegisterProfessor,
  onRegisterCompany,
  professors
}: SignUpSimulatorProps) {
  const [activeForm, setActiveForm] = useState<'student' | 'professor' | 'company'>('student');

  // Student Form states
  const [studName, setStudName] = useState('');
  const [studEmail, setStudEmail] = useState('');
  const [studUni, setStudUni] = useState('한국대학교');
  const [studMajor, setStudMajor] = useState('컴퓨터공학과');
  const [studBio, setStudBio] = useState('');
  const [studSkills, setStudSkills] = useState('');
  const [targetProfEmail, setTargetProfEmail] = useState(professors[0]?.email || 'tjkim@university.edu');

  // Professor Form states
  const [profName, setProfName] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profUni, setProfUni] = useState('한국대학교');
  const [profDept, setProfDept] = useState('컴퓨터공학과');

  // Company Form states
  const [compName, setCompName] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compBusinessId, setCompBusinessId] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compIndustry, setCompIndustry] = useState('SW 개발 및 IT 서비스');
  const [compAddress, setCompAddress] = useState('');
  const [compFileName, setCompFileName] = useState('사업자등록증_사본_제출본.pdf');

  // Common notification
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName || !studEmail || !studBio) return;
    
    onRegisterStudent(
      studName,
      studEmail,
      studUni,
      studMajor,
      studBio,
      studSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      professors.find(p => p.email === targetProfEmail)?.name || '김태진 교수',
      targetProfEmail
    );

    triggerSuccessAndClose();
  };

  const handleProfessorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profEmail) return;

    onRegisterProfessor(profName, profEmail, profUni, profDept);
    triggerSuccessAndClose();
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName || !compEmail || !compBusinessId || !compAddress) return;

    onRegisterCompany(
      compName,
      compEmail,
      compBusinessId,
      compWebsite || `https://${compName.replace(/\s+/g, '').toLowerCase()}.co.kr`,
      compDesc || '인재를 선점하고자 하는 혁신 중소 우수 벤처 기술 중심 기관입니다.',
      compIndustry,
      compAddress,
      compFileName
    );

    triggerSuccessAndClose();
  };

  const triggerSuccessAndClose = () => {
    setShowSuccessMsg(true);
    setTimeout(() => {
      setShowSuccessMsg(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col my-8"
      >
        {/* Header bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-md text-slate-100">신규 회원 가입 시뮬레이터</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSuccessMsg ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 mb-2">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">회원 등록 완료!</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              지정하신 역할 및 정보가 데이터베이스에 안전하게 기소되었습니다. <br />
              역할 전환 버튼 또는 수동 승인을 통해 매핑 상태를 직접 확인해보세요.
            </p>
          </div>
        ) : (
          <>
            {/* Sector switcher */}
            <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setActiveForm('student')}
                className={`py-3.5 text-center font-bold border-b-2 transition-all ${
                  activeForm === 'student'
                    ? 'border-indigo-650 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                🎓 학생 가입
              </button>
              <button
                type="button"
                onClick={() => setActiveForm('professor')}
                className={`py-3.5 text-center font-bold border-b-2 transition-all ${
                  activeForm === 'professor'
                    ? 'border-indigo-650 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                👨‍🏫 교수 등록
              </button>
              <button
                type="button"
                onClick={() => setActiveForm('company')}
                className={`py-3.5 text-center font-bold border-b-2 transition-all ${
                  activeForm === 'company'
                    ? 'border-indigo-650 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                🏢 기업 가입
              </button>
            </div>

            {/* Scrollable form view content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* STUDENT SIGNUP FORM */}
              {activeForm === 'student' && (
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      <strong>학술 보증 가입 제한 사항:</strong> <br />
                      가입 완료 즉시에는 검증 대기 상태(가입 보류) 상태가 되어 이력서가 기업에 표시되지 않으며 인턴십 게시판 열람이 불가합니다. 지정하신 교수님이 승인해 주셔야 합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">성명</label>
                      <input
                        type="text"
                        required
                        placeholder="이름"
                        value={studName}
                        onChange={(e) => setStudName(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">이메일</label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={studEmail}
                        onChange={(e) => setStudEmail(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">대학교</label>
                      <input
                        type="text"
                        required
                        value={studUni}
                        onChange={(e) => setStudUni(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">전공 학과</label>
                      <input
                        type="text"
                        required
                        value={studMajor}
                        onChange={(e) => setStudMajor(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">전공 지도 / 주임 교수 이메일 지정</label>
                    <select
                      value={targetProfEmail}
                      onChange={(e) => setTargetProfEmail(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs"
                    >
                      {professors.map(p => (
                        <option key={p.id} value={p.email}>
                          {p.name} ({p.department} - {p.email})
                        </option>
                      ))}
                      <option value="temp-prof@university.edu">익명 신규 교수 (temp-prof@university.edu)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">한줄 신조 및 기량 요약</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="학부 역량 및 자아 소개"
                      value={studBio}
                      onChange={(e) => setStudBio(e.target.value)}
                      className="w-full border rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">보유 기술 목록 (쉼표 구분)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Figma..."
                      value={studSkills}
                      onChange={(e) => setStudSkills(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2.5 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-colors mt-6 shadow-2xs"
                  >
                    제자 인턴후보 가입하기 (추천 대기)
                  </button>
                </form>
              )}

              {/* PROFESSOR REGISTRATION FORM */}
              {activeForm === 'professor' && (
                <form onSubmit={handleProfessorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">교수 성함</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 홍길동 교수"
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">대학 소속 이메일</label>
                    <input
                      type="email"
                      required
                      placeholder="username@university.edu"
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2.5 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">소속 대학교</label>
                      <input
                        type="text"
                        required
                        value={profUni}
                        onChange={(e) => setProfUni(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">학과 부처</label>
                      <input
                        type="text"
                        required
                        value={profDept}
                        onChange={(e) => setProfDept(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-colors mt-6 shadow-2xs"
                  >
                    학부 매칭 위원 교수 상시 등록
                  </button>
                </form>
              )}

              {/* COMPANY SIGNUP FORM */}
              {activeForm === 'company' && (
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-rose-900 leading-relaxed">
                      <strong>기관 서약 및 인증 대기 사항:</strong> <br />
                      매칭 건전성을 수임하기 위해 가입 즉시에는 '관리자 승인 대기' 상태가 됩니다. 승인 전에는 모집 인턴쉽 공고가 학생들에게 노출 불가능합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">법인/기관 정식 명칭</label>
                      <input
                        type="text"
                        required
                        placeholder="예: (주)카카오소프트"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">대표 문의 이메일</label>
                      <input
                        type="email"
                        required
                        placeholder="recruit@corp.com"
                        value={compEmail}
                        onChange={(e) => setCompEmail(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">사업자 등록번호 (10자리)</label>
                      <input
                        type="text"
                        required
                        placeholder="예: 110-82-44331"
                        value={compBusinessId}
                        onChange={(e) => setCompBusinessId(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">보유 업종 대분류</label>
                      <input
                        type="text"
                        required
                        value={compIndustry}
                        onChange={(e) => setCompIndustry(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">공식 웹사이트 주소</label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={compWebsite}
                        onChange={(e) => setCompWebsite(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">인증 첨부용 파일 모형 등록</label>
                      <input
                        type="text"
                        required
                        value={compFileName}
                        onChange={(e) => setCompFileName(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs bg-slate-50 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">본사 등록 주소</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 서울특별시 서초구 반포대로 15"
                      value={compAddress}
                      onChange={(e) => setCompAddress(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">설립 기업 핵심 비즈니스 요약</label>
                    <textarea
                      rows={2}
                      placeholder="자사 비전이나 기술 도메인을 작성하세요."
                      value={compDesc}
                      onChange={(e) => setCompDesc(e.target.value)}
                      className="w-full border rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-colors mt-6 shadow-2xs"
                  >
                    기관 기업 가입 요청 제출 (승인 대기)
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
