import React from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Award,
  BookOpen, 
  UserCheck, 
  Compass, 
  HelpCircle,
  FileCheck,
  Building2,
  Lock
} from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="space-y-10 py-4 text-left max-w-5xl mx-auto animate-fade-in" id="sejong-guide-container">
      
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-br from-red-950 via-rose-905 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-red-900/30 relative overflow-hidden shadow-xl shadow-red-950/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-650/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-rose-300 px-3/5 py-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>세종대학교 학과 매칭 전산망 공식 가이드</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            세종대 인재 매칭 허브 <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-200">
              학술 무결성을 기반으로 한 엘리트 인턴십 선제 매칭
            </span>
          </h1>
          <p className="text-sm text-slate-350 leading-relaxed max-w-2xl">
            본 시스템은 무분별한 단순 입제 지원과 허위 기업의 정보 편취를 방지하기 위해 설계되었습니다. 
            <strong>지도교수의 공식 디지털 날인 추천</strong> 및 <strong>국세청 기반 기업 신원 자격 실증</strong>이 일치하여 상호 신뢰를 담보하는 대한민국 세종대학교 전공인재 전용 장학 인턴십 매칭 생태계입니다.
          </p>
        </div>
      </div>

      {/* Sejong Target Audience Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-red-200 transition duration-250">
          <div className="bg-red-50 dark:bg-red-950/25 text-red-700 dark:text-red-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-red-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 mb-2">1. 세종대 재학생 필수 단계</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            학생은 회원가입 또는 대시보드 로그인 후, 담당 지도 교수에게 <strong>전산 추천서 제출</strong>을 요청하거나 발급된 <strong>난수 인증 코드 Token</strong>을 등록하여 계정을 활성화해야 비로소 정규 채용공고 지원이 물리적으로 완결 가능합니다.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-red-200 transition duration-250">
          <div className="bg-indigo-50 text-indigo-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 mb-2">2. 학계 공신 교수 업무망</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            교수진은 제자의 추천 요청 리스트를 분석하여, 수락 비평서를 가명 학생 명부에 맞추어 안전 디지털 서명합니다. 신뢰성이 부합된 소견서는 암호화 처리 후 기업 인사팀에 다이렉트 교차 대조 증빙 서류로 제출됩니다.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-red-200 transition duration-250">
          <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 mb-2">3. 인증 파트너 기업 요건</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            가입하려는 협력 기관은 반드시 국세청 유효 자격을 실증하는 정규 사업자등록번호를 기재하고, 공공 조달 요건에 상응하는 첨부 서류를 등재해야 합니다. 총괄 본사 어드민의 대면 전산 행정 심사 통과 후에 공고 작성이 인가됩니다.
          </p>
        </div>

      </div>

      {/* Core Operational Process */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-700" />
            핵심 학술 매칭 프로세스 5단계
          </h3>
          <p className="text-xs text-slate-500 mt-1">세종대학교 학생과 우수 검증 협력사가 완 무결 지원체계 하에 계약 매칭에 도달하는 일련의 과정입니다.</p>
        </div>

        <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-4 before:w-0.5 before:bg-slate-100">
          
          <div className="flex gap-4 relative">
            <div className="w-8.5 h-8.5 rounded-full bg-slate-900 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
              01
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">익명 기술 명부 등재 및 신뢰 확보</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                매칭 광장 상의 세종대 학생 정보는 가명처리(예: 강*수 학우)되어 노출되므로, 학부생 개인 정보 보호법에 완벽히 준거합니다. 기업은 오직 역량 대장 스펙과 검증 자격만을 기준으로 1차 탐색합니다.
              </p>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="w-8.5 h-8.5 rounded-full bg-red-700 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
              02
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">소속 전공 교수 추천 소견서 날인</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                컴퓨터공학과 김태진 교수 등 정규 하인즈먼 소속 지도교수가 보안 서명 시스템 또는 교수 전용 승인 토큰 코드를 발행하여 학생 계정에 매핑합니다. 추천이 보증되는 순간 학생 계정은 비로소 인턴 투입 지원이 활성화됩니다.
              </p>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="w-8.5 h-8.5 rounded-full bg-slate-950 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
              03
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">학업 증명서 원전 지원 기술 전송</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                자격 검증이 활성화된 학생은 파트너 기업 리스트 중 (주)네오소프트의 React 프론트엔드 연계 인턴 공고 등에 온라인 지원을 단행합니다. 지원 시 지도교수의 성 성률 지수와 추천서 전문이 자동으로 패키징되어 암호망을 통과합니다.
              </p>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="w-8.5 h-8.5 rounded-full bg-red-700 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
              04
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">기업 인사본부 채용 오퍼 승인</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                선발 전형 탭에서 기업 심사관은 해당 세종대 학우의 성과 이력사항과 교수의 디테일 추천서 소견서를 면밀히 상호대조하고 최종 선발 승인(Offer Approval) 버튼을 직접 인가합니다.
              </p>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="w-8.5 h-8.5 rounded-full bg-emerald-700 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
              05
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">계약 무결성 서명 원장 등재</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                최종 합격 처리된 매칭 계약 정보는 대학의 총괄 본사 인턴십 관리자 검인 원장(Admin Ledger)에 이관되어 최종 영구 등재 및 정식 장학금 지급의 원장 근거 자료로 보존 보관됩니다.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Sejong Frequently Asked Questions FAQ */}
      <div className="space-y-4">
        <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-2 px-1">
          <HelpCircle className="w-5 h-5 text-red-700" />
          자주 묻는 전산 질문 (FAQ)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
            <span className="font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded">Q. 추천 토큰(난수승인)코드는 어디서 발급하나요?</span>
            <p className="text-slate-600 leading-relaxed">
              교수진이 마이페이지에서 직접 난수 코드를 발송하거나, 교학처에서 오프라인 수령한 정품 난수 인증 카드에 인쇄되어 있습니다. 학생은 대시보드 추천 탭에 이 코드를 기재하면 교수 개입을 직접 기다리지 않아도 즉시 대학 인증완료 상태로 강제 전환됩니다. (데모 테스트용 토큰 예: <strong>PROF-KIM-7789</strong>)
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
            <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Q. 세종대학교 학생들 외 타대학 학생도 가입 가능한가요?</span>
            <p className="text-slate-600 leading-relaxed">
              본 시스템은 세종대학교 컴퓨터공학과 및 인공지능학과 등 이공계 전공 성과 활성화를 위한 선제 인턴십 지원 모델 브릿지망입니다. 가입 시 세종대 소속 학적 인허 확인 절차가 수반되며, 타 대학 소속의 경우 일반 시뮬레이션 게스트 등급만 부여됩니다.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Q. 기업 가입 절차가 생각보다 왜 엄격한가요?</span>
            <p className="text-slate-600 leading-relaxed">
              본 매칭스퀘어는 유령 벤처기업이나 소모성 아르바이트 형태의 정보 편취 채용공고를 완벽히 필터링하고 양질의 개발 인턴십만을 엄선하는 전산 무결 구조를 유지합니다. 따라서 국세청 실제 등록 정보가 확인되지 않으면 시스템 활용 승인을 절대 조율하지 않습니다.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
            <span className="font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Q. 추천서 기소 및 지원 검수 결과는 실시간 통보되나요?</span>
            <p className="text-slate-600 leading-relaxed">
              네, 그렇습니다. 학생이 이력서 지원을 하거나 교수가 승인 서명을 완수할 경우, 마이 대시보드 및 기업 전형 관리 패널에 실시간으로 상태 변경 점이 점멸 및 타임스탬프 기록되며, 최종 원장에 실질 보관 연동 작동합니다.
            </p>
          </div>

        </div>
      </div>

      {/* Safety Compliance & Legal Disclaimer Footer */}
      <div className="bg-slate-100/60 rounded-2xl p-5 border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
        <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          본 플랫폼 서비스 가이드는 개인정보 보호법, 신용정보 이용 및 보호 규범을 전적으로 수반하며 위변조 및 제3자의 부당 정보 가로채기가 방지되는 대학-기업 간 공신 인증 표준에 입각해 빌드되었습니다. 세종대학교 전산원 행정 심의를 경유한 소속 전공생들께 학비 장학금 혜택 및 연계 혜택을 투명하고 균일하게 양도하기 위한 규정을 대장합니다.
        </p>
      </div>

    </div>
  );
}
