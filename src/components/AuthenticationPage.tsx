import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Fingerprint, 
  School, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserRole, Student, Professor, Company } from '../types';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthenticationPageProps {
  students: Student[];
  professors: Professor[];
  companies: Company[];
  onLoginSuccess: (role: UserRole, id: string) => void;
  onOpenSignUp: () => void;
}

export default function AuthenticationPage({
  students,
  professors,
  companies,
  onLoginSuccess,
  onOpenSignUp
}: AuthenticationPageProps) {
  const [activeTab, setActiveTab] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill and login handler for demo accounts
  const handleQuickLogin = (role: UserRole, id: string, emailStr: string) => {
    setLoading(true);
    setError('');
    setEmail(emailStr);
    setPassword('demo-wkdruadl-1234');
    
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(role, id);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일 주소를 입력해 주십시오.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주십시오.');
      return;
    }

    setLoading(true);

    // If Supabase is configured, use actual Supabase auth
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password: password,
        });

        if (sbError) {
          setLoading(false);
          setError(`Supabase 실시간 인증 실패: ${sbError.message}`);
          return;
        }

        // Successfully logged in via Supabase! Let's match the user context.
        const userMetadata = data.user?.user_metadata || {};
        const metaRole = (userMetadata.role || activeTab) as UserRole;

        let foundId = '';
        if (metaRole === 'STUDENT') {
          const found = students.find(s => s.email.toLowerCase() === email.toLowerCase().trim());
          foundId = found ? found.id : `stud-sb-${data.user?.id}`;
        } else if (metaRole === 'PROFESSOR') {
          const found = professors.find(p => p.email.toLowerCase() === email.toLowerCase().trim());
          foundId = found ? found.id : `prof-sb-${data.user?.id}`;
        } else if (metaRole === 'COMPANY') {
          const found = companies.find(c => c.email.toLowerCase() === email.toLowerCase().trim());
          foundId = found ? found.id : `comp-sb-${data.user?.id}`;
        } else {
          foundId = 'admin';
        }

        setLoading(false);
        onLoginSuccess(metaRole, foundId);
        return;
      } catch (err: any) {
        setLoading(false);
        setError(`Supabase 통신 오류 및 로그인 장애: ${err.message || err}`);
        return;
      }
    }

    // Simulate real database checks (Simulation mode)
    setTimeout(() => {
      setLoading(false);
      
      if (activeTab === 'STUDENT') {
        const cleanedEmail = email.toLowerCase().trim();
        const found = students.find(s => s.email.toLowerCase() === cleanedEmail);
        if (found) {
          onLoginSuccess('STUDENT', found.id);
        } else if (cleanedEmail.includes('intern') || cleanedEmail.includes('student') || cleanedEmail === 'stud-intern') {
          onLoginSuccess('STUDENT', 'stud-intern');
        } else {
          // Graceful auto-creation fallback to avoid getting blocked
          onLoginSuccess('STUDENT', 'stud-intern');
        }
      } else if (activeTab === 'PROFESSOR') {
        const cleanedEmail = email.toLowerCase().trim();
        const found = professors.find(p => p.email.toLowerCase() === cleanedEmail);
        if (found) {
          onLoginSuccess('PROFESSOR', found.id);
        } else if (cleanedEmail.includes('prof') || cleanedEmail.includes('professor')) {
          onLoginSuccess('PROFESSOR', 'prof-kim');
        } else {
          onLoginSuccess('PROFESSOR', 'prof-kim');
        }
      } else if (activeTab === 'COMPANY') {
        const cleanedEmail = email.toLowerCase().trim();
        const found = companies.find(c => c.email.toLowerCase() === cleanedEmail);
        if (found) {
          onLoginSuccess('COMPANY', found.id);
        } else if (cleanedEmail.includes('company') || cleanedEmail.includes('comp') || cleanedEmail.includes('hr')) {
          onLoginSuccess('COMPANY', 'comp-mongdang');
        } else {
          // Graceful fallback
          onLoginSuccess('COMPANY', 'comp-mongdang');
        }
      } else if (activeTab === 'ADMIN') {
        // Always succeed for testing admin panel
        onLoginSuccess('ADMIN', 'admin');
      }
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[70vh]" id="auth-page-root">
      
      {/* Left Column: Platform introduction & security oath (5/12 column) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border border-indigo-950 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            대학 학술 검증 특화 인증 센터
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              지성의 가치와 <br />
              실증 기술을 연결하는 <br />
              <span className="text-indigo-400 font-black">1% 검증 네트워크</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              본 플랫폼은 단순 이력서 나열을 지양합니다. 대학 지도교수의 공식 암호 토큰 또는 디지털 검증 날인 서명이 등재된 전공 우수학생과, 국가가 선별 인가한 파트너 기업만 로그인하여 상호 신뢰 하에 인턴십을 계약할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-10 border-t border-white/10 relative z-10 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>학부/석박사 성과 보증 및 추천 대조</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>국세청 사업자 번호 연동 기업 신원 보증</span>
          </div>
          <div className="mt-4 pt-2 text-[10.5px] text-slate-500">
            © 2026 Mongdang Matcher Hub. All security credentials active.
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Login forms (7/12 column) */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
        
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-3xs space-y-6">
          
          {/* Connection Status Flag */}
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 text-xs">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight text-left">통합 사용자 로그인</h2>
            {isSupabaseConfigured() ? (
              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-md flex items-center gap-1 leading-none shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping"></span>
                실시간 연동 중
              </span>
            ) : (
              <span className="bg-slate-50 text-slate-550 font-bold px-2 py-1 rounded-md flex items-center gap-1 leading-none shrink-0">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                체험용 시뮬레이션
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 -mt-3 text-left">지정된 플랫폼 사용 등급에 맞추어 계정 자격을 검증합니다.</p>

          {/* Role Choice Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { setActiveTab('STUDENT'); setError(''); }}
              className={`py-2 text-[11.5px] sm:text-xs font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'STUDENT'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <School className="w-3.5 h-3.5 shrink-0" />
              <span>학생 회원</span>
            </button>

            <button
              onClick={() => { setActiveTab('PROFESSOR'); setError(''); }}
              className={`py-2 text-[11.5px] sm:text-xs font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'PROFESSOR'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>교수진</span>
            </button>

            <button
              onClick={() => { setActiveTab('COMPANY'); setError(''); }}
              className={`py-2 text-[11.5px] sm:text-xs font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'COMPANY'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>기업 회원</span>
            </button>

            <button
              onClick={() => { setActiveTab('ADMIN'); setError(''); }}
              className={`py-2 text-[11.5px] sm:text-xs font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 shrink-0" />
              <span>관리 총책</span>
            </button>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-rose-50 border border-rose-100/90 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                아이디 (이메일 주소)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder={
                    activeTab === 'STUDENT' ? 'intern@mongdang.com (홍인턴 데모)' :
                    activeTab === 'PROFESSOR' ? 'tjkim@sejong.ac.kr (김태진 교수)' :
                    activeTab === 'COMPANY' ? 'company@mongdang.com (몽당소프트 데모)' : 'admin@mongdang.com (관리자 데모)'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <label className="font-bold text-slate-500 uppercase tracking-wide">
                  비밀번호
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('데모 환경입니다. 임의의 패스워드로 로그인 가능합니다.'); }} className="text-indigo-650 hover:underline font-semibold">
                  분실하셨나요?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="아무 패스워드나 기재하십시오 (예시: 1234)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 💡 Quick Demo Credentials Alert Box */}
            <div className="p-3.5 bg-indigo-50/50 border border-indigo-150/70 rounded-xl space-y-1.5 text-left text-[11px] leading-relaxed">
              <span className="font-extrabold text-indigo-805 block">💡 실무 테스트용 공식 프리셋 계정</span>
              <ul className="space-y-1 text-slate-650 font-medium">
                <li>• <strong className="text-slate-900">플랫폼 최고 관리자:</strong> <code className="bg-indigo-100/60 px-1 py-0.2 rounded text-indigo-700 font-mono">admin@mongdang.com</code></li>
                <li>• <strong className="text-slate-900">1호 인턴 학생 계정:</strong> <code className="bg-indigo-100/60 px-1 py-0.2 rounded text-indigo-700 font-mono">intern@mongdang.com</code></li>
                <li>• <strong className="text-slate-900">1호 협력 기업 계정:</strong> <code className="bg-indigo-100/60 px-1 py-0.2 rounded text-indigo-700 font-mono">company@mongdang.com</code></li>
              </ul>
              <p className="text-[10px] text-slate-400 !mt-2">※ 비밀번호 자격은 자유(임의의 무작위 값)이며, 탭 전환 후 우측 하단 퀵 로그인 버튼을 이용하셔도 즉시 로그인이 가능합니다.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>보안 인증 로그인</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* SignUp bridge links */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">아직 계정이 가입되어 있지 않습니까?</span>
            <button
              onClick={onOpenSignUp}
              className="text-indigo-650 hover:text-indigo-700 font-bold hover:underline cursor-pointer"
            >
              인증 회원 등록하기
            </button>
          </div>
        </div>

        {/* 🎯 Quick Simulated Demo-Accounts Login section (extremely useful for quick-testing the flow) */}
        <div className="bg-slate-50 border border-slate-200/85 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-1.5">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">심층 원클릭 데모 포탈 (데모 전용)</h4>
              <p className="text-[10px] text-slate-405">교수 서명 발급 및 매칭 계약 결제 흐름 테스트를 위해 원하는 계정을 즉시 로드합니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Student list options */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-150">
              <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-indigo-600 block">🎓 제자 (학생) 선택</span>
              
              <div className="space-y-1.5">
                {students.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleQuickLogin('STUDENT', s.id, s.email)}
                    className="w-full text-left text-[11px] p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition font-medium flex items-center justify-between block"
                  >
                    <span>{s.name} ({s.university})</span>
                    <span className={`text-[9px] px-1.5 rounded-sm font-bold ${s.recommendationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.recommendationStatus === 'VERIFIED' ? '추천확정' : '추천대기'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professors / Employers options */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-150">
              <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-indigo-600 block">👨‍🏫 스승(교수) & 🏢 기업 선택</span>
              
              <div className="space-y-1.5">
                {professors.slice(0, 1).map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleQuickLogin('PROFESSOR', p.id, p.email)}
                    className="w-full text-left text-[11px] p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition font-medium flex items-center justify-between block"
                  >
                    <span>👨‍🏫 {p.name} 교수 ({p.department.substring(0, 5)})</span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 rounded-sm">토큰발행</span>
                  </button>
                ))}

                {companies.slice(0, 2).map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleQuickLogin('COMPANY', c.id, c.email)}
                    className="w-full text-left text-[11px] p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition font-medium flex items-center justify-between block"
                  >
                    <span>🏢 {c.name} 인사팀</span>
                    <span className={`text-[9px] px-1.5 rounded-sm font-bold ${c.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>
                      {c.verificationStatus === 'VERIFIED' ? '정규인증' : '임시허가'}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => handleQuickLogin('ADMIN', 'admin', 'admin@mongdang.com')}
                  className="w-full text-left text-[11px] p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition font-semibold text-amber-700 flex items-center justify-between block"
                >
                  <span>💻 플랫폼 총괄 관리자</span>
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-black px-1.5 rounded-sm">SYSADMIN</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
