/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  User, 
  School, 
  Building, 
  Fingerprint, 
  Sparkles, 
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  Plus
} from 'lucide-react';
import { UserRole, Student, Professor, Company } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  currentActorId: string;
  students: Student[];
  professors: Professor[];
  companies: Company[];
  onActorChange: (role: UserRole, actorId: string) => void;
  onResetData: () => void;
  onOpenSignUpTrigger: () => void;
}

export default function RoleSwitcher({
  currentRole,
  currentActorId,
  students,
  professors,
  companies,
  onActorChange,
  onResetData,
  onOpenSignUpTrigger
}: RoleSwitcherProps) {
  return (
    <div className="bg-slate-900 text-slate-100 py-3.5 px-6 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo and Pitch */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white font-bold tracking-tight text-sm select-none shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Academia Matcher
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-200">학술 검증 인턴십 매칭 플랫폼</h1>
            <p className="text-[10px] text-slate-400">교수 추천 및 기업 인증 허가 연계 시뮬레이터</p>
          </div>
        </div>

        {/* Actor Picker selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mr-1">데모 보기</span>

          {/* Group: Student actors */}
          <div className="relative group">
            <select
              value={currentRole === 'STUDENT' ? currentActorId : ''}
              onChange={(e) => {
                if (e.target.value) {
                  onActorChange('STUDENT', e.target.value);
                }
              }}
              className={`text-xs px-3 py-2 rounded-xl border font-bold ${
                currentRole === 'STUDENT' 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <option value="" disabled={currentRole === 'STUDENT'}>🎓 제자: 학생 역할</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.recommendationStatus === 'VERIFIED' ? '인증됨' : '대기'})
                </option>
              ))}
            </select>
          </div>

          {/* Group: Professor actors */}
          <div>
            <select
              value={currentRole === 'PROFESSOR' ? currentActorId : ''}
              onChange={(e) => {
                if (e.target.value) {
                  onActorChange('PROFESSOR', e.target.value);
                }
              }}
              className={`text-xs px-3 py-2 rounded-xl border font-bold ${
                currentRole === 'PROFESSOR' 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <option value="" disabled={currentRole === 'PROFESSOR'}>👨‍🏫 스승: 교수 역할</option>
              {professors.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.department})
                </option>
              ))}
            </select>
          </div>

          {/* Group: Company actors */}
          <div>
            <select
              value={currentRole === 'COMPANY' ? currentActorId : ''}
              onChange={(e) => {
                if (e.target.value) {
                  onActorChange('COMPANY', e.target.value);
                }
              }}
              className={`text-xs px-3 py-2 rounded-xl border font-bold ${
                currentRole === 'COMPANY' 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <option value="" disabled={currentRole === 'COMPANY'}>🏢 기관: 사기업 역할</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.verificationStatus === 'VERIFIED' ? '인증' : '미허가'})
                </option>
              ))}
            </select>
          </div>

          {/* Admin Role button wrapper */}
          <button
            onClick={() => onActorChange('ADMIN', 'admin')}
            className={`text-xs px-3.5 py-2 rounded-xl border font-bold flex items-center gap-1 transition-all ${
              currentRole === 'ADMIN' 
                ? 'bg-indigo-600 text-white border-indigo-500' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-amber-600/10 hover:text-amber-400 hover:border-amber-500/50'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" /> 총괄 관리자 (Admin)
          </button>
        </div>

        {/* Global actions: Sign Up Simulator / Reset Demo */}
        <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <button
            onClick={onOpenSignUpTrigger}
            className="text-[11px] bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" /> 신규 가입 시뮬레이션
          </button>
          
          <button
            onClick={() => {
              if (confirm('모든 데이터 가공 내역(localStorage 변경분)을 소멸하고 초기 상태로 파기 복구합니까?')) {
                onResetData();
              }
            }}
            className="text-[11px] bg-slate-900 text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 border border-slate-800 font-bold p-2 rounded-xl transition-colors"
            title="데이터 흐름 완전 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
