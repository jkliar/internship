/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  User, 
  Award, 
  Briefcase, 
  Clock, 
  Check, 
  X, 
  FileText, 
  Fingerprint, 
  ShieldCheck, 
  CheckCircle, 
  XCircle,
  Database,
  Users,
  Search,
  ExternalLink
} from 'lucide-react';
import { Company, Student, Professor, Recommendation, JobApplication } from '../types';

interface AdminDashboardProps {
  companies: Company[];
  students: Student[];
  professors: Professor[];
  recommendations: Recommendation[];
  applications: JobApplication[];
  onVerifyCompany: (companyId: string, status: 'VERIFIED' | 'REJECTED') => void;
}

export default function AdminDashboard({
  companies,
  students,
  professors,
  recommendations,
  applications,
  onVerifyCompany
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'companies' | 'ledger'>('companies');

  const pendingCompanies = companies.filter(c => c.verificationStatus === 'PENDING');
  const verifiedCompanies = companies.filter(c => c.verificationStatus === 'VERIFIED');
  const verifiedStudents = students.filter(s => s.recommendationStatus === 'VERIFIED');
  
  // Confirmed matches
  const successfulMatches = applications.filter(app => app.status === 'ACCEPTED');

  return (
    <div className="space-y-6">
      {/* Platform Statistical Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">학부 장학생</span>
            <span className="text-xl font-bold text-slate-800">
              {verifiedStudents.length} / {students.length}명 <span className="text-xs text-slate-400 font-normal">인증</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">정회원 검증 교수</span>
            <span className="text-xl font-bold text-slate-800">
              {professors.length}명 <span className="text-xs text-slate-400 font-normal">위촉</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">인증 기업회원</span>
            <span className="text-xl font-bold text-slate-800">
              {verifiedCompanies.length} / {companies.length}개 <span className="text-xs text-slate-400 font-normal">승인</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-indigo-100 rounded-xl text-blue-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">채용 및 상호매칭</span>
            <span className="text-xl font-bold text-slate-800">
              {successfulMatches.length}건 <span className="text-xs text-slate-400 font-normal">성공</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setAdminTab('companies')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold transition-all flex items-center gap-1.5 ${
            adminTab === 'companies' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Fingerprint className="w-4 h-4" /> 가입 신청 파트너 기업 승인 심사 ({pendingCompanies.length})
        </button>
        <button
          onClick={() => setAdminTab('ledger')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold transition-all flex items-center gap-1.5 ${
            adminTab === 'ledger' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" /> 플랫폼 전체 연계 매칭 현황판 ({successfulMatches.length})
        </button>
      </div>

      {/* ADMIN SUBVIEWS */}
      {adminTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">가입 심사 보류 법인 목록</h3>
              <p className="text-xs text-slate-500 mt-1">
                회원가입 서류 검증 법령 심사를 요청한 기업 신청 리스트입니다.
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 border px-3 py-1.5 rounded-lg font-medium">
              국세청 휴폐업 검증 및 사업자등록증.pdf 면밀 비교대조
            </span>
          </div>

          {pendingCompanies.length === 0 ? (
            <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
              <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">가입 승인을 대기 중인 기업이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">모든 기업의 신원 및 인증 프로세스가 완벽하게 조치되었습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCompanies.map((c) => (
                <div 
                  key={c.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-md">{c.name}</h4>
                        <p className="text-xs text-slate-405 font-medium">{c.industry} | {c.address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">사업자 등록번호 (Business ID)</span>
                        <strong className="text-slate-800 font-mono tracking-wider">{c.businessId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">첨부 증빙 서류 (Certificate Proof)</span>
                        <a 
                          href="#download" 
                          onClick={(e) => { e.preventDefault(); alert(`[다운로드 시뮬레이션] ${c.documentFileName} 파일 무결성 체크 완료.`); }}
                          className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> {c.documentFileName || '사업자등록증_사본.pdf'} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 max-w-xl">
                      <strong>회사 소개:</strong> {c.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => onVerifyCompany(c.id, 'REJECTED')}
                      className="border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" /> 서류 반려하기
                    </button>
                    <button
                      onClick={() => onVerifyCompany(c.id, 'VERIFIED')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> 가입 최종 승인
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">전매칭 이수 완료 대장 (Placements Ledger)</h3>
              <p className="text-xs text-slate-500 mt-1">
                지도 교수의 증명 날인과 사내 전형을 가공 통과하여 채용 계약이 완수 체결된 정규 인턴 목록입니다.
              </p>
            </div>
          </div>

          {successfulMatches.length === 0 ? (
            <div className="text-center bg-white border border-slate-200 p-12 rounded-2xl">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">체결된 정식 매칭 이력이 아직 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">학생이 지원한 후 기업 인사팀이 "오퍼 선발 승인"을 체결하면 대장에 기소됩니다.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="px-6 py-4">매칭 일자</th>
                    <th className="px-6 py-4">인턴 장학생</th>
                    <th className="px-6 py-4">소속 학과</th>
                    <th className="px-6 py-4">수임 교수 추천인</th>
                    <th className="px-6 py-4">계약 채용 사기업</th>
                    <th className="px-6 py-4 text-right">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {successfulMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-400 font-mono">
                        {new Date(match.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{match.studentName}</td>
                      <td className="px-6 py-4">{match.studentMajor}</td>
                      <td className="px-6 py-4 font-medium text-indigo-700">
                        {match.recommendation ? `${match.recommendation.professorName} (${match.recommendation.relationship})` : '코드 인증'}
                      </td>
                      <td className="px-6 py-4 font-bold">{match.companyName}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2.5 py-1 rounded-full inline-block text-[10px]">
                          채용체결 완료
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
